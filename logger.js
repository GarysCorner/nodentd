//File:		logger.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Logging subsystem, should be simple

var util = require('util');


//Standard logging
exports.log = function() {

	var output = String().concat.apply(arguments[0], Array.prototype.slice.call(arguments, 1));

	util.log( output );
};


//debug loging, things here only get logged if config.debug is true
exports.dlog = function() {

	if(config.debug) {
		var output = String().concat.apply(arguments[0], Array.prototype.slice.call(arguments, 1));

		util.log( output );

	}

};
