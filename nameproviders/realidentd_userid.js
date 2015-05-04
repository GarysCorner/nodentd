//File:		realidentd_userid.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This nameprovider returns the userid.  You probably shouldnt use this name provider directly it should be userd by other name providers

var fs = require('fs');

var procfile = '/proc/net/tcp';

var ipportregex = /[0-9A-F]{8}:[0-9A-F]{4}\s[0-9A-F]{8}:[0-9A-F]{4}/g;

var localportregex = /:[0-9A-F]{4}\s/;
var remoteportregex = /[0-9A-F]{4}$/;

exports.init = function() {

	

	if( process.platform !== 'linux' ) {  //Warn if we aren't using linux
		log.dlog('Warning!  Real identd is only test on linux but the os reports as "', process.platform, '"');
	}

	try{
		var testdata = fs.readFileSync(procfile, { encoding: 'ascii' }); 
	} catch( err ) {
		log.log('Cloud not read from "', procfile, '": ', err.message);
		return false;
	}


	return true;

}



exports.providename = function(result, socket, callback) {

	fs.readFile(procfile, { encoding: 'ascii' }, function( err, data ) {
		
		
		if( err ) {  //throw error if we can't read the file
			log.log('Error reading "', procfile, '":  ', err.message);
			callback( false, socket, callback); 	//I need a way to bubble errors
			return  //make sure the function doesnt continue and do another callback after the socket closes
		}
		
		var portpair = [];  //this array will contain "local|remote" port pairs as strings without the '|'
		

		data.match(ipportregex).forEach(function(value) {  //push all portpairs in hexadecimal into an array for searching
			
			portpair.push( value.match(localportregex)[0].slice(1,5).concat(value.match(remoteportregex)[0]));
		
		});
		
		var searchPair = '0000'.concat( socket.portPair[0].toString(16)).substr(-4).concat( '0000'.concat( socket.portPair[1].toString(16)).substr(-4) ).toUpperCase();
		
		
		
		callback( portpair.indexOf(searchPair), socket, callback);
		
	
	
	}); 
	

	
};
