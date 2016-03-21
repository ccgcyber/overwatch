'use strict';

class apache2 {

	constructor(dataEmitter) {
		this.name = 'Apache 2';

		this.emmiter = dataEmitter;

		// The regex to match all the log data
		this.regexAccess = /^\[(.+)] \[pid ([0-9]+)] \[client (.+)] \[(.+)] ([0-9]+) ([0-9]+) "([^"]+)" "([^"]+)" "([^"]+)"$/g;
		this.regexError = /^\[(.+)] \[error] \[pid ([0-9]+)] \[client (.+)] (.+)\.c\([0-9]+\): (.+)$/g;
	}

	logMatch(server, logLine) {

		if (this.logMatchAccess(server, logLine)) {
			return;
		}

		if (this.logMatchError(server, logLine)) {
			return;
		}

	}

	logMatchAccess(server, logLine) {
		var logDataAccess = this.regexAccess.exec(logLine);

		if (logDataAccess !== null) {
			var section = logDataAccess[1]; // The domain name
			var action = logDataAccess[4]; // The HTTP action (GET, POST etc)

			// Send the data back
			return this.emit(server, section, action);
		}

		return false;
	}

	logMatchError(server, logLine) {
		var logDataError = this.regexError.exec(logLine);

		if (logDataError !== null) {
			var section = logDataError[1]; // The domain name
			var action = logDataError[4]; // The HTTP action (GET, POST etc)

			// Send the data back
			return this.emit(server, section, action);
		}

		return false;
	}

	emit(server, section, action) {
		// Send the data back
		return this.emmiter.emit(server, apache2.tag, section, action);
	}

}

module.exports = apache2;

Object.defineProperty(apache2, 'tag', { value: 'apache2' });
