$.fn.strikeThrough = (function() {

	var findText = function(element, pattern, callback) {

		if ( ! element.childNodes) {
			return;   
		}

		for (var childi = element.childNodes.length; childi-- > 0;) {
			var child = element.childNodes[childi];
			if (child.nodeType == 1) {
				findText(child, pattern, callback);
			} else if (child.nodeType == 3) {
				var matches = [];
				var match;
				while (match = pattern.exec(child.data))
					matches.push(match);
				for (var i = matches.length; i-- > 0;)
					callback.call(window, child, matches[i]);
			}
		}
	}

	return function(pattern) {
		pattern = pattern || /./g;

		if (this.length > 1) {
			this.each(function() {
				$(this).strikeThrough(pattern);
			});
			return this;
		}

		findText(document.body, pattern, function(node, match) {
			var element = document.createElement('span');
			node.splitText(match.index + 1);
			element.appendChild(node.splitText(match.index));
			node.parentNode.insertBefore(element, node.nextSibling);
		});

		var spans = this[0].getElementsByTagName('span'),
		spansLength = spans.length,
		currentSpan = 0,
		interval = setInterval(function() {
			if (currentSpan == spansLength) {
				clearInterval(interval);
				return;
			}
			spans[currentSpan++].style.textDecoration = 'line-through';

		}, 20);

		return this;
	};

})();