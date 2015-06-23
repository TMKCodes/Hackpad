// This is Javascript browser code to talk with the server API.
var fudocs = {
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
				url: config.serverEndpoint + "/account/",
				type: "DELETE",
				async: false,
				data : {
					session : session
				}
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
				type: "POST",
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
				url: config.serverEndpoint + "/session/",
				type: "POST",
				async: false,
				data : {
					session : session
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.status == 200) {
					ret = true;
				}
			});
			return ret;
		},
	},
	docs : {
		
	}
}
