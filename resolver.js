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
exports.resolve = function( socket, callback ) {
	
	var loop = resolverLoop(callback);  //callback loop varable

	loop(false, socket, loop);  //call the callback loop using itself as a variable


	


};


function resolverLoop(finalcallback) {

	var counter = -1;  //start at negative 1 to offset preincrement
		

	return function(result, socket, callbackLoop) {

		counter++;  //preincrment


		if( counter === providers.length || result !== false ) {  //if we have reached the last nameprovider return to dataprovider
			finalcallback(result, socket);
		} else {
			
			providers[counter].providename(result, socket, callbackLoop);  //call the next name provider
		}

		
	};

};


