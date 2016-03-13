'use strict';

var socket = io('//:3000');
var $ = require('jquery');
var server = require('./server.js').default;

export default class overwatch {

	constructor() {
		this.servers = [];
	}

	newData(data) {

		this.serverAdd(data.server);
		var server = this.servers[data.server.name];

		server.serviceAdd(data.server.service);
		var service = server.services[data.server.service.name];

		service.sectionAdd(data.server.service.section);
		var section = service.sections[data.server.service.section.name];

		section.actionAdd(data.server.service.section.action);
		var action = section.actions[data.server.service.section.action.name];


		console.log(data.server.name,data.server.service.name,data.server.service.section.name,data.server.service.section.action.name);

		action.blink();
	}

	serverAdd(serverData) {
		if (this.serverAdded(serverData) === false) {
			this.servers[serverData.name] = new server(serverData);
		}
	}

	serverAdded(serverData) {
		return (typeof this.servers[serverData.name] !== "undefined")
	}

}

var test = new overwatch;

socket.on('data', function(newData) {
	test.newData(newData);
});