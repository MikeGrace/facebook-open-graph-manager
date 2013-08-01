var manager = {

	error: function() {

	},

	init: function() {
		var that = this;
		that.bindClicks();
	},

	bindClicks: function() {
		var that = this;
		$('.action-link').on('click', function(e) {
			var key = $(this).attr('data-key'); // 'this' is the element clicked on.
			that.actionLinkAction(key);
		});
	},

	actionLinkAction: function(key) {
		var that = this;
		var page = that.actionIndex[key].page;
		var action = that.actionIndex[key].action;
		chrome.runtime.sendMessage({directive: 'action-link', page: page, action: action, sender: 'manager.js'});
	},

	actionIndex: {
		'clean-comments': {
			page: 'https://www.facebook.com/{{username}}/allactivity?privacy_source=activity_log&log_filter=cluster_116',
			action: 'open'
		}
	}
};


$(function() {
	manager.init();
});