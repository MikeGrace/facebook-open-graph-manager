var cleaner = {
	continueDeleting: true,

	init: function() {
		// this.deleteTopComment();
		this.applyHideButtons();
		this.setupMainControls();
	},

	setupMainControls: function() {
		var that = this;
		$('._2o3t').prepend('<div class="fixed_elem" style="border: 1px solid red; background-color: #4c66a4; padding: 5px;"><span style="color: #FFF; display: inline-block; padding-right: 10px;">Data Manager Controls </span><button id="start-deleting">Start Deleting</button> <button id="stop-deleting" style="display:none;">Stop Deleting</button></div>');
		$('#start-deleting').on('click', function() {
			that.continueDeleting = true;
			that.deleteTopComment();
			$(this).hide();
			$('#stop-deleting').show();
		});
		$('#stop-deleting').on('click', function() {
			that.continueDeleting = false;
			$(this).hide();
			$('#start-deleting').show();
		});
	},

	applyHideButtons: function() {
		var that = this;


		$(".timelineLogStory").each(function(i, e) {
			$(e).find('tr').append('<button class="hide-from-cleaner">Don\'t Delete</button>');
		});
		$('.hide-from-cleaner').on('click',function() {
			$(this).parentsUntil(".timelineLogStory").parent().remove();
		});
	},

	deleteTopComment: function() {
		var that = this;
		var $story = $(".timelineLogStory:first");
		if ($story.length > 0 && that.continueDeleting) {
			var $editButton = $story.find('.uiPopoverButton');
			that.clickOn($editButton, function() {
				that.waitForDeleteButton($editButton);
			});
		} else {
			console.log('can\'t find any more comments to remove');
		}
	},


	waitForDeleteButton: function($editButton, attempts) {
		var that = this;
		var attempts = (attempts || 0);
		var $deleteButton = $editButton.parent().find('._54nh');
		if ($deleteButton.length === 1) {
			that.clickOn($deleteButton, function() {
				var $story = $editButton.parentsUntil('.timelineLogStory').parent();
				that.waitToConfirmDeletion($story);
			});
		} else {
			if (attempts > 10) {
				console.log('too many attempts on waitForDeleteButton');
				return false;
			}
			setTimeout(function() {
				that.waitForDeleteButton($editButton, attempts + 1);
			}, 300);
		}
	},

	waitToConfirmDeletion: function($story, attempts) {
		var that = this;
		var attempts = (attempts || 0);
		var $deleteButton = $(".generic_dialog input[value='Delete']");
		if ($deleteButton.length === 1) {
			that.clickOn($deleteButton, function() {
				that.waitForCommentToBeDeleted($story);
			});
		} else {
			if (attempts > 10) {
				console.log('too many attempts on waitToConfirmDeletion');
				return false;
			}
			setTimeout(function() {
				that.waitToConfirmDeletion($story, attempts + 1);
			}, 300);
		}

	},

	waitForCommentToBeDeleted: function($story, attempts) {
		var that = this;
		var attempts = (attempts || 0);
		if ($story.find('._4-p-').text() == 'This content has been deleted.') {
			console.log('comment deleted');
			$story.remove();
			that.deleteTopComment();
		} else {
			if (attempts > 10) {
				console.log('too many attempts on waitForCommentToBeDeleted', $story, $story.children());
				return false;
			}
			setTimeout(function() {
				that.waitForCommentToBeDeleted($story, attempts + 1);
			}, 300);
		}

	},

	clickOn: function($element, callback) {
		var theEvent = document.createEvent("MouseEvent");
		theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		$element[0].dispatchEvent(theEvent);
		if (callback) { callback(); }
	}
}

$(function() {
	cleaner.init();
});