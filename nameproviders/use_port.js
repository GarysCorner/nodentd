//File:		use_port.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This provider returns the username based on the remote port that is requested


//////////////////Put require statements here//////////////////


//////////////////Code//////////////////


var rulePorts = [];
var ruleUsers = [];


//all name poviders must export the init function even it if doesnt do anything.  This is a good place to load configuration options. Init functions should only be called one time before the name provider is used
//the function should return true if we are ready to rock, and false if there is a problem with the configuration or anything else.
exports.init = function() {

	if( typeof config.provider.use_port.rules !== 'object'  ) { //check if rules array is set (rules may be empty but that would be silly)
		log.log('The rules property is not defined or is not a string for the use_port provider.');  //let the user know why we failed
		return false;  //bad config
	}

	for(var i=0; i<config.provider.use_port.rules.length; i++ ) {  //load rules

		rulePorts.push(config.provider.use_port.rules[i][0]);

		ruleUsers.push(config.provider.use_port.rules[i][1]);
	}

	return true;
};

//all name providers must export the init function.  The function should return a username to be returned as a string, or it should return false, in which case the next name provider from the stack should be used.
//this function should except socket even if it's not used.  Socket will contain everything we know about the request so far.
exports.providename = function(socket) {
	
	var inArray = rulePorts.indexOf(socket.portPair[1]);

	if( inArray == -1 ) {  //there is no rule for this remote port, pass through.
		return false;
	} else {
		return ruleUsers[inArray];  //return the user for this port
	}

};
