//File:		realidentd_username.js
//App:		nodentd
//Arthur:		Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	This nameprovider returns the REAL username.  This name provider requires the realidentd_userid name provider to do the heavy lifting


var timer = null;
var fs = require('fs');
var realidentd_userid = require('./realidentd_userid');


var userfile = '/etc/passwd';

var usernamemap = null;

exports.init = function() {

	if( !realidentd_userid.init() ) {  //try to configure realident_userid and fail if it does
	
		log.log('realidentd_username:  configuring subprovider "realidentd_userid" failed!');
		return false;	
		
	}
	
	
	if( process.platform !== 'linux' ) {  //Warn if we aren't using linux
		log.log('realidentd_username:  Warning Real identd is only tested on linux but the os reports as "', process.platform, '"');
	}
	
	

	if( config.provider.realidentd_username === undefined ) {  //check if the configuration has been set
		log.log('realidentd_username:  Warning config.provider.realidentd_username is not set, it a good idea to configure it.');
		config.provider.realidentd_username = { };
	}
	
	
	if( config.provider.realidentd_username.block_sysusers === undefined ) { //check if block_sysusers is set and set default
	
		log.log('realidentd_username:  block_sysusers not set, defaulting to true for security.');
		config.provider.realidentd_username.block_sysusers = true;
	
	}
	
	if( config.provider.realidentd_username.loadInterval === undefined ) { //check if loadInterval is set
	
		log.log('realidentd_username:  loadInterval not set, defaulting to 60 minutes.');
		config.provider.realidentd_username.loadInterval = 60;
	
	}
	
	if( loadNames(true) ) {
		
		if( config.provider.realidentd_username.loadInterval > 0 ) {
			realidend_username_timer = setInterval(function(){loadNames(false);}, config.provider.realidentd_username.loadInterval * 1000 * 60);
		}
		
		return true;
	} 
	
	return false;  //return false if true isn't returned by the above
}


//load the usernames here use
function loadNames(verbose) {

	var userfiledata;
	var tempusernamemap = { length: 0 };

	
	try{
		userfiledata = fs.readFileSync(userfile, { encoding: 'ascii' }); 
	} catch( err ) {
		log.log('realidentd_username:  Could not read from "', userfile, '": ', err.message);
		return false;
	}
	
	var datalines = userfiledata.split('\n');
	
	datalines.forEach(function(line) {
		var row = line.split(':');
		
		
		if(row.length < 3) {return;}  //get rid of invalid lines, like the trailing line
		
		if( config.provider.realidentd_username.block_sysusers && parseInt( row[2] ) < 1000 ) {return;} //get rid of system users for security if block_sysuser set to true
		
		tempusernamemap[row[2]] = row[0];
		
		verbose && log.dlog('realidentd_username:  "', row[0], '" added to usermap with id ', row[2]);
		
		tempusernamemap.length++;
			
	}); 
	
	verbose && log.log('realidentd_username:  ', tempusernamemap.length, ' user names added to usermap');
	
	if( tempusernamemap.length === 0 ) {  //fail if there are no usernames
	
		if(verbose) {
			log.log('realidentd_username:  fatal error, no user names were found in ', userfile);
		} else {
			log.log('realidentd_username:  error reading from ', userfile, ' keeping current list.');
		}
		return false;  //config failed
	
	}
	
	usernamemap = tempusernamemap;
	
	return true;

};



exports.providename = function(mainresult, mainsocket, maincallback) {

	

	realidentd_userid.providename( false, mainsocket, function(result, socket, callback) {  
		
		if( !result ) { maincallback(false, socket, maincallback);  return }  //return false if realidentd_userid doesnt provid anything
		
		var username = usernamemap[result];
		
		if( username === undefined ) {
			log.dlog('realidentd_username:  realidentd_userid provider an id but it could not be mapped! (possibly sysuser?)');
			maincallback(false, socket, maincallback);
			return;
		} else {
			maincallback(username, socket, maincallback);
			return;
		}
		
	});

}


