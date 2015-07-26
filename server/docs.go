package main

import (
	"io"
	"time"
	"strings"
	"net/http"
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
	if this.Session.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Forbidden", 403)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"));
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	var document int64
	err = this.Database.QueryRow("SELECT id FROM document WHERE path = ?;", path).Scan(&document)
	if err == sql.ErrNoRows {
		_, err = this.Database.Exec("INSERT INTO document (account, path, data, created, updated) VALUES (?, ?, ?, ?, ?);", who, path, r.FormValue("file"), time.Now().Unix(), time.Now().Unix())
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
	http.Error(w, "Entity Already Exists", 422)
}

func (this *docs) GET(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("long-pull") != "" {
		path := strings.Replace(r.URL.Path, "/docs", "", -1)
		var document struct {
			ID int64
			Updated int64
		}
		err := this.Database.QueryRow("SELECT id, updated FROM document WHERE path = ?;", path).Scan(&document.ID, &document.Updated)
		if err == sql.ErrNoRows {
			http.Error(w, "Not Found", 404)
			return
		}
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		end := time.Now().Unix() + 30
		patchFound := false
		for time.Now().Unix() <= end {
			var history struct {
				ID int64
				Account int64
				Document int64
				Change string
				At int64
				Timestamp int64
			}
			rows, err := this.Database.Query("SELECT * FROM history WHERE document = ? AND timestamp > ?;", document.ID, document.Updated)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			defer rows.Close()
			if rows.Next() == true {
				err = rows.Scan(&history.ID, &history.Account, &history.Document, &history.Change, &history.At, &history.Timestamp)
				if err != nil {
					http.Error(w, "Internal Server Error", 500)
					return
				}
			} else {
				time.Sleep(time.Second)
				continue
			}
			if rows.Err() != nil {
				http.Error(w, "Internal Server Error", 500)
				return
			}
			b, _ := json.Marshal(history);
			io.WriteString(w, string(b))
			patchFound = true
			break
		}
		if patchFound != true {
			http.Error(w, "Not Found", 404)
			return
		}
	} else {
		path := strings.Replace(r.URL.Path, "/docs", "", -1)
		var document struct {
			Account int64
			Path string
			Data string
			Created int64
			Updated int64
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
	// confirm that the session key is valid and confirm that the session use is owner of the file
	if r.FormValue("change") == "" {
		http.Error(w, "Bad Request (Change key was empty)", 400)
		return
	}
	if r.FormValue("at") == "" {
		http.Error(w, "Bad Request (At key was empty)", 400)
		return
	}
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request (Session key was empty)", 400)
		return
	}
	if this.Session.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Forbidden (Could not confirm session)", 403)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"))
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	var document struct {
		ID int64
		Account int64
		Path string
		Data string
		Created int64
		Updated int64
	}
	err = this.Database.QueryRow("SELECT * FROM document WHERE path = ?;", path).Scan(&document.ID, &document.Account, &document.Path, &document.Data, &document.Created, &document.Updated);
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	_, err = this.Database.Exec("INSERT INTO history (account, document, change, at, timestamp) VALUES (?,?,?,?,?);", who, document.ID, r.FormValue("change"), r.FormValue("at"), time.Now().Unix())
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	http.Error(w, "OK", 200)
}

func (this *docs) DELETE(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("session") == "" {
		http.Error(w, "Bad Request (Session key was empty)", 400)
		return
	}
	if this.Session.Confirm(r.FormValue("session")) == false {
		http.Error(w, "Forbidden (Could not confirm session)", 403)
		return
	}
	who, err := this.Session.Whos(r.FormValue("session"))
	path := strings.Replace(r.URL.Path, "/docs", "", -1)
	var document struct {
		ID int64
		Account int64
		Path string
		Data string
		Created int64
		Updated int64
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
