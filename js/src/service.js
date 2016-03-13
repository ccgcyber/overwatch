'use strict';

var $ = require('jquery');
var section = require('./section.js').default;

export default class service {

	constructor(serviceData, renderTo) {
		console.log('SERVICE:: ADD');
		this.name = serviceData.name;
		this.sections = [];

		this.element = null;
		this.renderTo = renderTo;

		this.render();

		if (typeof serviceData.section !== 'undefined') {
			this.sectionAdd(serviceData.section);
		}

		this.element.on('click', e => {
			if (this.element.hasClass('collapse')) {
				this.expand();
			}
			else {
				this.collapse();
			}

			e.preventDefault();
		});
	}

	render() {
		var serviceElement = $('<div/>');
		serviceElement.addClass('service');
		serviceElement.addClass(this.name);
		serviceElement.appendTo(this.renderTo);

		this.element = serviceElement;
	}

	sectionAdd(sectionData) {
		if (this.sectionAdded(sectionData) === false) {
			this.sections[sectionData.name] = new section(sectionData, this.element);
		}
	}

	sectionAdded(sectionData) {
		return (typeof this.sections[sectionData.name] !== "undefined")
	}

	collapse() {
		this.element.addClass('collapse');
	}

	expand() {
		this.element.removeClass('collapse');
	}

}
