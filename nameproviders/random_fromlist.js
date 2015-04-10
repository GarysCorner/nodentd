//File:		random_fromlist.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This provider returns a random username loaded from a text file.  When properly configured, this provider will always return a username so make it the last one in the provider stack.  Warning the usernames are loaded into ram so don't use anything too large.

fs = require('fs');

//////////////////Put require statements here//////////////////


//////////////////Code//////////////////
var userList;

//all name poviders must export the init function even it if doesnt do anything.  This is a good place to load configuration options. Init functions should only be called one time before the name provider is used
//the function should return true if we are ready to rock, and false if there is a problem with the configuration or anything else.
exports.init = function() {

	if( typeof config.provider.random_fromlist.file === 'string' ) { //check if file is set is set.
		
		try {  //catch error if we can't load the read the file for any reason
			var filedata = fs.readFileSync(config.provider.random_fromlist.file, { encoding: 'ascii' });  //read file into a variable...watch the file size on this one
		} catch( err ) {
			log.log('random_fromlist name provider error reading username file:  '.concat( err ));
			return false;
		}
		


		/*
			We need more work here, some error checking, elemination of blank lines, support for both '\n' and '\r\n' etc  I'll work on it

			The userlist should be a text file one username per line and lines should end in '\n' not '\r\n'.
		*/
		userList = filedata.split('\n');  //loads the userlist

		return true;  //good config
	} else {
		log.log('The file property is not defined or is not a string for the random_fromlist provider.');  //let the user know why we failed
		return false;  //bad config
	}


};

//all name providers must export the init function.  The function should return a username to be returned as a string, or it should return false, in which case the next name provider from the stack should be used.
//this function should except socket even if it's not used.  Socket will contain everything we know about the request so far.
exports.providename = function(socket) {

	return userList[Math.floor( Math.random()*userList.length )];
};
