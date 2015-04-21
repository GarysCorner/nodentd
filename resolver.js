//File:		resolver.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Gets configuation and sets it to a json object which is returned


//////////////////Put require statements here//////////////////


//////////////////Code//////////////////


var providers = [];


//load providers dynamically
exports.init = function() {
	
	for (var i =0; i < config.nameproviders.length; i++ ) {  //iterate through the name providers
		
		log.dlog('Loading name provider: ', config.nameproviders[i]);

		providers.push(require('./nameproviders/'.concat( config.nameproviders[i])));
		

		log.dlog('Intializeing name provider: ', config.nameproviders[i]);

		if( ! providers[i].init() ) {    //each provider must be initialized and must return true
			log.log('Fatal error, failed to initialize name provider: ', config.nameproviders[i]);
			process.exit(2);
		} else {
			log.dlog('Name provider successfully initialized: ', config.nameproviders[i] );
		}
	}

}


//returns the string to be sent to client
exports.resolve = function( socket ) {
	
	var result;

	for (i =0; i < providers.length; i++ ) {  //iterate through the name providers
		result = providers[i].providename(socket);
		
		if( result ) { break; } //quit the loop if successful

	}

	if( result ) {  //return the result
		return socket.portPair[0].toString().concat( ', ', socket.portPair[1].toString(), ' : USERID : UNIX : ', result, '\r\n');
	} else {
		return '23, 6195 : ERROR : NO-USER\r\n';
	}

};


