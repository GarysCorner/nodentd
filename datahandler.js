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

if( config.systemName === undefined) {
	config.systemName = 'UNIX'
}


exports.datareceived = function (data, socket) {

	socket.linebuff += decoder.write(data);  //add data to the linebuffer
	
	if(socket.linebuff.length > 30) {
		socket.end();
		log.log('Too much data (', socket.linebuff.length ,' bytes) received from:  ', socket.remoteAddr);
	}

	if( socket.linebuff.slice(-1) == '\n' ) { 
		
		parseline(socket);
				
	} else {
		if( Math.floor(new Date()/1000) > socket.cancelTime ) {
			socket.end();
			log.dlog('No valid line received before timeout:  ', socket.remoteAddr, '  ', socket.linebuff.length, ' bytes received.');
		}
	}
	
};


//parse line and get out the local and remote ports, or output error and end connection
function parseline(socket) {

	socket.lineRecv = true;  //set lineRecv so we can throw log even if there is no from client.  (Fix issue#1)
	socket.lineRecvTime = new Date();

	if( validcheckRegex.test(socket.linebuff) ) {
		log.dlog('Line from ', socket.remoteAddr, ' tests valid format');  //verbose

		var portsearchresults = socket.linebuff.match(pullportRegex);

		socket.portPair = [ parseInt(portsearchresults[0]), parseInt(portsearchresults[1])  ];

		log.dlog('Port-pair ', socket.portPair, ' request by ', socket.remoteAddr);  //We prent this no matter what to main log file file.
		
		if(  socket.portPair[0] > 65535 || socket.portPair[1] > 65535) {  //invalid  port return error

			log.log('Invalid ports request ', socket.portPair, ' request by ', socket.remoteAddr );

			socket.end( socket.portPair[0].toString().concat( ', ', socket.portPair[1].toString(), ' : ERROR : INVALID-PORT\r\n'));

		} else {  //port is valid lets resolve
			

			resolver.resolve(socket, sendReplyCallBack);  //call the resolver with our callback
			
		}

		
	} else {
		log.log('Invalid data from '.concat( socket.remoteAddr, ' exiting rudely!')); 
		socket.end();  //we end the connection when the client misbehaves
	}



};

function sendReplyCallBack(result, socket) {  //our callback to send the 

	var response;

	socket.lookupTime = new Date();

	if( result ) {  //return the result
		stats.nameProvided()
		response = socket.portPair[0].toString().concat( ', ', socket.portPair[1].toString(), ' : USERID : ', config.systemName, ' : ', result, '\r\n');
	} else {
		stats.nameDenied();
		response = socket.portPair[0].toString().concat(', ', socket.portPair[1], ' : ERROR : NO-USER\r\n'); 
	}

	socket.write( response, 'ascii', function() {

		if( socket.socketError === false ) {  //dont send the data if a socket error has already been record, also discard timing stats
			socket.disconnTime = new Date();		
		
			var lookupTime = socket.lookupTime - socket.lineRecvTime;
			var waitTime = socket.lineRecvTime - socket.connTime
			var totalTime = socket.disconnTime - socket.connTime;	
		
			stats.addStatTime( lookupTime, waitTime, totalTime );
			
			log.log('Response sent to: ', socket.remoteAddr, ' -> ', response.slice(0,-2), ' | waitTime=', waitTime, 'ms lookupTime=', lookupTime , 'ms, connTime=', totalTime ,'ms');	
			
		}

		socket.end();
	});

	

};


















