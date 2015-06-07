package main

import (
	"io"
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
	b, _ := json.Marshal(result);
	io.WriteString(w, string(b));
}

func (this *fudocs) POST(w http.ResponseWriter, r *http.Request) {

}

func (this *fudocs) PUT(w http.ResponseWriter, r *http.Request) {

}

func (this *fudocs) DELETE(w http.ResponseWriter, r *http.Request) {

}
