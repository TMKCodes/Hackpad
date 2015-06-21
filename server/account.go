package main

import (
	"io"
	"strings"
	"strconv"
	"net/http"
	"database/sql"
	"encoding/json"
	//"encoding/base64"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type account struct {
	Database *sql.DB
	Session *session
}

func newAccount(database *sql.DB, session *session) *account {
	return &account{Database : database, Session : session}
}

func (this *account) Handler(w http.ResponseWriter, r *http.Request) {
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
		io.WriteString(w, "Wrong HTTP method.\r\n")
	}
}

func (this *account) POST(w http.ResponseWriter, r *http.Request) {
	// Create account
	if r.FormValue("username") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if r.FormValue("password") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if r.FormValue("email") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	password, err := bcrypt.GenerateFromPassword([]byte(r.FormValue("password")), 10)
	if err != nil {
		http.Error(w, "Internal Server Error, bcrypt.GenerateFromPassword", 500)
		return
	}
	_, err = this.Database.Exec("INSERT INTO account (username, password, email) VALUES (?, ?, ?);", r.FormValue("username"), string(password), r.FormValue("email"))
	if err != nil {
		http.Error(w, "Internal Server Error, this.Database.Exec", 500)
		return
	}
	http.Error(w, "OK", 200)
}

func (this *account) GET(w http.ResponseWriter, r *http.Request) {
	// Get account
	id, err := strconv.ParseInt(strings.Replace(r.URL.Path, "/account/", "", -1), 10, 64)
	if err != nil {
		http.Error(w, "Bad Request", 400)
		return
	}
	var result struct {
		Username string
		Email string
	}
	err = this.Database.QueryRow("SELECT username, email FROM account WHERE id = $1;", id).Scan(&result.Username, &result.Email)
	if err == sql.ErrNoRows {
		http.Error(w, "Not Found", 404)
		return
	}
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}

func (this *account) PUT(w http.ResponseWriter, r *http.Request) {
	// Update account information
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if this.Session.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Forbidden", 403)
		return
	}
	if r.FormValue("username") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if r.FormValue("password") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if r.FormValue("email") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"));
	if err != nil {
		http.Error(w, "Not Found", 404)
	}
	password, err := bcrypt.GenerateFromPassword([]byte(r.FormValue("password")), 10)
	if err != nil {
		http.Error(w, "Internal Server Error, bcrypt.GenerateFromPassword", 500)
		return
	}
	_, err = this.Database.Exec("UPDATE account SET username = ?, password = ?, email = ? WHERE id = ?;", r.FormValue("username"), password, r.FormValue("email"), who)
	if err != nil {
		http.Error(w, "Internal Server error, this.Database.Exec", 500)
		return
	}
	http.Error(w, "OK", 200)
}

func (this *account) DELETE(w http.ResponseWriter, r *http.Request) {
	// delete account
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if this.Session.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Forbidden", 403)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"));
	if err != nil {
		http.Error(w, "Not Found", 404)
	}
	_, err = this.Database.Exec("DELETE FROM account WHERE id = ?;", who)
	if err != nil {
		http.Error(w, "Internal Server error, this.Database.Exec", 500)
		return
	}
	http.Error(w, "OK", 200)
}
