'use strict';

var Tail = require('tail').Tail;
var io = require('socket.io')(3000);

io.on('connection', function(socket){
    console.log('connected');
});

var tail = new Tail("../syslog");

tail.on("line", function(data) {

	var serverData = {};
    var regexApacheAccess = /.+ ([^ ]+) apache2: \[(.+)] \[pid ([0-9]+)] \[client (.+)] \[(.+)] ([0-9]+) ([0-9]+) "([^"]+)" "([^"]+)" "([^"]+)"/g;
    var apacheAccessArray = regexApacheAccess.exec(data);
    if (apacheAccessArray !== null) {
		serverData = {
			server: {
				name: apacheAccessArray[1],
				service: {
					name: 'apache2',
					section: {
						name: apacheAccessArray[2],
						action: {
							name: apacheAccessArray[5]
						}
					}
				}
			}
		};
		console.log(serverData);
		io.emit('data', serverData);
		return;
    }


    var regexApacheError = /.+ ([^ ]+) apache2: \[(.+)] \[error] \[pid ([0-9]+)] \[client (.+)] (.+)\.c\([0-9]+\): (.+)/g;
    var apacheErrorArray = regexApacheError.exec(data);
    if (apacheErrorArray !== null) {

		// Determine if this is an Apache error or an error in mod_php
		var serviceName = (apacheErrorArray[5] === 'sapi_apache2') ? 'php':'apache2';

		serverData = {
			server: {
				name: apacheErrorArray[1],
				service: {
					name: serviceName,
					section: {
						name: apacheErrorArray[2],
						action: {
							name: 'error'
						}
					}
				}
			}
		};
		console.log(serverData);
		io.emit('data', serverData);
		return;
    }


    var regexUFWBlock = /.+ ([^ ]+) kernel: \[(.+)] \[UFW BLOCK] IN=(.+) OUT=(.*) MAC=(.+) SRC=(.+) DST=(.+) LEN=([0-9]+) TOS=(.+)/g;
    var UFWBlockArray = regexUFWBlock.exec(data);
    if (UFWBlockArray !== null) {
		serverData = {
			server: {
				name: UFWBlockArray[1],
				service: {
					name: 'ufw',
					section: {
						name: UFWBlockArray[3],
						action: {
							name: 'BLOCK'
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
