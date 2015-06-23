// These are little helpers for with jQuery and other projects.
(function($) {
	$.create = function(tag, id) {
		element = document.createElement(tag.toLowerCase());
		if(typeof(id) != "undefined") element.id = id;
		return $(element);
	}
	$.getUrlParameter = function(parameter) {
		var url = window.location.search.substring(1);
		var variables = url.split('&');
		for(var i = 0; i < variables.length; i++) {
			variables[i] = variables[i].split('=');
			if(variables[i][0] == parameter) {
				return variables[i][1];
			}
		}
		return false;
	}
	
}(jQuery));
