//File:		random_fromlist.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This provider returns a random username loaded from a text file.  When properly configured, this provider will always return a username so make it the last one in the provider stack.  Warning the usernames are loaded into ram so don't use anything too large.

fs = require('fs');

//////////////////Put require statements here//////////////////


//////////////////Code//////////////////
var userList = [];

//all name poviders must export the init function even it if doesnt do anything.  This is a good place to load configuration options. Init functions should only be called one time before the name provider is used
//the function should return true if we are ready to rock, and false if there is a problem with the configuration or anything else.
exports.init = function() {

	if( typeof config.provider.random_fromlist.file === 'string' ) { //check if file is set is set.
		
		try {  //catch error if we can't load the read the file for any reason
			var filedata = fs.readFileSync(config.provider.random_fromlist.file);  //read file into a variable...watch the file size on this one
		} catch( err ) {
			log.log('random_fromlist:  name provider error reading username file:  ', err );
			return false;
		}
		


		/*
			We need more work here, some error checking, elemination of blank lines, support for both '\n' and '\r\n' etc  I'll work on it

			The userlist should be a text file one username per line and lines should end in '\n' not '\r\n'.
		*/
		var tmpuserList = filedata.toString().split(/\r\n|\n/);  //loads the userlist
		
		
		tmpuserList.forEach(function(name) {  //check userlist for validity
			
			
			if( /^[^\s\0:]+$/.test(name) ) {
				userList.push( name );
			} else {
				log.dlog('random_fromlist: user name "', name,'" rejected from list ', config.provider.random_fromlist.file);
			}
				
		});
		
		if( userList.length === 0 ) {  //no usernames in list
			log.log('random_fromlist:  No usernames could be added from ', config.provider.random_fromlist.file);
			return false;
		}
		
		log.log('random_fromlist:  ', userList.length, '/', tmpuserList.length, ' user names added to list.');
		
		return true;  //good config
	} else {
		log.log('The file property is not defined or is not a string for the random_fromlist provider.');  //let the user know why we failed
		return false;  //bad config
	}


};

//all name providers must export the init function.  The function should return a username to be returned as a string, or it should return false, in which case the next name provider from the stack should be used.
//this function should except socket even if it's not used.  Socket will contain everything we know about the request so far.
exports.providename = function(result, socket, callback) {

	callback( userList[Math.floor( Math.random()*userList.length )], socket, callback );
};



