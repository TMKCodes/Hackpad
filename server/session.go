package main

import (
	"io"
	"database/sql"
	"encoding/json"
	_ "github.com/mattn/go-sqlite3"
)

type session struct {
	Database *sql.DB
}

func newSession(database *sql.DB) *session {
	return &session{Database : database}
}

func (this *session) Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PUT":
		this.POST(w, r)
	case "PATCH":
		this.PATCH(w, r)
	case "DELETE":
		this.DELETE(w, r)
	default:
		io.WriteString(w, "Wrong HTTP method.\r\n")
	}
}

func (this *session) PUT(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Error string
	}
	result.Error = ""
	rows, err := this.Database.Query("SELECT * FROM `account` WHERE `username` = $1 && `password` = $2", r.FormValue("username"), r.FormValue("password"))
	if err != nil {
		result.Error = "session.Database.Query: ", err.Error()
		b, _ := json.Marshal(result)
		io.WriteString(w, string(b))
		return
	}

}

func (this *session) PATCH(w http.ResponseWriter, r *http.Request) {

}

func (this *session) DELETE(w http.ResponseWriter, r *http.Request) {

}

