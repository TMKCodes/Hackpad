// This is Javascript browser code to talk with the server API.
var hackpad = {
	account : {
		create : function(username, password, email) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/account/",
				type: "POST",
				async: false,
				data : {
					username : username,
					password : password,
					email : email
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) ret = true;
			});
			return ret;
		},
		select : function(id) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/account/" + id,
				type: "GET",
				async: false,
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) ret = $.parseJSON(data);
			});
			return ret;
		},
		update : function(session, username, password, email) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/account/",
				type: "PUT",
				async: false,
				data: {
					session : session,
					username : username,
					password : password,
					email : email
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) ret = true;
			});
			return ret;
		},
		remove : function(session) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/account/" + "?session=" + session,
				type: "DELETE",
				async: false,
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) ret = true;
			});
			return ret;
		}
	},
	session : {
		create : function(username, password) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/session/",
				type: "POST",
				async: false,
				data : {
					username : username,
					password : password
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					data = $.parseJSON(data);
					ret = data.Session;
				}
			});
			return ret;
		},
		update : function(session) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/session/",
				type: "PUT",
				async: false,
				data : {
					session : session
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					data = $.parseJSON(data);
					ret = data.Session;
				}
			});
			return ret;
		},
		remove : function(session) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/session/" + "?session=" + session,
				type: "DELETE",
				async: false,
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					ret = true;
				}
			});
			return ret;
		},
	},
	clock : {
		add : 0,
		timestamp : function() {
			time = Date.now() + hackpad.clock.add;
			return time;
		},
		get : function() {
			startTime = Date.now();
			$.ajax({
				url: config.serverEndpoint + "/clock/",
				type: "GET",
				async: false,
				data : { }
			}).done(function(data, textStatus, jqXHR) {
				endTime = Date.now();
				runTime = endTime - startTime;
				if(jqXHR.status == 200) {
					serverTime = Math.floor(parseInt(data) / 1000000);
					console.log(serverTime);
					console.log(runTime);
					console.log(Date.now());
					hackpad.clock.add = serverTime - Date.now() + runTime;
					console.log(hackpad.clock.add);
				}
			});
		}
	},
	doc : {
		current : null,
		updates : [],
		generate : {
			name : function(length) {
				var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				var name = "";
				for(var i = 0; i < length; i++) {
					name += characters.charAt(Math.floor(Math.random() * characters.length));
				}
				return name;
			}
		},
		create : function(session, name, file) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/docs/" + name,
				type: "POST",
				async: false,
				data : {
					session : session,
					file : file,
					create : "true",
					timestamp : Date.now()
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 201) {
					ret = true;
				} else if (jqXHR.status == 202) {
					ret = true;
				}
			});
			return ret;
		},
		save : function(session, name, file) {
			return hackpad.doc.create(session, name, file);
		},
		list : function(session) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/docs/" + "?list=true",
				type: "GET",
				async: false,
				data : {
					session : session
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					data = $.parseJSON(data);
					ret = data;
				}
			});
			return ret;
		},
		open : function(name) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/docs/" + name,
				type: "GET",
				async: false,
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					data = $.parseJSON(data);
					ret = data;
				}
			});
			return ret;
		},
		change : function(session, name, change, at, timestamp) {
			$.ajax({
				url: config.serverEndpoint + "/docs/" + name,
				type: "PUT",
				async: true,
				data : {
					session : session,
					change : change,
					at : at,
					timestamp : timestamp
				}
			});
		},
		pull : function(session, name, timestamp) {
			
		},
		remove : function(session, name) {
			var ret = false;
			$.ajax({
				url: config.serverEndpoint + "/docs/" + name + "?session=" + session,
				type: "DELETE",
				async: false,
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					ret = true;
				}
			});
			return ret;
		},
		move : function(session, name, newname) {
			var file = hackpad.doc.open(name);
			hackpad.doc.remove(session, name);
			hackpad.doc.create(session, newname, file.Data);
		}
	}
}
