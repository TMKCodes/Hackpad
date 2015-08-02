package main

import (
	"io"
	"fmt"
	//"time"
	"bufio"
	//"strconv"
	"strings"
	"net/http"
	"io/ioutil"
	"database/sql"
	"encoding/json"
	_ "github.com/mattn/go-sqlite3"

)

type docs struct {
	Database *sql.DB
	Session *session
}

func newFudocs(database *sql.DB, session *session) *docs {
	return &docs{Database : database, Session : session}
}

func (this *docs) Handler(w http.ResponseWriter, r  *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*");
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

func (this *docs) POST(w http.ResponseWriter, r *http.Request) {
	// confirm that the session key is valid
	res := this.Session.Confirm(r.FormValue("session"))
	if res != "true" {
		http.Error(w, res, 403)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"));
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	if r.FormValue("create") == "true" {
		path := strings.Replace(r.URL.Path, "/docs", "", -1)
		var document int64
		err = this.Database.QueryRow("SELECT id FROM document WHERE path = ?;", path).Scan(&document)
		if err == sql.ErrNoRows {
			_, err = this.Database.Exec("INSERT INTO document (account, path, data, created, updated) VALUES (?, ?, ?, ?, ?);", who, path, r.FormValue("file"), r.FormValue("timestamp"), r.FormValue("timestamp"))
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			http.Error(w, "Created", 201)
			return
		}
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		_, err = this.Database.Exec("UPDATE document SET data = ?, updated = ? WHERE path = ?;", r.FormValue("file"), r.FormValue("timestamp"), path)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		http.Error(w, "Accepted", 202)
	} else {
		r.ParseMultipartForm(32 << 20)
		file, header, err := r.FormFile("import")
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer file.Close()
		if(strings.Contains(header.Filename, ".md") == false) {
			http.Error(w, "Wrong filetype", 400)
			return
		}
		reader := bufio.NewReader(file)
		contents, err := ioutil.ReadAll(reader)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		header.Filename = strings.Replace(header.Filename, ".md", "", -1)
		header.Filename = fmt.Sprint("/", header.Filename)
		var document int64
		err = this.Database.QueryRow("SELECT id FROM document WHERE path = '?';", header.Filename).Scan(&document)
		if err == sql.ErrNoRows {
			_, err = this.Database.Exec("INSERT INTO document (account, path, data, created, updated) VALUES (?, ?, ?, ?, ?);", who, header.Filename, string(contents), r.FormValue("timestamp"), r.FormValue("timestamp"))
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			var document struct {
				Account int64
				Path string
				Data string
				Created string
				Updated string
			}
			err := this.Database.QueryRow("SELECT account, path, data, created, updated FROM document WHERE path = ?;", header.Filename).Scan(&document.Account, &document.Path, &document.Data, &document.Created, &document.Updated)
			if err == sql.ErrNoRows {
				http.Error(w, "Not Found", 404)
				return
			}
			if err != nil {
				http.Error(w, "Internal Server Error", 500)
				return
			}
			b, _ := json.Marshal(document)
			io.WriteString(w, string(b))
			//http.Error(w, "Created", 200);
			return
		} else if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
	}
}

func (this *docs) GET(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("list") == "true" {
		res := this.Session.Confirm(r.FormValue("session"))
		if res != "true" {
			http.Error(w, res, 403)
			return
		}
		who, err := this.Session.Whos(r.FormValue("session"));
		type document struct {
			Account int64
			Path string
			Data string
			Created string
			Updated string
		}
		var documents []document
		rows, err := this.Database.Query("SELECT account, path, data, created, updated FROM document WHERE account = ?;", who)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer rows.Close()
		for rows.Next() {
			var doc document
			err = rows.Scan(&doc.Account, &doc.Path, &doc.Data, &doc.Created, &doc.Updated)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			documents = append(documents, doc)
		}
		b, _ := json.Marshal(documents)
		io.WriteString(w, string(b))
	} else {
		path := strings.Replace(r.URL.Path, "/docs", "", -1)
		var document struct {
			Account int64
			Path string
			Data string
			Created string
			Updated string
		}
		err := this.Database.QueryRow("SELECT account, path, data, created, updated FROM document WHERE path = ?;", path).Scan(&document.Account, &document.Path, &document.Data, &document.Created, &document.Updated)
		if err == sql.ErrNoRows {
			http.Error(w, "Not Found", 404)
			return
		}
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			return
		}
		b, _ := json.Marshal(document);
		io.WriteString(w, string(b))
	}
}

func (this *docs) PUT(w http.ResponseWriter, r *http.Request) {
	
}

func (this *docs) DELETE(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request (Session key was empty)", 400)
		return
	}
	res := this.Session.Confirm(r.FormValue("session"))
	if res != "true" {
		http.Error(w, res, 403)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"))
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	var document struct {
		ID int64
		Account int64
		Path string
		Data string
		Created string
		Updated string
	}
	err = this.Database.QueryRow("SELECT * FROM document WHERE path = ?;", path).Scan(&document.ID, &document.Account, &document.Path, &document.Data, &document.Created, &document.Updated)
	if err == sql.ErrNoRows {
		http.Error(w, "Not Found (Could not find the document)", 404)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	if document.Account == who {
		_, err = this.Database.Exec("DELETE FROM document WHERE id = ?;", document.ID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		http.Error(w, "OK", 200)
		return
	} else {
		http.Error(w, "Forbidden (The document is not yours to delete)", 403)
		return
	}
}
