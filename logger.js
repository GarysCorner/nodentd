//File:		logger.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Logging subsystem, should be simple

var util = require('util');

exports.log = function( text, verbose ) {

	
	if( typeof verbose === 'undefined' ) { verbose = false; }

	if( verbose ) {
		config.debug && util.log(text);
	} else {
		util.log( text );
	}

	

};
