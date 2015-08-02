-- This is a Fudocs table creation sql file

CREATE TABLE IF NOT EXISTS account (
	id INTEGER PRIMARY KEY,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
	id INTEGER PRIMARY KEY,
	account INTEGER NOT NULL,
	key TEXT NOT NULL,
	FOREIGN KEY (account) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS document (
	id INTEGER PRIMARY KEY,
	account INTEGER NOT NULL,
	path TEXT NOT NULL,
	data BLOB NOT NULL,
	created TEXT NOT NULL,
	updated TEXT NOT NULL,
	FOREIGN KEY (account) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS history (
	id INTEGER PRIMARY KEY,
	account INTEGER NOT NULL,
	document INTEGER NOT NULL,
	change TEXT NOT NULL,
	at INTEGER NOT NULL,
	timestamp TEXT NOT NULL,
	FOREIGN KEY (account) REFERENCES account(id)
	FOREIGN KEY (document) REFERENCES document(id)

);
