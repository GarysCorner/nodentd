//File:		server.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Starting the identd server here

//////////////////Put require statements here//////////////////
net = require('net');




//////////////////Globals//////////////////




//////////////////Code//////////////////


//Creat the inital server


exports.start = function() { 


	

	server = net.createServer(function( socket ) {  //create the server
	
		stats.addConnection();

		socket.setEncoding('ascii');  //set the encoding	
	
		socket.remoteAddr = socket.remoteAddress;  //save the remote address in case we need it after close
		socket.linebuff = '';  //initalize the linebuffer
		socket.lineRecv = false;  //set lineRecv so we can tell if a line was received when the client exits.  (Fix issue#1)
		socket.cancelTime = Math.floor(new Date()/1000) + config.setTimeout;

		log.dlog( 'Connection open from ', socket.remoteAddr);

		socket.on('data', function(data) {
			datahandler.datareceived(data, socket);
		});

		socket.on('end' ,function() {
			if(!socket.lineRecv) {  //check to see if a line was actually received from the client, and throw a non-debug log event  (Fix issue#1)
				log.log('Connection from ', socket.remoteAddr ,' closed without valid line!');
			} else {
				log.dlog('Connection from ', socket.remoteAddr ,' closed');
			}
		});

		socket.on('error', function(err) {
			if( (err.code === 'ECONNRESET') && (socket.remoteAddr == null) ) {  //test show this connection happens during an nmap synscan
				stats.portScaned();
				log.log('Warning! Possible port scan detected!');
			} else {
				log.log('Connection error addr: ', socket.remoteAddr, ' destroying connection:  ', err.message);
			}

			socket.destroy();
		});
		
		socket.setTimeout(1000 * config.setTimeout, function() {
			socket.end();
			log.dlog('Socket timeout:  ', socket.remoteAddr);
		});




	});


	server.on('listening', function() {
		log.log('nodentd listening on port ', config.port );
		stats.serverStartTime = new Date();
	});
	
	server.on('close', function() {
		stats.serverStopTime = new Date();
		log.dlog('server stopped');
		
		stats.logStats();
		
	});

	server.on('error', function(err) {
		if(err.code === 'EADDRINUSE') {
			log.log( 'Failed to listen on port ', config.port, ' port is already in use, exiting with code 6.  (Do you have another instance of nodentd running?)' );
			process.exit(6);
		} else if( err.code === 'EACCES' ) {
			log.log('Failed to listen on port ', config.port, ' you do not have access. (regular users cannot access low ports on some linux distros, but that doesnt mean you should run nodentd as root.  Look into workaround like rerouting the port in iptables)');
		} else {
			log.log('Failed to listen on port ', config.port, ' exiting with code 6:  ', err);
			process.exit(6);
		}
	});

	server.listen(config.port);  //start listening on the server



}

