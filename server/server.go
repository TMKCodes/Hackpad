package main

import (
	"io"
	"log"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

type configuration struct {
	Addr string `json:"Addr"`
	CertFile string `json:"CertFile"`
	KeyFile string `json:"KeyFile"`
	Location string `json:"Location"`
}

func newConfig(filename string) *configuration {
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Fatal("ioutil.ReadFile: ", err);
	}
	var config configuration
	err = json.Unmarshal(file, &config);
	if err != nil {
		log.Fatal("json.Unmarshal: ", err);
	}
	return &config
}

func handler(w http.ResponseWriter, r  *http.Request) {
	config := newConfig(".fudocs.conf")
	fudocs := newFudocs(config.Location)
	switch r.Method {
	case "":
		fudocs.GET(w, r)
	case "GET":
		fudocs.GET(w, r)
	case "HEAD":
		io.WriteString(w, "")
	case "POST":
		fudocs.POST(w, r)
	case "PUT":
		fudocs.PUT(w, r)
	case "DELETE":
		fudocs.DELETE(w, r)
	default:
		io.WriteString(w, "Wrong HTTP method.\n")
	}
}

func main() {
	config := newConfig(".fudocs.conf")
	http.HandleFunc("/", handler)
	if config.CertFile == "" && config.KeyFile == "" {
		err := http.ListenAndServe(config.Addr, nil)
		if err != nil {
			log.Fatal("http.ListenAndServe: ", err)
		}
	} else {
		err := http.ListenAndServeTLS(config.Addr, config.CertFile, config.KeyFile, nil)
		if err != nil {
			log.Fatal("http.ListenAndServeTLS: ", err)
		}
	}
}
