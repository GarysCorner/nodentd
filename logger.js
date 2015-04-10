//File:		logger.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Logging subsystem, should be simple

exports.log = function( text, verbose ) {

	var logline = '['.concat( Math.floor(new Date() / 1000), '] ', text );

	if( typeof verbose === 'undefined' ) { verbose = false; }

	if( verbose ) {
		config.debug && console.log(logline);
	} else {
		console.log( logline );
	}

	

};
