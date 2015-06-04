//File:		cmdlineopts.js
//App:		nodentd
//Arthur:		Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Parse the command line options and overide the config object



exports.parse = function() {


	
	//loop through command line arguments
	for( var i = 2; i < process.argv.length; i++ ) {
	
		switch( process.argv[i] ) {
		
			
		
			case '-n':
			case '--nameproviders':
				//configure config.nameproviders
				i++;
				break;
	
		
			case '-i':
			case '--statsinterval':
				//configure config.displayStats
				i++;
				break;
	
		
			case '-d':
			case '--debug':
				//configure config.debug
				i++;
				break;
	
		
			case '-s':
			case '--systemname':
				//configure config.systemName
				i++;
				break;
	
		
			case '-t':
			case '--timeout':
				//configure config.setTimeout
				i++;
				break;
		
			case '-p':
			case '--port':
				//configure the port
				i++;
				break;		
			
			case '-h':
			case '-?':
			case '--help':
				print_help();
				process.exit(0);
				break;
			
			default:
				console.log('Unknown option: ', process.argv[i]);
				print_help();
				process.exit(4);
		
		}
	
	
	
	}

}


function print_help() {

	/*
		Display the help information here
	*/
	
	console.log('Display some useful information');

}


