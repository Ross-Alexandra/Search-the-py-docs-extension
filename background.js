var was_forward = false;
var was_this_request = false;
var storageCache = {};

chrome.storage.sync.get({
	pythonVersion: "3.0.0",
	doRedirect: true,
	doWarnRedirect: false
	}, function(data) {

		storageCache = data;

		chrome.webRequest.onBeforeRequest.addListener(function(details) {

			var split_url = details.url.split("/");

			split_url[3] = storageCache["pythonVersion"];


			if (!was_forward && details.url != split_url.join("/")) {
				alert("Initial redirect");
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

		chrome.webRequest.onResponseStarted.addListener(function(details) {
			if (details.statusCode != 200) {
				var split_url = details.url.split("/");
				var last_version_specifier = split_url[3].lastIndexOf(".");

				split_url[3] = split_url[3].slice(0, last_version_specifier);

				was_forward = true;

				alert("updating url to: " + split_url.join("/"));
    			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        			chrome.tabs.update(tabs[0].id, {url: split_url.join("/")});
    			});
			}
		},	{

				urls: [
				'*://docs.python.org/*'
				],
				types: ["main_frame"],
			}
		);

		chrome.storage.onChanged.addListener(function(changes, areaName) {
			for (key in changes) {
				storageCache[key] = changes[key].newValue;
			}
		});
});
