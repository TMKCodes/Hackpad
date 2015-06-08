package main

import (
	"os"
	"io"
	"time"
	"strings"
	"strconv"
	"os/exec"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

type fudocs struct {
	Location string
	Session *session
}

func newFudocs(location string, session *session) *fudocs {
	return &fudocs{Location : location, Session : session}
}

func (this *fudocs) Handler(w http.ResponseWriter, r  *http.Request) {
	switch r.Method {
	case "POST":
		this.POST(w, r)
	case "GET":
		this.GET(w, r)
	case "PUT":
		this.PUT(w, r)
	case "DELETE":
		this.DELETE(w, r)
	default:
		http.Error(w, "Method Not Allowed", 405)
	}
}

func (this *fudocs) POST(w http.ResponseWriter, r *http.Request) {
	// confirm that the session key is valid
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	err := ioutil.WriteFile(this.Location + path + ".md", []byte(r.FormValue("File")), 0644)
	if err != nil {
		http.Error(w, "Not Found", 404)
		return
	}
	// add the file name to database with owner
	http.Error(w, "Created", 201)
}

func (this *fudocs) GET(w http.ResponseWriter, r *http.Request) {
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	var result struct {
		File string
	}
	if path == "/" {
		http.Error(w, "Not Found", 404)
		return
	}
	file, err := ioutil.ReadFile(this.Location + path + ".md")
	result.File = string(file)
	if err != nil {
		http.Error(w, "Not Found", 404)
		return
	}
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}

func (this *fudocs) PUT(w http.ResponseWriter, r *http.Request) {
	// confirm that the session key is valid and confirm that the session use is owner of the file
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	t := strconv.FormatInt(time.Now().Unix(), 10)
	err := ioutil.WriteFile(this.Location + path + ".md.patch-" + t, []byte(r.FormValue("Patch")), 0644)
	if err != nil {
		http.Error(w, "Not Found", 404)
		return
	}
	err = exec.Command("patch", this.Location + path + ".md", this.Location + path + ".md.patch-" + t).Run()
	if err != nil {
		http.Error(w, "", 500)
		return
	}
	http.Error(w, "OK", 200)
}

func (this *fudocs) DELETE(w http.ResponseWriter, r *http.Request) {
	// confirm that the session key is valid and confirm that the session user is owner of the file
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	err := os.Remove(this.Location + path + ".md")
	if err != nil {
		http.Error(w, "Not Found", 404)
		return
	}
	http.Error(w, "OK", 200)
}
