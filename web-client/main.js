var application = {
	hostname : "",
	allowHistoryPush : true,
	authentication : {
		open : function() {
			$(document).attr("title", "Hackpad Kirjautuminen.");
			if(application.allowHistoryPush == true) {
				history.pushState({ application : "authentication" }, "", application.hostname + "?application=authentication");
			} else {
				application.allowHistoryPush = true;
			}
			$("body").prepend($.createDiv("authentication-container"));
			$("#authentication-container").addClass("container");
			$("#authentication-container").append($.create("h1", "authentication-header"));
			$("#authentication-header").html("Hackpad");
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
				var session = hackpad.session.create($("#authentication-form-username-input").val(), $("#authentication-form-password-input").val());
				if(session != false) {
					$.cookie("session", session);
					application.authentication.close();
					application.editor.open();
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
			$(document).attr("title", "Rekisteröidy Hackpadiin.");
			if(application.allowHistoryPush == true) {
				history.pushState({ application : "registeration" }, "", application.hostname + "?application=registeration");
			} else {
				application.allowHistoryPush = true;
			}
			$("body").prepend($.createDiv("registeration-container"));
			$("#registeration-container").addClass("container");
			$("#registeration-container").append($.create("h1", "registeration-header"));
			$("#registeration-header").html("Rekisteröidy");
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
					if(hackpad.account.create(username, password, email) == true) {
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
			$("#recovery-request-header").html("Palauta käyttäjätunnus");
			$("#recovery-request-container").append($.create("form", "recovery-request-form"));
			$("#recovery-request-form").append($.createInput("recovery-request-form-email-input", null, {
					placeholder : "Sähköpostiosoite", required : "required", name : "email-address", type : "email" }));
			$("#recovery-request-form").append($.createInput("recovery-request-form-submit-button", null, {
					value : "Pyydä käyttäjätunnuksesi nyt!", name : "submit", type : "submit" }));
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
	editor : {
		open : function(docname) {
			showdown.setOption("tables", true);
			$(document).attr("title", "Hackpad Editori");
			if(typeof docname == "undefined") {
				docname = hackpad.doc.generate.name(8);
			}
			if(application.allowHistoryPush == true) {
				history.pushState({ application : "editor", docname : docname }, "", application.hostname + "?application=editor&docname=" + docname);
			} else {
				application.allowHistoryPush = true;
			}

			$("body").prepend($.createDiv("editor-container"));
			$("#editor-container").addClass("editor");
			$("#editor-container").height($(window).height());
			$("#editor-container").append($.createDiv("editor-menu-area"));
			$("#editor-container").append($.createDiv("editor-edit-area"));
			$("#editor-container").append($.createDiv("editor-hidden-area"));
			$("#editor-container").append($.createDiv("editor-display-area"));
			$("#editor-container").append($.createDiv("editor-bottom-area"));

			// editor menu
			$("#editor-menu-area").append($.create("nav", "editor-navigation"));
			$("#editor-navigation").append($.create("ul", "editor-navigation-root"));
			$("#editor-navigation-root").append($.create("li", "editor-navigation-doc"));
			$("#editor-navigation-doc").append($.create("a"));
			$("#editor-navigation-doc > a").text("Document");
			$("#editor-navigation-doc").append($.create("ul", "editor-navigation-doc-dropdown"));
			$("#editor-navigation-doc-dropdown").append($.create("li", "editor-navigation-doc-new"));
			$("#editor-navigation-doc-new").append($.create("a"));
			$("#editor-navigation-doc-new > a").text("New");
			$("#editor-navigation-doc-dropdown").append($.create("li", "editor-navigation-doc-open"));
			$("#editor-navigation-doc-open").append($.create("a"));
			$("#editor-navigation-doc-open > a").text("Open");
			$("#editor-navigation-doc-dropdown").append($.create("li", "editor-navigation-doc-remove"));
			$("#editor-navigation-doc-remove").append($.create("a"));
			$("#editor-navigation-doc-remove > a").text("Remove");
			$("#editor-navigation-doc-dropdown").append($.create("li", "editor-navigation-doc-save"));
			$("#editor-navigation-doc-save").append($.create("a"));
			$("#editor-navigation-doc-save > a").text("Save");
			$("#editor-navigation-doc-dropdown").append($.create("li", "editor-navigation-doc-save-as"));
			$("#editor-navigation-doc-save-as").append($.create("a"));
			$("#editor-navigation-doc-save-as > a").text("Save as");
			$("#editor-navigation-root").append($.create("li", "editor-navigation-help"));
			$("#editor-navigation-help").append($.create("a"));
			$("#editor-navigation-help > a").text("Help");

			// editor text area
			$("#editor-edit-area").append($.create("textarea", "editor-textarea"));
			$("#editor-textarea").attr("placeholder", "What story do you want to write today?");

			if(typeof docname != "undefined") {
				var doc = hackpad.doc.open(docname);
				if(doc == false) {
					if(hackpad.doc.create($.cookie("session"), docname, "") != true) {
						alert("Failed to open or create the document.");
					}
				} else {
					$("#editor-textarea").val(doc.Data);
					$("#editor-hidden-area").html(doc.Data);
					var converter = new showdown.Converter(),
						text = doc.Data,
						html = converter.makeHtml(text);
					$("#editor-display-area").html(html);
				}
			}

			// events
			$("#editor-navigation-doc-new > a").click(function(evt) {
				application.editor.close();
				application.editor.open();
			});

			$("#editor-navigation-doc-open > a").click(function(evt) {
				$("#editor-popup-area").remove();
				$("#editor-container").append($.create("div", "editor-popup-area"));
				var docs = hackpad.doc.list($.cookie("session"));
				$("#editor-popup-area").append($.create("select", "editor-popup-area-docs"));
				$("#editor-popup-area-docs").attr("multiple", "multiple");
				for(var i in docs) {
					var option = $.create("option");
					$(option).val(docs[i].Path.substring(1));
					$(option).text(docs[i].Path.substring(1));
					$("#editor-popup-area-docs").append(option);
				}
				$("#editor-popup-area").append($.create("button", "editor-popup-area-open-button"));
				$("#editor-popup-area-open-button").text("Open");
				$("#editor-popup-area-open-button").click(function(evt) {
					var docname = $("#editor-popup-area-docs").val();
					if(docname.length > 1) {
						alert("You can only open 1 file at once.");
					} else {
						application.editor.close();
						application.editor.open(docname[0]);
					}
				});
				$("#editor-popup-area").append($.create("button", "editor-popup-area-close-button"));
				$("#editor-popup-area-close-button").text("Close");
				$("#editor-popup-area-close-button").click(function(evt) {
					$("#editor-popup-area").remove();
				});
			});

			$("#editor-navigation-doc-remove > a").click(function(evt) {
				$("#editor-popup-area").remove();
				$("#editor-container").append($.create("div", "editor-popup-area"));
				var docs = hackpad.doc.list($.cookie("session"));
				$("#editor-popup-area").append($.create("select", "editor-popup-area-docs"));
				$("#editor-popup-area-docs").attr("multiple", "multiple");
				for(var i in docs) {
					var option = $.create("option");
					$(option).val(docs[i].Path.substring(1));
					$(option).text(docs[i].Path.substring(1));
					$("#editor-popup-area-docs").append(option);
				}
				$("#editor-popup-area").append($.create("button", "editor-popup-area-remove-button"));
				$("#editor-popup-area-remove-button").text("Remove");
				$("#editor-popup-area-remove-button").click(function(evt) {
					var docnames = $("#editor-popup-area-docs").val();
					for(var i in docnames) {
						if(docname == docname[i]) {
							alert("Can not remove currently open file.");
							continue;
						}
						var removed = hackpad.doc.remove($.cookie("session"), docnames[i]);
					}
					application.editor.close();
					application.editor.open(docname);
				});
				$("#editor-popup-area").append($.create("button", "editor-popup-area-close-button"));
				$("#editor-popup-area-close-button").text("Close");
				$("#editor-popup-area-close-button").click(function(evt) {
					$("#editor-popup-area").remove();
				});
			});

			$("#editor-navigation-doc-save > a").click(function(evt) {
				hackpad.doc.save($.cookie("session"), docname, $("#editor-textarea").val());
			});

			$("#editor-navigation-doc-save-as > a").click(function(evt) {
				$("#editor-popup-area").remove();
				$("#editor-container").append($.create("div", "editor-popup-area"));
				$("#editor-popup-area").append($.create("input", "editor-popup-area-name-input"));
				$("#editor-popup-area").append($.create("button", "editor-popup-area-save-as-button"));
				$("#editor-popup-area-save-as-button").text("Save as");
				$("#editor-popup-area").css("height", "0");
				$("#editor-popup-area-save-as-button").click(function(evt) {
					var newname = $("#editor-popup-area-name-input").val();
					hackpad.doc.save($.cookie("session"), docname, $("#editor-textarea").val());
					hackpad.doc.move($.cookie("session"), docname, newname);
					application.editor.close();
					application.editor.open(newname);
				});
				$("#editor-popup-area").append($.create("button", "editor-popup-area-close-button"));
				$("#editor-popup-area-close-button").text("Close");
				$("#editor-popup-area-close-button").click(function(evt) {
					$("#editor-popup-area").remove();
				});
			});

			$("#editor-navigation-help > a").click(function(evt) {
				$("#editor-popup-area").remove();
				$("#editor-container").append($.create("div", "editor-popup-area"));
			});

			$("#editor-textarea").on("input", function(evt) {
				var hidden = $("#editor-hidden-area").html();
				var editor = $(this).val();
				if(editor.length > hidden.length) {
					for(var i = 0; i < editor.length; i++) {
						if(editor[i] != hidden[i]) {
							var length = editor.length - hidden.length;
							var changed = "";
							for(var x = 0; x < length; x++) {
								changed += editor[i+x];
							}
							hackpad.doc.change($.cookie("session"), docname, "+" + changed, i);
							break;
						}
					}
				} else if(editor.length < hidden.length) {
					for(var i = 0; i < hidden.length; i++) {
						if(editor[i] != hidden[i]) {
							var length = hidden.length - editor.length;
							var changed = "";
							for(var x = 0; x < length; x++) {
								changed += hidden[i+x];
							}
							hackpad.doc.change($.cookie("session"), docname, "-" + changed, i);
							break;
						}
					}
				}
				$("#editor-hidden-area").html($(this).val());
				var converter = new showdown.Converter(),
					text = $(this).val(),
					html = converter.makeHtml(text);
				$("#editor-display-area").html(html);
			});
		},
		close : function() {
			$("#editor-container").remove();
		}
	},
	openByState : function(state) {
		console.log("Open by state");
		console.log(state);
		if(state.application == "authentication") {
			application.authentication.open();
		} else if(state.application == "registeration") {
			application.registeration.open();
		} else if(state.application == "recovery-request") {
			application.recoveryRequest.open();
		} else if(state.application == "editor") {
			if(state.docname != undefined) {
				application.editor.open(state.docname);
			} else {
				application.editor.open();
			}
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
		} else if($.getUrlParameter("application") == "editor") {
			if($.getUrlParameter("docname") != undefined) {
				application.editor.open($.getUrlParameter("docname"));
			} else {
				application.editor.open();
			}
		}
	},
	closeAll : function() {
		application.authentication.close();
		application.registeration.close();
		application.recoveryRequest.close();
		application.editor.close();
	}
}

$("document").ready(function() {
	application.hostname = location.origin + location.pathname;
	console.log("Welcome to Hackpad at " + application.hostname + ". This is developer console!");
	console.log("API Endpoint: " + config.serverEndpoint);
	application.openByURL();
	window.onpopstate = function(evt) {
		application.allowHistoryPush = false;
		application.closeAll();
		application.openByState(evt.state);
	}
});
