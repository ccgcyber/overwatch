'use strict';

var $ = require('jquery');

export default class action {

	constructor(actionData, renderTo) {
		this.name = actionData.name;

		this.renderTo = renderTo;
		this.element = null;

		this.count = 0;

		this.timer = null;

		this.render();
	}

	render() {
		var actionElement = $('<div/>');
		actionElement.addClass('action');
		actionElement.addClass(this.name);
		actionElement.html(this.name.toUpperCase());
		actionElement.appendTo(this.renderTo);

		this.element = actionElement;
	}

	blink() {

		this.count++;

		this.element.addClass('active');

		this.timer = setTimeout(function() {
			this.element.removeClass('active');
		}.bind(this), 60);

		this.element.attr('data-count', this.count);
	}
}