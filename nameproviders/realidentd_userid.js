//File:		realidentd_userid.js
//App:		nodentd
//Arthur:		Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This nameprovider returns the userid.  You probably shouldnt use this name provider directly it should be userd by other name providers

var fs = require('fs');

var procfile = '/proc/net/tcp';


var realconf;

exports.init = function() {


	
	if( process.platform !== 'linux' ) {  //Warn if we aren't using linux
		log.log('realidentd_userid:  Warning Real identd is only tested on linux but the os reports as "', process.platform, '"');
	}



	if( config.provider.realidentd_userid === undefined ) {  //check if the configuration has been set
		log.log('realidentd_userid:  Warning config.provider.realidentd_userid is not set, it a good idea to configure it.');
		config.provider.realidentd_userid = { };
	}
	
	
	if( config.provider.realidentd_userid.block_sysusers === undefined ) { //check if block_sysusers is set and set default
	
		log.log('realidentd_userid:  block_sysusers not set, defaulting to true for security.');
		config.provider.realidentd_userid.block_sysusers = true;
	
	}

	try{
		fs.readFileSync(procfile, { encoding: 'ascii' }); 
	} catch( err ) {
		log.log('realidentd_userid:  Could not read from "', procfile, '": ', err.message);
		return false;
	}
	

	realconf = config.provider.realidentd_userid;

	
	
	return true;

}



const portregex = /[0-9A-F]{4}$/;
const ipregex = /^[0-9A-F]{8}/;

exports.providename = function(result, socket, callback) {


	fs.readFile(procfile, { encoding: 'ascii' }, function( err, data ) {
	
		if( err ) {
			log.log('Error reading "', procfile, '" sending user error...');
			callback( false, socket, callback);
			return
		}
		

		
		//port socket.portPair in a good format for comparison
		var portpair = '0000'.concat(socket.portPair[0].toString(16)).slice(-4).concat('0000'.concat(socket.portPair[1].toString(16)).slice(-4)).toUpperCase();
		
		
		/*
			These 3 arrays line up with each other
			useridlist is an array of userids stored as a string
			portlist is a list of strings which representing the local remote port pairs in 2 consecuative sets of 4 hex characters
			remoteiplist is a list of remoteipaddress in hex
			
		*/
			
		var useridlist = [];  
		var portlist = [];
		var remoteiplist = [];
		
		
		if( err ) {  //throw error if we can't read the file
			log.log('Error reading "', procfile, '":  ', err.message);
			callback( false, socket, callback); 	//I need a way to bubble errors
			return  //make sure the function doesnt continue and do another callback after the socket closes
		}
		

		
		data = data.split('\n');  //split data on lines
		

		for( i=1; i<data.length-1; i++ ) {  //the first line is headers and the last is after a return
			
			row = data[i].split(/\s+/);		//split data on columns
			
			if( row[4] === '0A' ) {continue;}  //ignore listening ports
			if( config.provider.realidentd_userid.block_sysusers && ( parseInt(row[8]) < 1000 )) {continue;} //check if userid is <1000 =sysuser

			useridlist.push( row[8] );
			portlist.push( row[2].match(portregex)[0].concat(row[3].match(portregex)[0]) );
			remoteiplist.push( row[3].match(ipregex)[0] );
			
			
		}
		
		var index = portlist.indexOf( portpair );
						
		if( index > -1 ) {   //determine if portpair found and return userid
		
			//convert the remoteip to a normalized string representation
			var remoteIP = parseInt( remoteiplist[index].substr(6,2), 16).toString().concat('.', parseInt(remoteiplist[index].substr(4,2), 16).toString() , '.', parseInt(remoteiplist[index].substr(2,2), 16).toString(), '.', parseInt(remoteiplist[index].substr(0,2), 16).toString()   );
			
			if( remoteIP === socket.remoteAddr ) {  //check that the portpair belongs the the client the requested it
			
				log.dlog('realidentd_userid:  returning userid ', useridlist[index]);
				callback( useridlist[index], socket, callback);
				return;
				
			} else {
			
				//log because the could be indicative of malicious probe
				log.log('realidentd_userid:  Rejected request from ', socket.remoteAddr, ' because portpair ', socket.portPair[0], ',' ,socket.portPair[1], ' belongs to ', remoteIP);
				callback(false, socket, callback);
				return;
			
			}
			
		} else {
			log.dlog( 'realidentd_userid:  Did not suitable match for portpair: ', socket.portPair[0], ',', socket.portPair[1] );
			callback( false, socket, callback);	
			return;
		}
		
	}); 
	

	
};
