// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://www.facebook.com/mikegrace/allactivity?privacy_source=activity_log&log_filter=cluster_116') > -1) {
		// ... show the page action.
		chrome.pageAction.show(tabId);
	}
};


// Called when user clicks on page actio icon.
function takeAction(tab) {
	chrome.tabs.executeScript(tab.tabId, {file: '/js/jquery-2.0.3.js'}, function() {
		chrome.tabs.executeScript(tab.tabId, {file: '/js/google-analytics.js'}, function() {
			chrome.tabs.executeScript(tab.tabId, {file: '/js/comment-cleaner.js'}, function() {
		
			});
		});
	});
};




// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// When the user clicks on the page action (assume only ablo to click on facebook.com)
chrome.pageAction.onClicked.addListener(takeAction);