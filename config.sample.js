//File:		config.sample.js
//App:		nodentd
//Arthur:	Gary Bezet <nodentd@GarysCorner.NET>
//Desciption:	Sample configuration file.  You may rename this file "config.js" and edit it to configure your server.


//this object represents all the configuration options set it with care
exports.getconfig = {  

		port: 113,  //port to listen on
		debug: false,  //toggle the debug which will set the verbosity very high

		nameproviders: [ 'use_ip_port', 'use_ip', 'use_port',  'random_fromlist' /* , 'defaultname' */ ],  //list of resolvers in a typical stack

		provider: {  //configuration options for the providers you can have configurations options for all providers, but only providers listed in "nameproviders" will be used
			
			realidentd_username: {  //options for realidentd_username this plugin provides real username by reading from realidentd_userid and /etc/password
				
				block_sysusers: true,		//do not provider usernames under 1000 because they are system users.  this can also be controlled in realidentd_userid, unless both are set to true, sysusers will no be provided	
			
			},
			
			realidentd_userid: {  //options for realidentd_userid this plugin is used even if not listed for any plugin that provides actual identity (realidentd_*)
				
				block_sysusers: true,		//do not provider userids under 1000 because they are system users.  default is true
				
			},
			
			
			defaultname: {    //options for default name provider.  The default name provider will only return the username specified bellow, and will not fail under any conditions as long as the username is set.  Default name will probably not be used in all but the dumbest identd servers
				/* username: 'DefaultUser' */
			},


			use_port: {	//options for use_port name provider, which provides usernames based on the remote port
				rules: [  //rules should be remote port/username pairs  e.g.  [6667, 'IRC_User']
				/*  //Sample rules
					[6667, 'IRC_User'],
					[25, 'EmailUser']
				*/
				]
			},

			use_ip: {	//***most commonly used*** options for use_ip name provider which provides usernames based on the remote(requester) IP 
				rules: [  //rules should be remote port/username pairs  e.g.  [6667, 'IRC_User']
				/*  //Sample rules		
					['127.0.0.1', 'LocalIPv4'], //local ipv4 address
					['::ffff:127.0.0.1', 'LocalIPv6']  //local ipv6 address
				*/
				]
			},

			use_ip_port: {  //***also common*** options for the use_ip_port name provier, which will provide a username if the remote IP addresss AND remote(requester) port match the rule provider
				rules: [ // rules should be [ 'IpAddress', Port, 'Username' ]
				/*   //Sample rules
					['::ffff:127.0.0.1', 6667, 'LocalIpV4IRC' ]
				*/
				]

			},

			random_fromlist: {  //options for the random_fromlist name provider.  The randome_fromlist name provider should always return a random name from the list.  The list should be one name to a line, with no blank lines, and lines should be \n NOT \r\n  (I'll fix that I promise)
				file: './nameproviders/commonusernames.txt'
			},
			
			
		}


};



