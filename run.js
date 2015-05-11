//File:		run.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Main application entry point

//////////////////Put require statements here//////////////////
log = require('./logger');

///////local modules


//log starting nodentd server closes issue#13
log.log('==========[ nodentd starting ]==========');

try {
	config = require('./config').getconfig;  //get configuration json object
} catch (err) {
	log.log('Fatal error cannot open "config.js"');
	log.log(err);
	process.exit(3);
}

if( config.setTimeout === undefined ) {  //set timeout if it isnt set
	config.setTimeout = 10;
}

datahandler = require('./datahandler');  //get datahandler module

server = require('./server');


//////////////////Globals//////////////////




//////////////////Code//////////////////
//faile with exit code 1 if we can't start the server or any error bubbles up
try {
	server.start();  //start the server
} catch( err ) {
	log.log('Fatal error failed to start server!');
	log.log(err);
	process.exit(1);
}

