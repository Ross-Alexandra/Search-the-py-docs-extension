document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('ok_button').onclick = searchDocs;

	document.getElementById('searchQuery').onkeydown = searchIfEnter;
	document.onkeydown = searchIfEnter;
});

function searchIfEnter(event) {
	if (event.keycode == 13) {
		searchDocs();
	}
}

function searchDocs() {
	var query = document.getElementById("searchQuery").value;

	chrome.storage.sync.get({
        	pythonVersion: "3.0.0",
        	warnRedirect: false,
        	}, function(data) {
			chrome.tabs.create({url: "https://docs.python.org/" + data.pythonVersion  + "/search.html?q=" + query  + "&check_keywords=yes&area=default"});
		}
	);
}
