# Hackpad

This is a application programming interface for managing markdown documents with real time collaboration features. This project is made for http://pori.hacklab.fi hacker community.

## Hackpad API server

The Hackpad API server has been programmed with Go.

### Database installation

Hackpad uses SQLite3 which means you can just open new database easily with the following command at the main folder of the project. 

```
sqlite3 server/.hackpad.db < server/tables.sql
```

If you want to use another location from the server folder for storing the database file or another name for the database file then you also must do the corresponding changes in `server/.hackpad.conf`

### Server configuration

The `server/.hackpad.conf` file contains the server configuration in json.

| Parameter | Meaning                                 | defaults |
|-----------|-----------------------------------------|----------|
| HTTPAddr  | HTTP address and port                   | :10080   |
| HTTPSAddr | HTTPS address and port                  | :10443   |
| CertFile  | Certificate file location for HTTPS     |          |
| KeyFile   | Certificate key file location for HTTPS |          |
| Sqlite    | SQLite3 database file                   | session  |


### Running the server

The server has been programmed with Go and it will return the web client at HTTPAddr location. You can start the server with the following command

```
go run server.go docs.go session.go account.go
```

You can also build the server and run it with the compiled file, but I like using go run for testing purposes.

### Account

| Method | URL         | P1       | P2       | P3       | P4    | Success Return                                      |
|--------|-------------|----------|----------|----------|-------|-----------------------------------------------------|
| POST   | /account/   | username | password | email    |       | OK 200                                              |
| GET    | /account/id |          |          |          |       | {"Username":"TMKCodes","Email":"toni@mussukka.org"} |
| PUT    | /account/   | session  | username | password | email | OK 200                                              |
| DELETE | /account/   | session  |          |          |       |                                                     |

### Session

| Method | URL       | P1       | P2       | Success Return                                     |
|--------|-----------|----------|----------|----------------------------------------------------|
| POST   | /session/ | username | password | {"Session":"MXx8WFZsQnpnYmFpQ01SQWpXd2hUSGN0Y3VB"} |
| PUT    | /session/ | session  |          | {"Session":"MXx8eGh4S1FGRGFGcExTakZiY1hvRUZmUnNX"} |
| DELETE | /session/ | session  |          | OK 200                                             |

### Docs

| Method | URL                       | P1      | P2      | p3 | Success Return                                                                                                           |
|--------|---------------------------|---------|---------|----|--------------------------------------------------------------------------------------------------------------------------|
| POST   | /docs/name                | file    | session |    | Created 201                                                                                                              |
| PUT    | /docs/name                | session | change  |    | {"Session":"MXx8eGh4S1FGRGFGcExTakZiY1hvRUZmUnNX"}                                                                       |
| GET    | /docs/name                |         |         |    | {"Account":1,"Path":"/hello_world","Data":"Testing This file system creation","Created":1434932579,"Updated":1434932579} |
| GET    | /docs/name?long-pull=true |         |         |    | {"ID":1,"Account":1,"Document":1,"Change":"+New Change","At":6,"Timestamp":1434932683}                                   |
| GET    | /docs/name?list=true      | session |         |    |                                                                                                                          |   
| DELETE | /docs/                    | session |         |    | OK 200                                                                                                                   |
