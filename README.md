# Search-the-py-docs-extension - Version 2.0.0
A chrome extension to dynamically change the version of the pydocs you're viewing.


# Usage
After installing the chrome extension, simply right click on the icon and select options. From this menu, you will be able to set your prefered version of python. Once you have set this up, navigating to a py docs not in your prefered version will automatically cause a redirect to the version you have selected. 

Prefer an obscure version of python? worry not, if the specific version doesn't have a doc, the extension will try removing the most specific part of the version until either there is no version left (in which case it will return to the originally visited version), or until a doc is found. For example, if you prefer Python 1.1.1 then loading docs.python.org/not-your-version/... will cause docs.python.org/1.1.1/... to be loaded, when this doesn't resolve, docs.python.org/1.1/... will be loaded, then docs.python.org/1/... and finally, because version 1 doesn't have docs, docs.python.org/not-your-version/... will be loaded.

# Get this extension
If you want to download and try this extension, go to https://chrome.google.com/webstore/detail/jioomgcpidjdncllmlhphmfplinpdafi/
