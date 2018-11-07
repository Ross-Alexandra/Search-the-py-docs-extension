
var was_forward = false;

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	var split_url = details.url.split("/");

	pyMainVer = "3" // Goal is to get this from storage somehow...

	split_url[3] = pyMainVer + ".1.2.3.4.5";

	if (!was_forward) {
		return {redirectUrl: split_url.join("/")};
	}
	else {
		was_forward = false;
	}
},	{
		urls: [
			'*://docs.python.org/*'
		],
		types: ["main_frame"],
	},
	["blocking"]
);

chrome.webRequest.onCompleted.addListener(function(details) {
	if (details.statusCode == 404) {
		var split_url = details.url.split("/");
		var last_version_specifier = split_url[3].lastIndexOf(".");

		split_url[3] = split_url[3].slice(0, last_version_specifier);

		was_forward = true;
		chrome.tabs.update({url: split_url.join("/")});
	}
},	{

		urls: [
		'*://docs.python.org/*'
		],
		types: ["main_frame", "sub_frame"]
	}
);

