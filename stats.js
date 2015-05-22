//File:		stats.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Various statistical services fornodentd



//return a stats object
exports.start = {

	connections: 0,
	serverStartTime: null,
	serverStopTime: null,
	namesProvided: 0,
	namesDenied: 0,
	portScans: 0,
		
	addConnection: function() { this.connections++;	},  
	nameProvided: function() { this.namesProvided++; },  
	nameDenied: function() { this.namesDenied++; },
	portScaned: function() { this.portScans++ },
	
	logStats: function() {  //output the statistics
		
		log.log( 'Uptime: ', (this.serverStopTime.getTime() - this.serverStartTime.getTime()) / 1000, ' seconds'  );
		log.log( 'Connections: ' , this.connections );
		log.log( 'Possible port scans:  ', this.portScans );
		log.log( 'Names provided: ', this.namesProvided);
		log.log( 'Names denied: ', this.namesDenied);
		log.log( 'Name resolution rate:  ', Math.round((this.namesProvided / (this.namesProvided + this.namesDenied ) ) * 100), '%');

	
	}
	
};
