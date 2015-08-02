// These are little helpers for with jQuery and other projects.

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function base64_decode(data) {
  //  discuss at: http://phpjs.org/functions/base64_decode/
  // original by: Tyler Akins (http://rumkin.com)
  // improved by: Thunder.m
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Onno Marsman
  // bugfixed by: Pellentesque Malesuada
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: base64_decode('YQ===');
  //   returns 2: 'a'
  //   example 3: base64_decode('4pyTIMOgIGxhIG1vZGU=');
  //   returns 3: '✓ à la mode'

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    dec = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += '';

  do {
    // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');

  return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
}

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
	$.globalParameters = function(element, parameters) {
		if(typeof parameters != "undefined") {
			if(typeof parameters.accesskey != "undefined") {
				element.setAttribute("accesskey", parameters.accesskey);
			}
			if(typeof parameters.contenteditable != "undefined") {
				element.setAttribute("contenteditable", parameters.contenteditable);
			}
			if(typeof parameters.contextmenu != "undefined") {
				element.setAttribute("contextmenu", parameters.contextmenu);
			}
			if(typeof parameters.dir != "undefined") {
				element.setAttribute("dir", parameters.dir);
			}
			if(typeof parameters.draggable != "undefined") {
				element.setAttribute("draggable", parameters.draggable);
			}
			if(typeof parameters.dropzone != "undefined") {
				element.setAttribute("dropzone", parameters.dropzone);
			}
			if(typeof parameters.hidden != "undefined") {
				element.setAttribute("hidden", parameters.hidden);
			}
			if(typeof parameters.inert != "undefined") {
				element.setAttribute("inert", parameters.inert);
			}
			if(typeof parameters.itemid != "undefined") {
				element.setAttribute("itemid", parameters.itemid);
			}
			if(typeof parameters.itemprop != "undefined") {
				element.setAttribute("itemprop", parameters.itemprop);
			}
			if(typeof parameters.itemref != "undefined") {
				element.setAttribute("itemref", parameters.itemref);
			}
			if(typeof parameters.itemscope != "undefined") {
				element.setAttribute("itemscope", parameters.itemscope);
			}
			if(typeof parameters.itemtype != "undefined") {
				element.setAttribute("itemtype", parameters.itemtype);
			}
			if(typeof parameters.lang != "undefined") {
				element.setAttribute("lang", parameters.lang);
			}
			if(typeof parameters.spellcheck != "undefined") {
				element.setAttribute("spellcheck", parameters.spellcheck);
			}
			if(typeof parameters.style != "undefined") {
				element.setAttribute("style", parameters.style);
			}
			if(typeof parameters.title != "undefined") {
				element.setAttribute("title", parameters.title);
			}
			if(typeof parameters.translate != "undefined") {
				element.setAttribute("translate", parameters.translate);
			}	
		}
		return element;
	}
	$.createDiv = function(id, classes, parameters) {
		div = document.createElement("div");
		if(typeof id != "undefined") div.id = id;
		if(typeof classes != "undefined") div.className = classes;
		div = $.globalParameters(div, parameters);
		return $(div);
	}
	$.createButton = function(id, classes, parameters) {
		button = document.createElement("button");
		if(typeof id != "undefined") button.id = id;
		if(typeof classes != "undefined") button.className = classes;
		if(typeof parameters != "undefined" && typeof parameters == "object") {
			if(typeof parameters.autofocus != "undefined") {
				button.setAttribute("autofocus", parameters.autofocus);
			}
			if(typeof parameters.disabled != "undefined") {
				button.setAttribute("disabled", parameters.disabled);
			}
			if(typeof parameters.form != "undefined") {
				button.setAttribute("form", parameters.form);
			}
			if(typeof parameters.formaction != "undefined") {
				button.setAttribute("formaction", parameters.formaction);
			}
			if(typeof parameters.formenctype != "undefined") {
				button.setAttribute("formenctype", parameters.formenctype);
			}
			if(typeof parameters.formmethod != "undefined") {
				button.setAttribute("formmethod", parameters.formmethod);
			}
			if(typeof parameters.formnovalidate != "undefined") {
				button.setAttribute("formnovalidate", parameters.formnovalidate);
			}
			if(typeof parameters.formtarget != "undefined") {
				button.setAttribute("formtarget", parameters.formtarget);
			}
			if(typeof parameters.menu != "undefined") {
				button.setAttribute("menu", parameters.menu);
			}
			if(typeof parameters.type != "undefined") {
				button.setAttribute("type", parameters.type);
			}
			if(typeof parameters.value != "undefined") {
				button.setAttribute("value", parameters.value);
			}
		}
		button = $.globalParameters(button, parameters);
		return $(button);
	}
	$.createInput = function(id, classes, parameters) {
		input = document.createElement("input");
		if(typeof id != "undefined") input.id = id;
		if(typeof classes != "undefined") input.className = classes;
		if(typeof parameters != "undefined" && typeof parameters == "object") {
			if(typeof parameters.accept != "undefined" && typeof parameters.accept == "string") {
				input.setAttribute("accept", parameters.accept);
			}
			if(typeof parameters.alt != "undefined" && typeof parameters.alt == "string") {
				input.setAttribute("alt", parameters.alt);
			}
			if(typeof parameters.autocomplete != "undefined" && (parameters.autocomplete == "on" || parameters.autocomplete == "off")) {
				input.setAttribute("autocomplete", parameters.autocomplete);
			}
			if(typeof parameters.autofocus != "undefined" && (parameters.autofocus == "autofocus" || parameters.autofocus == "")) {
				input.setAttribute("autofocus", parameters.autofocus);
			}
			if(typeof parameters.checked != "undefined" && typeof parameters.type != "undefined" && (parameters.type == "checkbox" || parameters.type == "radio")) {
				input.setAttribute("checked", parameters.checked);
			}
			if(typeof parameters.disabled != "undefined" && (parameters.disabled == "disabled" || parameters.disabled == "")) {
				input.setAttribute("disabled", parameters.disabled);
			}
			if(typeof parameters.dirname != "undefined") {
				input.setAttribute("dirname", parameters.dirname);
			}
			if(typeof parameters.form != "undefined") {
				input.setAttribute("form", parameters.form);
			}
			if(typeof parameters.formaction != "undefined") {
				input.setAttribute("formaction", parameters.formaction);
			}
			if(typeof parameters.formenctype != "undefined") {
				input.setAttribute("formenctype", parameters.formenctype);
			}
			if(typeof parameters.formmethod != "undefined") {
				input.setAttribute("formmethod", parameters.formmethod);
			}
			if(typeof parameters.formnovalidate != "undefined") {
				input.setAttribute("formnovalidate", parameters.formnovalidate);
			}
			if(typeof parameters.formtarget != "undefined") {
				input.setAttribute("formtarget", parameters.formtarget);
			}
			if(typeof parameters.height != "undefined") {
				input.setAttribute("height", parameters.height);
			}
			if(typeof parameters.inputmode != "undefined") {
				input.setAttribute("inputmode", parameters.inputmode);
			}
			if(typeof parameters.list != "undefined") {
				input.setAttribute("list", parameters.list);
			}
			if(typeof parameters.max != "undefined") {
				input.setAttribute("max", parameters.max);
			}
			if(typeof parameters.maxlength != "undefined") {
				input.setAttribute("maxlength", parameters.maxlength);
			}
			if(typeof parameters.min != "undefined") {
				input.setAttribute("min", parameters.min);
			}
			if(typeof parameters.minlength != "undefined") {
				input.setAttribute("minlength", parameters.minlength);
			}
			if(typeof parameters.multiple != "undefined") {
				input.setAttribute("multiple", parameters.multiple);
			}
			if(typeof parameters.name != "undefined") {
				input.setAttribute("name", parameters.name);
			}
			if(typeof parameters.pattern != "undefined") {
				input.setAttribute("pattern", parameters.pattern);
			}
			if(typeof parameters.placeholder != "undefined") {
				input.setAttribute("placeholder", parameters.placeholder);
			}
			if(typeof parameters.readonly != "undefined") {
				input.setAttribute("readonly", parameters.readonly);
			}
			if(typeof parameters.required != "undefined") {
				input.setAttribute("required", parameters.required);
			}
			if(typeof parameters.size != "undefined") {
				input.setAttribute("size", parameters.size);
			}
			if(typeof parameters.src != "undefined") {
				input.setAttribute("src", parameters.src);
			}
			if(typeof parameters.step != "undefined") {
				input.setAttribute("step", parameters.step);
			}
			if(typeof parameters.type != "undefined") {
				input.setAttribute("type", parameters.type);
			}
			if(typeof parameters.value != "undefined") {
				input.setAttribute("value", parameters.value);
			}
			if(typeof parameters.width != "undefined") {
				input.setAttribute("width", parameters.width);
			}
		}
		input = $.globalParameters(input, parameters);
		return $(input);
	}
	
}(jQuery));
