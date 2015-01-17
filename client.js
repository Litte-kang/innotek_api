/*
Description			: use 'net'
Default value		: /
The scope of value	: /
First used			: /
*/
var net = require('net');

var counter = 0;

var tmp = 0;

/***********************************************************************
**Function Name	: SendCmdInfo
**Description	: send a cmd information to middleware.
**Parameters	: port - in.
				: MidwareIP - in.
				: CmdInfo - in.
**Return		: none.
***********************************************************************/
function SendCmdInfo(port, MidwareIP, CmdInfo)
{
	var client = new net.Socket();

	client.connect(port, MidwareIP, function(){
		
		console.log("CONNECTED:" + MidwareIP + ":" + port);

		client.write(CmdInfo);
	});

	client.on('data', function(data){
	
		try
		{
			var json = JSON.parse(data);
			
			console.log(JSON.stringify(json));
			
			switch (json.type)
			{
				case 5:
					console.log("middleware finish downloading fw!");
					break
				case 13:
					tmp = 1;
					counter++;		
					console.log("connect", counter, "th");					
					client.destroy();
					break;
				case 100:
					tmp = 2;
					client.destroy();
					break;
				default:
					client.destroy();
					break;			
			}		
		}
		catch (err)
		{
			console.log("SendCmdInfo.js:json parse error");
			client.destroy();			
		}	
	});

	client.on('close', function(){
	
		console.log("client close!",tmp);
	});
}

exports.SendCmdInfo = SendCmdInfo;



