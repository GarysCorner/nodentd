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

		socket.setEncoding('ascii');  //set the encoding	
	
		socket.remoteAddr = socket.remoteAddress;  //save the remote address in case we need it after close
		socket.linebuff = '';  //initalize the linebuffer


		log.dlog( 'Connection open from '.concat( socket.remoteAddr));


		socket.on('data', function(data) {
			datahandler.datareceived(data, socket);
		});

		socket.on('end' ,function() {
			log.dlog('Connection from '.concat( socket.remoteAddr ,' closed'));
		});

		socket.on('error', function() {
			log.log('Connection error addr: '.concat( socket.remoteAddr, ' closing connection' ));
			socket.destroy();
		});




	});


	server.on('listening', function() {
		log.log('nodentd listening on port '.concat( config.port ));
	});

	server.on('error', function(err) {
		log.log('Failed to listen on port '.concat(config.port, ' exiting with code 6:  ', err) );
		process.exit(6);
	});

	server.listen(config.port);  //start listening on the server



}
