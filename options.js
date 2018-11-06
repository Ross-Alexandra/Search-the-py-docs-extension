function save_options() {
	var python_version = [];
	python_version.push(document.getElementById("mainPyVer").value);
	python_version.push(document.getElementById("subPyVer").value);
	python_version.push(document.getElementById("buildPyVer").value);

	var do_redirect = document.getElementById("redirect").checked;
	var do_warn_redirect = document.getElementById("warn_redirect").checked;

	chrome.storage.sync.set({
		pythonVersion: python_version.join("."),
		doRedirect: do_redirect,
		doWarnRedirect: do_warn_redirect
	}, function() {
		//update status to let users know options were saved.
		var status = document.getElementById("status");
		status.textContent = "Options Saved.";
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}


//Restores select box and checkbox state using the preferences.
function restore_options() {

	// Default is 3.0.0 and do_redirect = false
	chrome.storage.sync.get({
		pythonVersion: "3.0.0",
		doRedirect: false,
		doWarnRedirect: true
	}, function(items) {
		var python_versions = items.pythonVersion.split(".");

		document.getElementById("mainPyVer").value = python_versions[0];
		document.getElementById("subPyVer").value = python_versions[1];
		document.getElementById("buildPyVer").value = python_versions[2];

		document.getElementById("redirect").checked = items.doRedirect;

		document.getElementById("warn_redirect").checked = items.doWarnRedirect;
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
