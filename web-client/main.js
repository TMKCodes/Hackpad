var application = {
	authentication : {
		open : function() {
			$("document").attr("title", "Fudocs Kirjautuminen.");
			var container = $.create("div", "authentication-container");
			
			var header = $.create("h1", "authentication-header");
			$(header).html("Fudocs Markdown Editor");

			var form = $.create("form", "authentication-form");
			
			var usernameInput = $.create("input", "authentication-form-username-input");
			$(usernameInput).attr("placeholder", "Käyttäjätunnus");
			$(usernameInput).attr("required", "required");
			$(usernameInput).attr("name", "username");
			$(usernameInput).attr("type", "text");

			var passwordInput = $.create("input", "authentication-form-password-input");
			$(passwordInput).attr("placeholder", "Salasana");
			$(passwordInput).attr("required", "required");
			$(passwordInput).attr("name", "password");
			$(passwordInput).attr("type", "password");

			var submitInput = $.create("input", "authentication-form-submit-input");
			$(submitInput).attr("value", "Kirjaudu ja dokumentoi!");
			$(submitInput).attr("name", "submit");
			$(submitInput).attr("type", "submit");

			var registerationButton = $.create("input", "authentication-registeration-button"); 
			$(registerationButton).attr("value", "Tarvitsetko käyttäjätunnuksen?");
			$(registerationButton).attr("name", "reset");
			$(registerationButton).attr("type", "reset");

			$(form).append(usernameInput);
			$(form).append(passwordInput);
			$(form).append(submitInput);
			$(form).append(registerationButton);

			$(container).append(header);
			$(container).append(form);


			$("body").prepend(container);

			$("#authentication-form").submit(function(evt) {
				evt.preventDefault();
				var session = fudocs.session.create($("#authentication-form-username-input").val(), $("#authentication-form-password-input").val());
				console.log(session);
			});
		},
		close : function() {
			$("#authentication-container").remove();
		}
	}
}

$("document").ready(function() {
	console.log("Welcome to Fudocs. This is developer console!");
	console.log("API Endpoint: " + config.serverEndpoint);
	if($.getUrlParameter("page") == false) {
		application.authentication.open();
	}
});
