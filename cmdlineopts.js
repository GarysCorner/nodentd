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
				
				config.nameproviders = process.argv[i].replace(/\s/g, '');
				config.nameproviders = config.nameproviders.split(',');
				
				break;
	
		
			case '-i':
			case '--statsinterval':
				//configure config.displayStats
				i++;
				config.displayStats = parseInt(process.argv[i]);
				break;
	
		
			case '-d':
			case '--debug':
				//configure config.debug
				config.debug = true;
				break;
	
		
			case '-s':
			case '--systemname':
				//configure config.systemName
				i++;
				config.systemName = process.argv[i];
				break;
	
		
			case '-t':
			case '--timeout':
				//configure config.setTimeout
				i++;
				config.setTimeout = parseInt(process.argv[i]);
				break;
		
			case '-p':
			case '--port':
				//configure the port
				i++;
				config.port = parseInt(process.argv[i]);
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
	
	console.log(	'nodentd version ', version,' by: Gary Bezet <nodentd@GarysCorner.NET\n\n',
			'usage:  nodejs run.js [arguments]\n\n',
			'Arguments:\n',
			'-d or --debug\t\tSet console logging to debug.\n',
			'-i or --statsinterval\tSets the interval for displaying stats, set to 0 to disable stats\n',
			'-n or --nameproviders\tA comma separated list of nameproviders to use as the provider stack\n',
			'\t\t\t(e.g. "use_ip_port,use_port,use_ip,realidentd_username)\n',
			'-p or --port\t\tSets the port to listen on\n',
			'-s or --systemname\tSets the system name that will be returned on valid ident requests.\n',
			'-t or --timeout\t\tSets the timeout for clients to complete a requests.\n',
			'-h or --help\t\tDisplays this message.\n'
		
		);

}


