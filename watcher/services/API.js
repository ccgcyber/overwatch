'use strict';

class API {

	constructor(dataEmitter) {
		this.name = 'API';

		this.emmiter = dataEmitter;

		// The regex to match all the log data
		this.regexPrimary = /\[(.+)] \[pid ([0-9]+)] \[client (.+)] \[(.+)] ([0-9]+) ([0-9]+) "(.+) (\/rest\/av\/[^/ ]+).+" "(.+)" "(.+)"/;
		this.regexSecondary = /\[(.+)] \[pid ([0-9]+)] \[client (.+)] \[(.+)] ([0-9]+) ([0-9]+) "(.+) (\/slumber\/[^/ ]+\/[^/ ]+\/[^/ ]+).+" "(.+)" "(.+)"/;
	}

	logMatchAccess(server, logLine) {
		var logDataAccess;

		logDataAccess = this.regexPrimary.exec(logLine);

		if (logDataAccess == null) {
			logDataAccess = this.regexSecondary.exec(logLine);
		}

		if (logDataAccess !== null) {
			var section = logDataAccess[8]; // The domain name
			var action = logDataAccess[4];

			// Send the data back
			return this.emit(server, section, action);
		}

		return false;
	}

	emit(server, section, action) {
		// Send the data back
		return this.emmiter.emit(server, API.tag, section, action);
	}
}

module.exports = API;

Object.defineProperty(API, 'tag', { value: 'API' });