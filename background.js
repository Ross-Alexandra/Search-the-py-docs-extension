var storageCache = {};

chrome.storage.sync.get({
	pythonVersion: "3.0.0",
	warnRedirect: false,
	}, function(data) {

		storageCache = data;
		var most_recent_request = "";
		var original_request = "";

		// On the inital request, load the user's prefered version of
		// python.
		chrome.webRequest.onBeforeRequest.addListener(function(details) {

			var split_url = details.url.split("/");

			// The 4th position in the url is the python version.
			split_url[3] = storageCache["pythonVersion"];
			while (split_url[3].endsWith(".0")) {

				// slice from the first character, to the third-to-last
				// character.
				split_url[3] = split_url[3].slice(0, split_url[3].lastIndexOf(".0"));
			}

			// If this request wasn't the most recent request
			if (details.url.split("/")[3] != most_recent_request) {

				// Set this to the most recent request, and
				// redirect to the python docs version
				// stored in the user's preferences.
				most_recent_request = split_url[3]
				original_request = details.url.split("/")[3];

				if (storageCache.warnRedirect) {
					var confirm_message = "You are about to be redirected to a python " + split_url[3] + " doc page instead of a python " + original_request + " page, are you sure you would like to be redirected?"

					if (confirm(confirm_message)) {
						return {redirectUrl: split_url.join("/")};
					}
				}
				else {
					return {redirectUrl: split_url.join("/")};
				}
			}
		},	{
				urls: [
					'*://docs.python.org/*'
				],
				types: ["main_frame", "sub_frame"],
			},
			["blocking"]
		);

		// Catches redirects that 404. This is used to find an appropriate
		// version of the py docs for the user that is closes to their
		// specific version.
		chrome.webRequest.onResponseStarted.addListener(function(details) {

			if (details.statusCode == 404) {
				var split_url = details.url.split("/");
				var last_version_specifier = split_url[3].lastIndexOf(".");

				// Because this page 404'ed, we need to go the the next sub
				// version. Ex, if 3.7.1 failed, try 3.7
				split_url[3] = split_url[3].slice(0, last_version_specifier);

				// incase the version specified matches something along
				// the lines of 3.0.8, if 3.0.8 404's, cut off the .8, then
				// cut off the .0, going directly from 3.0.8 to 3.
				while (split_url[3].endsWith(".0")) {

					// slice from the first character, to the third-to-last
					// character.
					split_url[3] = split_url[3].slice(0, split_url[3].lastIndexOf(".0"));
				}


				// Set a timeout for 10ms as we must wait a short period of time
				// otherwise this request will get overshadowed (for unknown reasons.)
				setTimeout(function() {

					// If none of the user's sub-versions worked, redirect to the
					// originally queried page. Ex, Query 3.0, redirect to 1.1.1,
					// that 404's, go to 1.1, that fails, go to 1, that fails, give
					// up and return to 3.0
					if (split_url[3] == "") {
						most_recent_request = original_request;
						split_url[3] = original_request;
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        					chrome.tabs.update(tabs[0].id, {url: split_url.join("/")});
    					});
					}
					else {
						most_recent_request = split_url[3];

	    					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        					chrome.tabs.update(tabs[0].id, {url: split_url.join("/")});
    					});
					}
				}, 25);
			}
		},	{

				urls: [
				'*://docs.python.org/*'
				],
				types: ["main_frame"],
			},
		);

		// If storage is updated, update the cache.
		chrome.storage.onChanged.addListener(function(changes, areaName) {
			for (key in changes) {
				storageCache[key] = changes[key].newValue;
			}
		});
});
