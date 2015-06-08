package main

import (
	"os"
	"io"
	"time"
	"strconv"
	"os/exec"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

type fudocs struct {
	Location string
}

func newFudocs(Location string) *fudocs {
	return &fudocs{Location : Location}
}

func (this *fudocs) GET(w http.ResponseWriter, r *http.Request) {
	var result struct {
		File string
		Error string
	}
	file, err := ioutil.ReadFile(this.Location + r.URL.Path + ".md")
	result.File = string(file)
	result.Error = ""
	if err != nil {
		result.Error = "ioutil.Readfile: " + err.Error()
	}
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}

func (this *fudocs) PATCH(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Error string
	}
	t := strconv.FormatInt(time.Now().Unix(), 10)
	err := ioutil.WriteFile(this.Location + r.URL.Path + ".md.patch-" + t, []byte(r.FormValue("Patch")), 0644)
	result.Error = ""
	if err != nil {
		result.Error = "ioutil.WriteFile: " + err.Error()
	}
	err = exec.Command("patch", this.Location + r.URL.Path + ".md", this.Location + r.URL.Path + ".md.patch-" + t).Run()
	if err != nil {
		result.Error = "exec.Command: " + err.Error()
	}
	/*err = os.Remove(this.Location + r.URL.Path + ".md.patch-" + t)
	result.Error = ""
	if err != nil {
		result.Error = "os.Remove: " + err.Error()
	}*/
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}

func (this *fudocs) PUT(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Error string
	}
	err := ioutil.WriteFile(this.Location + r.URL.Path + ".md", []byte(r.FormValue("File")), 0644)
	result.Error = ""
	if err != nil {
		result.Error = "ioutil.WriteFile: " + err.Error()
	}
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}

func (this *fudocs) DELETE(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Error string
	}
	err := os.Remove(this.Location + r.URL.Path + ".md")
	result.Error = ""
	if err != nil {
		result.Error = "os.Remove: " + err.Error()
	}
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}
