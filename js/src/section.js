'use strict';

var $ = require('jquery');
var action = require('./action.js').default;

export default class section {

	constructor(siteData, renderTo) {
		this.name = siteData.name;
		this.actions = [];

		this.renderTo = renderTo;
		this.element = null;

		this.render();

		if (typeof siteData.action !== 'undefined') {
			this.actionAdd(siteData.action);
		}
	}

	render() {
		var siteElement = $('<div/>');
		siteElement.addClass('section');
		siteElement.addClass(this.name);
		siteElement.appendTo(this.renderTo);

		// Header
		var siteHeader = $('<header/>');
		siteHeader.html(this.name);
		siteHeader.appendTo(siteElement);

		this.element = siteElement;
	}

	actionAdd(actionData) {
		this.actions[actionData.name] = new action(actionData, this.element);
	}

	actionAdded(actionData) {
		return (typeof this.actions[actionData.name] !== "undefined")
	}
}