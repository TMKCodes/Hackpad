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


