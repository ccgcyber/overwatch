'use strict';

var $ = require('jquery');
var service = require('./service.js').default;

export default class server {
	constructor(serverData) {
		console.log('SERVER:: ADD');
		console.log(serverData.services);
		this.name = serverData.name;
		this.services = [];

		this.element = null;

		this.render();

		if (typeof serverData.service !== 'undefined') {
			this.serviceAdd(serverData.service);
		}

	}

	render() {
		// Server Container
		var serverElement = $('<section/>');
		serverElement.attr('id', this.name);
		serverElement.addClass('server');
		serverElement.appendTo('#servers');

		// Header
		var serverHeader = $('<header/>');
		serverHeader.html(this.name.toUpperCase());
		serverHeader.appendTo(serverElement);

		this.element = serverElement;
	}

	serviceAdd(serviceData) {

		if (this.serviceAdded(serviceData) === false) {
			this.services[serviceData.name] = new service(serviceData, this.element);
		}

	}

	serviceAdded(serviceData) {
		return (typeof this.services[serviceData.name] !== "undefined")
	}
}