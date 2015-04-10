//File:		defaultname.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This provider returns the default username.  It will not fail unless the username is not set so it should be last in the nameprovder stack.


//////////////////Put require statements here//////////////////


//////////////////Code//////////////////


//all name poviders must export the init function even it if doesnt do anything.  This is a good place to load configuration options. Init functions should only be called one time before the name provider is used
//the function should return true if we are ready to rock, and false if there is a problem with the configuration or anything else.
exports.init = function() {

	if( typeof config.provider.defaultname.username === 'string' ) { //check if defaultusername is set.
		return true;  //good config
	} else {
		log.log('The username property is not defined or is not a string for the defaultname provider.');  //let the user know why we failed
		return false;  //bad config
	}
};

//all name providers must export the init function.  The function should return a username to be returned as a string, or it should return false, in which case the next name provider from the stack should be used.
//this function should except socket even if it's not used.  Socket will contain everything we know about the request so far.
exports.providename = function(socket) {
	return config.provider.defaultname.username;
};
