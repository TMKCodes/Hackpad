package main

import (
	"io"
	"errors"
	"strings"
	"strconv"
	"net/http"
	"math/rand"
	"database/sql"
	"encoding/json"
	"encoding/base64"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type session struct {
	Database *sql.DB
}

func newSession(database *sql.DB) *session {
	return &session{Database : database}
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

func (this *session) Confirm(session string) bool {
	decoded, err := base64.StdEncoding.DecodeString(session)
	if err != nil {
		return false
	}
	data := strings.Split(string(decoded), "||")
	var key string
	id, err := strconv.ParseInt(data[0], 10, 64);
	if err != nil {
		return false;
	}
	err = this.Database.QueryRow("SELECT key FROM session WHERE id = ?;", id).Scan(&key)
	if err == sql.ErrNoRows {
		return false
	}
	if err != nil {
		return false
	}
	if key == data[1] {
		return true
	} else {
		return false
	}
}

func (this *session) Generate(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func (this *session) Whos(session string) (int64, error) {
	if this.Confirm(session) == false {
		return 0, errors.New("Failed to confirm session.")
	}
	decoded, err := base64.StdEncoding.DecodeString(session)
	if err != nil {
		return 0, err
	}
	data := strings.Split(string(decoded), "||")
	var account int64
	err = this.Database.QueryRow("SELECT account FROM session WHERE id = ? AND key = ?;", data[0], data[1]).Scan(&account)
	if err != nil {
		return 0, err
	}
	return account, nil
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
	var account int64
	var password string
	err := this.Database.QueryRow("SELECT id, password FROM account WHERE username = ?;", r.FormValue("username")).Scan(&account, &password)
	if err == sql.ErrNoRows {
		http.Error(w, "Not Found", 404)
		return
	}
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(r.FormValue("password")))
	if err != nil {
		http.Error(w, "Forbidden", 403)
		return
	}
	// create random session key and save it to the database and send as json to client.
	key := this.Generate(24);
	_, err = this.Database.Exec("INSERT INTO session (account, key) VALUES (?, ?);", account, key)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	var result struct {
		Session string
	}
	var session int64
	err = this.Database.QueryRow("SELECT id FROM session WHERE account = ? AND key = ?;", account, key).Scan(&session)
	if err == sql.ErrNoRows {
		http.Error(w, "Not Found", 404)
		return
	}
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	result.Session = base64.StdEncoding.EncodeToString([]byte(strings.Join([]string{strconv.FormatInt(session, 10), "||", key}, "")))
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))
}

func (this *session) PUT(w http.ResponseWriter, r *http.Request) {
	// confirm that session key is valid, create new key and replace the confirmed key in the database and send the new key to the client.
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request, r.FormValue(\"session\")", 400)
		return
	}
	if this.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Not Found, this.Confirm(r.FormValue(\"session\")", 404)
		return
	}
	decoded, err := base64.StdEncoding.DecodeString(r.FormValue("session"))
	if err != nil {
		http.Error(w, "Bad Request, base64.StdEncoding.DecodeString(r.FormValue(\"session\")", 400)
		return
	}
	data := strings.Split(string(decoded), "||")
	key := this.Generate(24);
	session, err := strconv.ParseInt(data[0], 10, 64)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	_, err = this.Database.Exec("UPDATE session SET key = ? WHERE id = ?;", key, session)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	var result struct {
		Session string
	}
	result.Session = base64.StdEncoding.EncodeToString([]byte(strings.Join([]string{data[0], "||", key}, "")))
	b, _ := json.Marshal(result)
	io.WriteString(w, string(b))

}

func (this *session) DELETE(w http.ResponseWriter, r *http.Request) {
	// confirm that session key is valid and delete the session key from database.
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request", 400)
		return
	}
	if this.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Not Found", 404)
		return
	}
	decoded, err := base64.StdEncoding.DecodeString(r.FormValue("session"))
	if err != nil {
		http.Error(w, "Bad Request", 400)
		return
	}
	data := strings.Split(string(decoded), "||")
	session, err := strconv.ParseInt(data[0], 10, 64)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	_, err = this.Database.Exec("DELETE FROM session WHERE id = ? AND key = ?;", session, data[1])
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
	http.Error(w, "OK", 200)
}

