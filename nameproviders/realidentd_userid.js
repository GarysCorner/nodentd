//File:		realidentd_userid.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This nameprovider returns the userid.  You probably shouldnt use this name provider directly it should be userd by other name providers

var fs = require('fs');

var procfile = '/proc/net/tcp';


var realconf;

exports.init = function() {


	
	if( process.platform !== 'linux' ) {  //Warn if we aren't using linux
		log.dlog('realidentd_userid:  Warning Real identd is only test on linux but the os reports as "', process.platform, '"');
	}

	try{
		var testdata = fs.readFileSync(procfile, { encoding: 'ascii' }); 
	} catch( err ) {
		log.log('realidentd_userid:  Cloud not read from "', procfile, '": ', err.message);
		return false;
	}
	

	if( config.provider.realidentd_userid === undefined ) {  //check if the configuration has been set
		log.log('realidentd_userid:  Warning config.provider.realidentd_userid is not set, it a good idea to configure it.');
		config.provider.realidentd_userid = { };
	}
	
	
	if( config.provider.realidentd_userid.block_sysusers === undefined ) { //check if block_sysusers is set and set default
	
		log.log('realidentd_userid:  blocksysusers not set, defaulting to true for security.');
		config.provider.realidentd_userid.block_sysusers = true;
	
	}

	realconf = config.provider.realidentd_userid;

	
	
	return true;

}



exports.providename = function(result, socket, callback) {

	fs.readFile(procfile, { encoding: 'ascii' }, function( err, data ) {
	
		if( err ) {
			log.log('Error reading "', procfile, '" sending user error...');
			callback( false, socket, callback);
			return
		}
		
		const portregex = /[0-9A-F]{4}$/;
		
		//port socket.portPair in a good format for comparison
		var portpair = '0000'.concat(socket.portPair[0].toString(16)).slice(-4).concat('0000'.concat(socket.portPair[1].toString(16)).slice(-4)).toUpperCase();
		
		var useridlist = [];
		var portlist = [];
		
		
		if( err ) {  //throw error if we can't read the file
			log.log('Error reading "', procfile, '":  ', err.message);
			callback( false, socket, callback); 	//I need a way to bubble errors
			return  //make sure the function doesnt continue and do another callback after the socket closes
		}
		

		
		data = data.split('\n');  //split data on lines
		

		for( i=1; i<data.length-1; i++ ) {  //the first line is headers and the last is after a return
			
			row = data[i].split(/\s+/);		//split data on columns

			if( config.provider.realidentd_userid.block_sysusers && ( parseInt(row[8]) < 1000 )) {continue;} //check if userid is <1000 =sysuser

			useridlist.push( row[8] );
			portlist.push( row[2].match(portregex)[0].concat(row[3].match(portregex)[0]));
			
		}
		
		var index = portlist.indexOf( portpair );

		if( index === -1 ) {  //determine if portpair found and return userid
			callback( false, socket, callback);
		} else {
			callback( useridlist[index], socket, callback);
		}
		

	}); 
	

	
};
