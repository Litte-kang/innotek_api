/*
Description			: use 'net'
Default value		: /
The scope of value	: /
First used			: /
*/
var net = require('net');

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
	var client_socket = new net.Socket();

	client_socket.connect(port, MidwareIP, function(){
		
		console.log("CONNECTED:" + MidwareIP + ":" + port);

		client_socket.write(CmdInfo, function(){
			
			try
			{
				var cmd_info = JSON.parse(CmdInfo);

				console.log("send " + cmd_info.type + " cmd info ok!");
			}
			catch (err)
			{
				console.log("EEROR: json parse error!");
			}
			
			client_socket.destroy();
		});
	});

	client_socket.on('error', function(err){
		
		console.log("ERROR:",err.errno);

		client_socket.destroy();
	});

	client_socket.on('close', function(){
	
		console.log("client close!");
	});
}

exports.SendCmdInfo = SendCmdInfo;