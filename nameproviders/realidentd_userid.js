//File:		realidentd_userid.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This nameprovider returns the userid.  You probably shouldnt use this name provider directly it should be userd by other name providers

var fs = require('fs');


exports.init = function() {

	if( process.platform !== 'linux' ) {  //make sure we are running on linux.  Later we will warn the user and then check for the proc device and continue if it is read.
		log.log('Real identd services are currently only availble on linux but your OS reports as "', process.platform, '"');
		return false;
	}

	try{
		var testdata = fs.readFileSync('/proc/net/tcp', { encoding: 'ascii' }); 
	} catch( err ) {
		log.log('Cloud not read from /proc/net/tcp: ', err.message);
		return false;
	}


	return true;

}



exports.providename = function(socket) {
	return false;
}
