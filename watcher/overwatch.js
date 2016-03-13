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


    var regexApacheError = /.+ ([^ ]+) apache2: \[(.+)] \[error] \[pid ([0-9]+)] \[client (.+)] (.+)/g;
    var apacheErrorArray = regexApacheError.exec(data);
    if (apacheErrorArray !== null) {
		serverData = {
			server: {
				name: apacheErrorArray[1],
				service: {
					name: 'php',
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

});
