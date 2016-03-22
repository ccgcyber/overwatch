'use strict';

class php5 {

	constructor(dataEmitter) {
		this.name = 'PHP5';

		this.emmiter = dataEmitter;

		// The regex to match all the log data
		this.regexError = /^\[(.+)] \[error] \[pid ([0-9]+)] \[client (.+)] sapi_apache2\.c\([0-9]+\): (.+)$/;
	}

	logMatchError(server, logLine) {
		var logDataError = this.regexError.exec(logLine);

		if (logDataError !== null) {
			var section = logDataError[1]; // The domain name
			var action = 'error';

			// Send the data back
			return this.emit(server, section, action);
		}

		return false;
	}

	emit(server, section, action) {
		// Send the data back
		return this.emmiter.emit(server, php5.tag, section, action);
	}
}

module.exports = php5;

Object.defineProperty(php5, 'tag', { value: 'php' });