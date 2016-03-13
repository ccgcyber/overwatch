'use strict';

var $ = require('jquery');
var section = require('./section.js').default;

export default class apache2Service {

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
	}

	render() {
		var serviceElement = $('<div/>');
		serviceElement.addClass('service');
		serviceElement.addClass(this.name);
		serviceElement.appendTo(this.renderTo);

		this.element = serviceElement;
	}

	sectionAdd(sectionData) {
		this.sections[sectionData.name] = new section(sectionData, this.element);
	}

	sectionAdded(sectionData) {
		return (typeof this.sections[sectionData.name] !== "undefined")
	}

}
