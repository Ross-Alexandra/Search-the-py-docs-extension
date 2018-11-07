chrome.webNavigation.onCompleted.addListener(function() {
	alert("Youre on the pydocs.");
}, {url: [{urlMatches: 'https://docs.python.org/*'}]});

