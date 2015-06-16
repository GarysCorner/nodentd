//File:		run.js
//App:		nodentd
//Arthur:		Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Main application entry point

version = '1.5';

log = require('./logger');

//log starting nodentd server closes issue#13
//variables for realidentd_username timer
realidend_username_timer = null;


try {
	config = require('./config').getconfig;  //get configuration json object
} catch (err) {
	log.log('Fatal error cannot open "config.js"');
	log.log(err);
	process.exit(3);
}

require('./cmdlineopts').parse();

log.log('==========[ nodentd starting ]==========');

if( config.setTimeout === undefined ) {  //set timeout if it isnt set
	config.setTimeout = 10;
}

stats = require('./stats').start();
datahandler = require('./datahandler');  //get datahandler module
server = require('./server');




//faile with exit code 1 if we can't start the server or any error bubbles up
try {
	server.start();  //start the server
} catch( err ) {
	log.log('Fatal error failed to start server!');
	log.log(err);
	process.exit(1);
}


//catch the SIGINT to gracefully exit issue #24
process.on('SIGINT', function() {
	
	var sigint_recvd = false;  //has another SIGINT already been received?
	
	return function() {
	
		stats.stopTimer();
		
		if(realidend_username_timer !== null) {
			clearInterval(realidend_username_timer);
			log.dlog('realidentd_username:  Stopping timer.');
		}
		
		if( sigint_recvd === false ) {  
			log.log('SIGINT received, waiting for all connection to close and attempting to exit (CTRL+C again to exit now)...');
			server.close();
		} else {
			log.log('a second SIGINT was recieved exiting NOW!');
			stats.serverStopTime = new Date();  //the server didnt stop normally so we need to supply this value
			stats.logStats();
			process.exit();
		}
		
		sigint_recvd = true;
		
	};
		
	
		
}());

process.on('exit', function() { log.log('==========[ nodentd stopped ]=========='); });


