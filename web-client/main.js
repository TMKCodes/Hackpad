var application = {
	hostname : "",
	allowHistoryPush : true,
	authentication : {
		open : function() {
			$(document).attr("title", "Fudocs Kirjautuminen.");
			if(application.allowHistoryPush == true) {
				history.pushState({ application : "authentication" }, "", application.hostname + "?application=authentication");
			} else {
				application.allowHistoryPush = true;
			}
			$("body").prepend($.createDiv("authentication-container"));
			$("#authentication-container").addClass("container");
			$("#authentication-container").append($.create("h1", "authentication-header"));
			$("#authentication-header").html("Fudocs Markdown Editor");
			$("#authentication-container").append($.create("form", "authentication-form"));
			$("#authentication-form").append($.createInput("authentication-form-username-input", null, { 
					placeholder : "Käyttäjätunnus", required : "required", name : "username", type : "text" }));
			$("#authentication-form").append($.createInput("authentication-form-password-input", null, { 
					placeholder : "Salasana", required : "required", name : "password", type : "password" }));
			$("#authentication-form").append($.createInput("authentication-form-submit-input", null, { 
					value : "Kirjaudu ja tee dokumentteja!", name : "submit", type : "submit" }));
			$("#authentication-form").append($.createInput("authentication-form-registeration-button", null, { 
					value : "Tarvitsetko käyttäjätunnuksen?", name : "reset", type : "reset" }));
			$("#authentication-form").append($.createInput("authentication-form-recovery-request-button", null, {
					value : "Oletko unohtanut käyttäjätunnuksesi?", name : "recovery-request", type : "reset" }));
			$("#authentication-form").submit(function(evt) {
				evt.preventDefault();
				var session = fudocs.session.create($("#authentication-form-username-input").val(), $("#authentication-form-password-input").val());
				if(session != false) {
					$.cookie("session", session);
					application.authentication.close();
				} else {
					alert("Kirjautuminen epäonnistui. Tarkista käyttäjätunnus, salasana ja yritä uudestaan.");
				}
			});

			$("#authentication-form-registeration-button").click(function(evt) {
				application.authentication.close();
				application.registeration.open();
			});

			$("#authentication-form-recovery-request-button").click(function(evt) {
				application.authentication.close();
				application.recoveryRequest.open();
			});
		},
		close : function() {
			$("#authentication-container").remove();
		}
	},
	registeration : {
		open : function() {
			$(document).attr("title", "Rekisteröidy Fudocsiin.");
			if(application.allowHistoryPush == true) {
				history.pushState({ application : "registeration" }, "", application.hostname + "?application=registeration");
			} else {
				application.allowHistoryPush = true;
			}
			$("body").prepend($.createDiv("registeration-container"));
			$("#registeration-container").addClass("container");
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
	recoveryRequest : {
		open : function() {
			$(document).attr("title", "Käyttäjätunnuksen palautus");
			if(application.allowHistoryPush == true) {
				history.pushState({ application : "recovery-request" }, "", application.hostname + "?application=recovery-request");
			} else {
				application.allowHistoryPush = true;
			}
			$("body").prepend($.createDiv("recovery-request-container"));
			$("#recovery-request-container").addClass("container");
			$("#recovery-request-container").append($.create("h1", "recovery-request-header"));
			$("#recovery-request-header").html("Palauta Fudocs käyttäjätunnus.");
			$("#recovery-request-container").append($.create("form", "recovery-request-form"));
			$("#recovery-request-form").append($.createInput("recovery-request-form-email-input", null, {
					placeholder : "Sähköpostiosoite", required : "required", name : "email-address", type : "email" }));
			$("#recovery-request-form").append($.createInput("recovery-request-form-submit-button", null, {
					value : "Pyydä uusi salasana nyt!", name : "submit", type : "submit" }));
			$("#recovery-request-form").append($.createInput("recovery-request-form-cancel-button", null, {
					value : "Peruuta käyttäjätunnuksen palautus.", name : "cancel", type : "reset" }));
			$("#recovery-request-form").submit(function(evt) {
				evt.preventDefault();
			});
			$("#recovery-request-form-cancel-button").click(function(evt) {
				application.recoveryRequest.close();
				application.authentication.open();
			});
		},
		close : function() {
			$("#recovery-request-container").remove();
		}
	},
	openByState : function(state) {
		if(state.application == "authentication") {
			application.authentication.open();
		} else if(state.application == "registeration") {
			application.registeration.open();
		} else if(state.application == "recovery-request") {
			application.recoveryRequest.open();
		}
	},
	openByURL : function() {
		if($.getUrlParameter("application") == false) {
			application.authentication.open();
		} else if($.getUrlParameter("application") == "authentication") {
			application.authentication.open();
		} else if($.getUrlParameter("application") == "registeration") {
			application.registeration.open();
		} else if($.getUrlParameter("application") == "recovery-request") {
			application.recoveryRequest.open();
		}
	},
	closeAll : function() {
		application.authentication.close();
		application.registeration.close();
		application.recoveryRequest.close();
	}
}

$("document").ready(function() {
	application.hostname = location.origin + location.pathname;
	console.log("Welcome to Fudocs at " + application.hostname + ". This is developer console!");
	console.log("API Endpoint: " + config.serverEndpoint);
	application.openByURL();
	window.onpopstate = function(evt) {
		application.allowHistoryPush = false;
		application.closeAll();
		application.openByState(evt.state);
	}
});
