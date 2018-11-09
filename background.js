var storageCache = {};

chrome.storage.sync.get({
	pythonVersion: "3.0.0",
	doRedirect: true,
	doWarnRedirect: false
	}, function(data) {

		storageCache = data;
		var was_forward = false;
		var most_recent_request = "";
		var original_request = "";

		chrome.webRequest.onBeforeRequest.addListener(function(details) {

			var split_url = details.url.split("/");

			split_url[3] = storageCache["pythonVersion"];

			if (!was_forward && details.url.split("/")[3] != most_recent_request) {
				alert("Initial redirect -- from: " + details.url + " -- most recent request: " + most_recent_request);
				most_recent_request = split_url[3]
				original_request = details.url.split("/")[3];
				return {redirectUrl: split_url.join("/")};
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
			if (details.statusCode == 404) {
				var split_url = details.url.split("/");
				var last_version_specifier = split_url[3].lastIndexOf(".");

				split_url[3] = split_url[3].slice(0, last_version_specifier);

				if (split_url[3] == "") {
					alert("Ran out of options -- reverting to: " + original_request);
					most_recent_request = original_request;
					split_url[3] = original_request;
					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        				chrome.tabs.update(tabs[0].id, {url: split_url.join("/")});
    				});

					return;
				}

				most_recent_request = split_url[3];

				alert("updating url to: " + split_url.join("/") + " from " + details.url);
    			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        			chrome.tabs.update(tabs[0].id, {url: split_url.join("/")});
    			});
			}
			else {
				redirected = false;
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
