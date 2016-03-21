'use strict';

class apache2 {

	constructor(dataEmitter) {
		this.name = 'Apache 2';

		this.emmiter = dataEmitter;

		// The regex to match all the log data
		this.regex = /^\[(.+)] \[pid ([0-9]+)] \[client (.+)] \[(.+)] ([0-9]+) ([0-9]+) "([^"]+)" "([^"]+)" "([^"]+)"$/g
	}

	logMatch(server, logLine) {
		var logData = this.regex.exec(logLine);

		if (logData !== null) {

			var section = logData[1]; // The domain name
			var action = logData[4]; // The HTTP action (GET, POST etc)

			return this.emmiter.emit(server, 'apache2', section, action);
		}

	}

}

module.exports = apache2;
