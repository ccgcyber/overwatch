'use strict';

var Tail = require('tail').Tail;
var io = require('socket.io')(3000);
var apache2 = require('./services/apache2');

// Function to send data to the client(s)
var emitter = {
	emit: function(server, service, section, action) {
		console.log(server, service, section, action);

		var serverData = {
			server: {
				name: server,
				service: {
					name: service,
					section: {
						name: section,
						action: {
							name: action
						}
					}
				}
			}
		};
		io.emit('data', serverData);

	}
};

// Register services to watch for, syslogtag: serviceClass
var services = {
	'apache2': new apache2(emitter)
};

io.on('connection', function(socket){
    console.log('connected');
});

var tail = new Tail("../syslog");

tail.on("line", function(syslogLine) {

	// Try to match the general syslog format
	var regexSyslogLine = /^(.+) ([^ ]+) (.+): (.+)$/g;
	var syslogLineArray = regexSyslogLine.exec(syslogLine);

	// Check we got a match
	if (syslogLineArray !== null) {

		// Pull out the values into readable variables
		var syslogLineDate = syslogLineArray[1];
		var syslogLineServer = syslogLineArray[2];
		var syslogLineTag = syslogLineArray[3];
		var syslogLineData = syslogLineArray[4];

		// Check this service has been registered
		if (typeof services[syslogLineTag] !== 'undefined') {
			services[syslogLineTag].logMatch(syslogLineServer, syslogLineData);
		}
	}
	return;


	var regexUFWBlock = /.+ ([^ ]+) kernel: \[(.+)] \[UFW BLOCK] IN=(.+) OUT=(.*) MAC=(.+) SRC=(.+) DST=(.+) LEN=([0-9]+) .* PROTO=(.+) SPT=([0-9]+) DPT=([0-9]+) .*/g;
	var UFWBlockArray = regexUFWBlock.exec(syslogLine);
	if (UFWBlockArray !== null) {
		serverData = {
			server: {
				name: UFWBlockArray[1],
				service: {
					name: 'ufw',
					section: {
						name: UFWBlockArray[3],
						action: {
							name: 'BLOCK::'+UFWBlockArray[11]
						}
					}
				}
			}
		};
		console.log(serverData);
		io.emit('data', serverData);
		return;
	}


    var regexCron = /.+ ([^ ]+) CRON\[[0-9]+]: \((.+)\) CMD \(.+ -t (.+)\)/g;
    var cronArray = regexCron.exec(syslogLine);
    if (cronArray !== null) {

		serverData = {
			server: {
				name: cronArray[1],
				service: {
					name: 'cron',
					section: {
						name: cronArray[2],
						action: {
							name: cronArray[3]
						}
					}
				}
			}
		};
		console.log(serverData);
		io.emit('data', serverData);
		return;
    }


	var regexCronSimple = /^.+ ([^ ]+) CRON\[[0-9]+]: \((.+)\) CMD \(.+\)$/g;
	var cronSimpleArray = regexCronSimple.exec(syslogLine);
	if (cronSimpleArray !== null) {

		serverData = {
			server: {
				name: cronSimpleArray[1],
				service: {
					name: 'cron',
					section: {
						name: cronSimpleArray[2],
						action: {
							name: 'UNKNOWN'
						}
					}
				}
			}
		};
		console.log(serverData);
		io.emit('data', serverData);
		return;
	}


	var regexMySQL = /.+ ([^ ]+) mysqld: (.+) \[(.+)]/g;
	var MySQLArray = regexMySQL.exec(syslogLine);
	if (MySQLArray !== null) {

		serverData = {
			server: {
				name: MySQLArray[1],
				service: {
					name: 'mariadb',
					section: {
						name: '',
						action: {
							name: MySQLArray[3]
						}
					}
				}
			}
		};
		console.log(serverData);
		io.emit('data', serverData);
		return;
	}

});
