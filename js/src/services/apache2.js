'use strict';

export default class apache2 {

	constructor() {
		this.name = 'Apache2';

		// The regex to match all the log data
		this.regex = /^\[(.+)] \[pid ([0-9]+)] \[client (.+)] \[(.+)] ([0-9]+) ([0-9]+) "([^"]+)" "([^"]+)" "([^"]+)$/g
	}

}