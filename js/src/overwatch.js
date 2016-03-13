'use strict';

var socket = io('//:3000');
var $ = require('jquery');
var server = require('./server.js').default;

export default class overwatch {

	constructor() {
		this.servers = [];
	}

	newData(data) {

		if (this.serverAdded(data.server) === false) {
			this.serverAdd(data.server)
		}

		var server = this.servers[data.server.name];
		console.log(server);

		var service = server.services[data.server.service.name];
		console.log(service);

		var section = service.sections[data.server.service.section.name];
		console.log(section);

		var action = section.actions[data.server.service.section.action.name];
		console.log(action);

		action.blink();
	}

	serverAdd(serverData) {
		this.servers[serverData.name] = new server(serverData);
	}

	serverAdded(serverData) {
		return (typeof this.servers[serverData.name] !== "undefined")
	}

}

var test = new overwatch;