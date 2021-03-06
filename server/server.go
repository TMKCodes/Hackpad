package main

import (
	"log"
	"net/http"
	"io/ioutil"
	"database/sql"
	"encoding/json"
	_ "github.com/mattn/go-sqlite3"
)

type configuration struct {
	HTTPAddr string `json:"HTTPAddr"`
	HTTPSAddr string `json:"HTTPSAddr"`
	CertFile string `json:"CertFile"`
	KeyFile string `json:"KeyFile"`
	Sqlite string `json:"Sqlite"`
	Location string `json:"client"`
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

func main() {
	config := newConfig(".hackpad.conf")
	database, err := sql.Open("sqlite3", config.Sqlite)
	if err != nil {
		log.Fatal("sql.Open: ", err);
	}
	http.Handle("/", http.FileServer(http.Dir(config.Location)))
	session := newSession(database)
	http.HandleFunc("/session/", session.Handler)
	fudocs := newFudocs(database, session)
	http.HandleFunc("/docs/", fudocs.Handler)
	account := newAccount(database, session)
	http.HandleFunc("/account/", account.Handler)
	clock := newClock(database, session)
	http.HandleFunc("/clock/", clock.Handler)
	if config.CertFile == "" && config.KeyFile == "" {
		http.ListenAndServe(config.HTTPAddr, nil)
	} else {
		go http.ListenAndServe(config.HTTPAddr, nil)
		go http.ListenAndServeTLS(config.HTTPSAddr, config.CertFile, config.KeyFile, nil)
	}
}
