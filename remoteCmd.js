/***********************************************************************
**Function Name	: MakeConfigCurveCmd
**Description	: make a dry bulb curve,wet bulb curve,time curve.
**Parameters	: 中间件ID - in.
				: 自控仪地址 - in.
				: 干球曲线值（数组） - in.
				: 湿球曲线值（数组） - in.
				: 时间曲线值（数组） - in.
**Return		: cmd json.
***********************************************************************/
function MakeConfigCurveCmd(MidwareID, TargetID, DryBulbCurveValue, WetBulbCurveValue, TimeCurveValue)
{
	var json = 
	{
		type:12,
		address:MidwareID,
		data:[0]
	};
	var dry_obj = {DryBulbCurve:[0]};
	var wet_obj = {WetBulbCurve:[0]};
	var time_obj = {TimeCurve:[0]};

	json.data[0] = ((TargetID >> 8) & 0x00ff);
	json.data[1] = (TargetID & 0x00ff);

	dry_obj.DryBulbCurve = DryBulbCurveValue;
	wet_obj.WetBulbCurve = WetBulbCurveValue;
	time_obj.TimeCurve = TimeCurveValue;

	json.data[2] = dry_obj;
	json.data[3] = wet_obj;
	json.data[4] = time_obj;
	
	return json;
}

/***********************************************************************
**Function Name	: MakeConfigTobaSizeCmd
**Description	: make configuration the number of tobacco cmd.
**Parameters	: 中间件ID - in.
				: 自控仪地址 - in.
				: 装烟量 - in.
**Return		: cmd json.
***********************************************************************/
function MakeConfigTobaSizeCmd(MidwareID, TargetID, size)
{
	var json = 
	{
		type:13,
		address:MidwareID,
		data:[0]
	};

	json.data[0] = ((TargetID >> 8) & 0x00ff);
	json.data[1] = (TargetID & 0x00ff);

	json.data[2] = ((size >> 8) & 0x00ff);
	json.data[3] = (size & 0x00ff);

	return json;
}

/***********************************************************************
**Function Name	: MakeSearchStatusCmd
**Description	: make search status information cmd.
**Parameters	: 中间件ID - in.
				: 自控仪地址 - in.
**Return		: cmd json.
***********************************************************************/
function MakeSearchStatusCmd(MidwareID, TargetID)
{
	var json = 
	{
		type:8,
		address:MidwareID,
		data:[0]
	};

	json.data[0] = ((TargetID >> 8) & 0x00ff);
	json.data[1] = (TargetID & 0x00ff);

	json.data[2] = IsBelow;

	return json;
}

/***********************************************************************
**Function Name	: MakeFwUpdateCmd
**Description	: make fw update cmd.
**Parameters	: 中间件ID - in.
				: 自控仪地址 - in.
				: 固件大小 - in.
				: 固件版本 - in.
				: 固件类型 - in.
**Return		: cmd json.
***********************************************************************/
function MakeFwUpdateCmd(MidwareID, TargetID, FwSize, FwVersion, FwType)
{
	var json = 
	{
		type:4,
		address:MidwareID,
		data:[0]
	};
	
	json.data[0] = FwSize;
	json.data[1] = FwVersion;
	json.data[2] = FwType;

	json.data[3] = ((TargetID >> 8) & 0x00ff);
	json.data[4] = (TargetID & 0x00ff);

	return json;
}

/***********************************************************************
**Function Name	: MakeConfigCurvePhaseCmd
**Description	: make fw update cmd.
**Parameters	: 中间件ID - in.
				: 自控仪地址 - in.
				: 固件大小 - in.
				: 第几阶段 - in.
**Return		: cmd json.
***********************************************************************/
function MakeConfigCurvePhaseCmd(MidwareID, TargetID, val)
{
	var json = 
	{
		type:16,
		address:MidwareID,
		data:[0]
	};

	json.data[0] = ((TargetID >> 8) & 0x00ff);
	json.data[1] = (TargetID & 0x00ff);

	json.data[2] = val;
	json.data[3] = 0;

	return json;
}

/***********************************************************************
**Function Name	: SendCmdInfo
**Description	: send a cmd information to middleware.
**Parameters	: socket.
				: CmdInfo.
**Return		: none.
***********************************************************************/
function SendCmdInfo(socket, CmdInfo)
{
	socket.write(CmdInfo, function(){
			
			console.log("send remote cmd ok!");			
			soceket.end();
	});
}

/*
//example
var g_DryBulbCurveValue = new Array(11,22,33,44,55,66,77,88,99,0);
var g_WetBulbCurveValue = new Array(31.5,32.5,32.5,32.5,32.5,32.5,32.5,32.5,32.5,32.5);
var g_TimeCurveValue = new Array(32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,3);
var json_curve = g_MakeRemoteCmd.MakeConfigCurveCmd("0000000002", "00002", g_DryBulbCurveValue, g_WetBulbCurveValue, g_TimeCurveValue);
var json_tobacco_size = g_MakeRemoteCmd.MakeConfigTobaSizeCmd("0000000002", "00002", 123);
var json_fw_update = g_MakeRemoteCmd.MakeFwUpdateCmd("0000000002", "00002", 95644, "002", 0);
var json_search_status = g_MakeRemoteCmd.MakeSearchStatusCmd("0000000002", "00007", 1);
*/

exports.MakeConfigCurveCmd = MakeConfigCurveCmd;
exports.MakeFwUpdateCmd = MakeFwUpdateCmd;
exports.MakeSearchStatusCmd = MakeSearchStatusCmd;
exports.MakeConfigTobaSizeCmd = MakeConfigTobaSizeCmd;
exports.SendCmdInfo = SendCmdInfo;
