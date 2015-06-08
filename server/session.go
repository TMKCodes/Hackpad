package main

import (
	"io"
	"net/http"
	"database/sql"
	//"encoding/json"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type session struct {
	Database *sql.DB
}

func newSession(database *sql.DB) *session {
	return &session{Database : database}
}

func (this *session) Confirm(key string) {

}

func (this *session) Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		this.POST(w, r)
	case "PUT":
		this.PUT(w, r)
	case "DELETE":
		this.DELETE(w, r)
	default:
		io.WriteString(w, "Wrong HTTP method.\r\n")
	}
}

func (this *session) POST(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("username") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if r.FormValue("password") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	var password string
	err := this.Database.QueryRow("SELECT `password` FROM `account` WHERE `username` = $1", r.FormValue("username")).Scan(&password)
	if err == sql.ErrNoRows {
		http.Error(w, "Not Found", 404)
		return
	}
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	err = bcrypt.CompareHashAndPassword(password, r.FormValue("password"))
	if err != nil {
		http.Error(w, "Forbidden", 403)
	}
	// create random session key and save it to the database and send as json to client.
}

func (this *session) PUT(w http.ResponseWriter, r *http.Request) {
	// confirm that session key is valid, create new key and replace the confirmed key in the database and send the new key to the client.
}

func (this *session) DELETE(w http.ResponseWriter, r *http.Request) {
	// confirm that session key is valid and delete the session key from database.
}

