//File:		datahandler.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Receives data events from client

//////////////////Put require statements here//////////////////

StringDecoder = require('string_decoder').StringDecoder;

resolver = require('./resolver');  //resolves the username from local/remote ports
resolver.init();  //initalize the resolver

//////////////////Globals//////////////////

var validcheckRegex = /^\d{1,5}\s?,\s\d{1,5}(\r\n|\r|\n)$/;  //regex for making sure line is valid we are allow '\n' even though it's not really valid for capatibility, also good for testing with netcat  We also added in an support for a space before the , because quakenet sends this IDKWHY?!?
var pullportRegex = /\d{1,5}/g ;


//////////////////Code//////////////////

var decoder = new StringDecoder('utf8');


exports.datareceived = function (data, socket) {

	socket.linebuff += decoder.write(data);  //add data to the linebuffer

	if( socket.linebuff.slice(-1) == '\n' ) { 
		
		parseline(socket);
				
	}

	

};


//parse line and get out the local and remote ports, or output error and end connection
function parseline(socket) {


	if( validcheckRegex.test(socket.linebuff) ) {
		log.dlog('Line from '.concat( socket.remoteAddr, ' tests valid format'));  //verbose

		var portsearchresults = socket.linebuff.match(pullportRegex);

		socket.portPair = [ parseInt(portsearchresults[0]), parseInt(portsearchresults[1])  ];

		log.dlog('Port-pair '.concat( socket.portPair, ' request by ', socket.remoteAddr));  //We prent this no matter what to main log file file.
		
		if(  socket.portPair[0] > 65535 && socket.portPair[1] > 65535) {  //invalid  port return error

			log.log('Invalid ports request '.concat( socket.portPair, ' request by ', socket.remoteAddr) );

			socket.end( socket.portPair[0].toString().concat( ', ', socket.portPair[1].toString(), ' : ERROR : INVALID-PORT\r\n'));

		} else {  //port is valid lets resolve
			var responce = resolver.resolve(socket);
			
			log.log('Responce sent to :'.concat( socket.remoteAddr, ' -> ', responce.slice(0,-2)));

			socket.end(responce);
		}

		
	} else {
		log.log('Invalid data from '.concat( socket.remoteAddr, ' exiting rudely!')); 
		socket.end();  //we end the connection when the client misbehaves
	}



};




















