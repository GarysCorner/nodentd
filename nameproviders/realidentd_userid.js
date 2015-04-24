//File:		realidentd_userid.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This nameprovider returns the userid.  You probably shouldnt use this name provider directly it should be userd by other name providers

var fs = require('fs');


exports.init = function() {

	if( process.platform !== 'linux' ) {  //Warn if we aren't using linux
		log.dlog('Warning!  Real identd is only test on linux but the os reports as "', process.platform, '"');
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
