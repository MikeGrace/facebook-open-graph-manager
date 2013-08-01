// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://www.facebook.com/') > -1) {
		// ... show the page action.
		chrome.pageAction.show(tabId);
	}
};


// // Called when user clicks on page action icon.
// function takeAction(tab) {
// 	chrome.tabs.executeScript(tab.tabId, {file: '/js/jquery-2.0.3.js'}, function() {
// 		chrome.tabs.executeScript(tab.tabId, {file: '/js/google-analytics.js'}, function() {
// 			chrome.tabs.executeScript(tab.tabId, {file: '/js/comment-cleaner.js'}, function() {
		
// 			});
// 		});
// 	});
// };

// Called when user clicks on page action icon.
var bg = {

	takeAction: function(tab) {
		var that = bg;
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			that.openManager(tabs[0]);
		});
		
	},

	openManager: function(currentTab) {
		var that = this;
		var managerLink = chrome.extension.getURL('/manager.html');
		that.facebookTab = currentTab.id; // save reference to tab so we can update it later.
		chrome.tabs.create({
			url: managerLink,
			active: true,
			index: currentTab.index + 1
		});
	},

	handleMessage: function(message, sender, sendResponse) {
		var that = this;
		console.log(message);
		if (message.sender === 'manager.js') {
			that.managerMessage(message, sender, sendResponse);
		}

	},

	managerMessage: function(message, sender, sendResponse) {
		var that = this;
		if (message.directive === 'action-link') {
			if (message.action === 'open') {
				var url = Mustache.render(message.page, 'mikegrace');
				console.log(url);
				chrome.tabs.update(that.facebookTab, {
					active: true,
					url: url
				});
			}
		}
	}
};


var Mustache = {
	render: function(str, value) {
		var parts = str.split("{{");
		var start = parts.shift();
		parts = parts.shift().split("}}");
		var key = parts.shift();
		var end = parts.shift();
		return start + value + end;
	}
};



// Listen for messages from extension process or content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	bg.handleMessage(message, sender, sendResponse);
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// When the user clicks on the page action (assume only able to click on facebook.com)
chrome.pageAction.onClicked.addListener(bg.takeAction);