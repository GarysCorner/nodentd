//File:		stats.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Various statistical services fornodentd



//return a stats object
exports.start = function() {

	 
	
	//create the state object
	var statobject = {
		connections: 0,
		serverStartTime: null,
		serverStopTime: null,
		namesProvided: 0,
		namesDenied: 0,
		portScans: 0,
		timer: null,
		
		addConnection: function() { this.connections++;	},  
		nameProvided: function() { this.namesProvided++; },  
		nameDenied: function() { this.namesDenied++; },
		portScaned: function() { this.portScans++ },
		
		//start the timer
		startTimer: function() {
			
			if(this.displayStats !== false) {
			
				var thisholder = this;  //placeholder for this object
				this.Timer = setInterval(function() {
					log.dlog('displayStats initiated on interval ', thisholder.displayStats, ' minute' );
					thisholder.logStats();
				}, this.displayStats * 1000 * 60);
			}
		
		},
		
		//stop the timmer
		stopTimer: function() {
		
			if( this.Timer !== null ) {
				clearInterval(this.Timer);
				this.Timer = null;
			}
		
		},
	
		logStats: function() {  //output the statistics
		
			log.log( 'Uptime: ', ( (new Date().getTime()) - this.serverStartTime.getTime()) / 1000, ' seconds'  );
			log.log( 'Connections: ' , this.connections );
			log.log( 'Possible port scans:  ', this.portScans );
			log.log( 'Names provided: ', this.namesProvided);
			log.log( 'Names denied: ', this.namesDenied);
			log.log( 'Name resolution rate:  ', Math.round((this.namesProvided / (this.namesProvided + this.namesDenied ) ) * 100), '%');

	
		}
	};
	
	//check if the stats are enabled
	if( config.displayStats == false || config.displayStats === undefined || isNaN( config.displayStats ) || parseInt(config.displayStats) < 1 ) {
		config.displayStats = false;
		statobject.displayStats = false;
		
		log.dlog('Displaying stats on interval is disabled');
		
	} else {
		config.displayStats = parseInt( config.displayStats );
		statobject.displayStats = config.displayStats;
		
		log.dlog('Stats will be displayed every ', config.displayStats, ' minutes');
		
	}
	

	
	return statobject;  //return the stats object
		
};

