-- This is a Fudocs table creation sql file

CREATE TABLE IF NOT EXISTS account (
	id INT NOT NULL PRIMARY KEY,
	username TEXT NOT NULL,
	password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
	id INT NOT NULL PRIMARY KEY,
	account INT NOT NULL,
	key TEXT NOT NULL,
	FOREIGN KEY (account) REFERENCES account(id)
);


