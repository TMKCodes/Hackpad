var application = {
	hostname : "",
	authentication : {
		open : function() {
			$(document).attr("title", "Fudocs Kirjautuminen.");
			history.pushState({ application : "authentication" }, "", application.hostname + "?application=authentication");
			$("body").prepend($.createDiv("authentication-container"));
			$("#authentication-container").append($.create("h1", "authentication-header"));
			$("#authentication-header").html("Fudocs Markdown Editor");
			$("#authentication-container").append($.create("form", "authentication-form"));
			$("#authentication-form").append($.createInput("authentication-form-username-input", null, { 
					placeholder : "Käyttäjätunnus", required : "required", name : "username", type : "text"}));
			$("#authentication-form").append($.createInput("authentication-form-password-input", null, { 
					placeholder : "Salasana", required : "required", name : "password", type : "password"}));
			$("#authentication-form").append($.createInput("authentication-form-submit-input", null, { 
					value : "Kirjaudu ja dokumentoi", name : "submit", type : "submit"}));
			$("#authentication-form").append($.createInput("authentication-registeration-button", null, { 
					value : "Tarvitsetko käyttäjätunnuksen", name : "reset", type : "reset"}));
			$("#authentication-form").submit(function(evt) {
				evt.preventDefault();
				var session = fudocs.session.create($("#authentication-form-username-input").val(), $("#authentication-form-password-input").val());
				console.log(session);
			});

			$("#authentication-registeration-button").click(function(evt) {
				application.authentication.close();
				application.registeration.open();
			});
		},
		close : function() {
			$("#authentication-container").remove();
		}
	},
	registeration : {
		open : function() {
			$(document).attr("title", "Rekisteröidy Fudocsiin.");
			history.pushState({ application : "registeration" }, "", application.hostname + "?application=registeration");
			$("body").prepend($.createDiv("registeration-container"));
			$("#registeration-container").append($.create("h1", "registeration-header"));
			$("#registeration-header").html("Rekisteröi Fudocs käyttäjätunnus.");
			$("#registeration-container").append($.create("form", "registeration-form"));
			$("#registeration-form").append($.createInput("registeration-form-username-input", null, { 
					placeholder : "Käyttäjätunnus", required : "required", name : "username", type : "text" }));
			$("#registeration-form").append($.createInput("registeration-form-password-input", null, {
					placeholder : "Salasana", required : "required", name : "password", type : "password" }));
			$("#registeration-form").append($.createInput("registeration-form-password-confirm-input", null, {
					placeholder : "Salasanan varmistus", required : "required", name : "password-confirm", type : "password" }));
			$("#registeration-form").append($.createInput("registeration-form-email-input", null, {
					placeholder : "Sähköpostiosoite", required : "required", name : "email-address", type : "email" }));
			$("#registeration-form").append($.createInput("registeration-form-submit-button", null, {
					value : "Rekisteröidy nyt!", name : "submit", type : "submit" }));
			$("#registeration-form").append($.createInput("registeration-form-cancel-button", null, {
					value : "Keskeytä rekisteröityminen.", name : "reset", type : "reset" }));
			$("#registeration-form").submit(function(evt) {
				evt.preventDefault();
				if($("#registeration-form-password-input").val() == $("#registeration-form-password-confirm-input").val()) {
					var username = $("#registeration-form-username-input").val();
					var password = $("#registeration-form-password-input").val();
					var email = $("#registeration-form-email-input").val();
					if(fudocs.account.create(username, password, email) == true) {
						application.closeAll();
						application.authentication.open();
						alert("Rekisteröityminen onnistui.");
					} else {
						alert("Rekisteröityminen epäonnistui.");
					}
				} else {
					alert("Salasana varmistus ei vastaa annettua salasanaa.");
				}
			});
			$("#registeration-form-cancel-button").click(function(evt) {
				application.closeAll();
				application.authentication.open();
			});
		},
		close : function() {
			$("#registeration-container").remove();
		}
	},
	openByState : function(state) {
		console.log(state.application);
		if(state.application == "authentication") {
			application.authentication.open();
		} else if(state.application == "registeration") {
			application.registeration.open();
		}
	},
	openByURL : function() {
		if($.getUrlParameter("application") == false) {
			application.authentication.open();
		} else if($.getUrlParameter("application") == "authentication") {
			application.authentication.open();
		} else if($.getUrlParameter("application") == "registeration") {
			application.registeration.open();
		}
	},
	closeAll : function() {
		application.authentication.close();
		application.registeration.close();
	}
}

$("document").ready(function() {
	application.hostname = location.origin + location.pathname;
	console.log("Welcome to Fudocs at " + application.hostname + ". This is developer console!");
	console.log("API Endpoint: " + config.serverEndpoint);
	application.openByURL();
	window.onpopstate = function(evt) {
		history.back();
		application.closeAll();
		application.openByState(evt.state);
	}
});
