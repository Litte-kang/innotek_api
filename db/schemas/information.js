var mongoose = require('../config');

var Schema = mongoose.Schema;

/*
 Information 自控仪信息日志

 infoType   	- 状态类型 0警报， 2一般信息
 address    	- 自控仪标识
 midAddress 	- 中间件唯一标识
 ip             - 中间件ip地址
 isBelow    	- 烤房上下棚标识 0上棚 1下棚
 createdAt      - 日志创建时间
 information    - 状态信息 int[]
*/
var schema = new Schema({
     infoType:     {type: Number, default: 0},      
     address:      String,						//自控仪地址
     midAddress:   String,						//中间件地址
     isBelow:      {type: Number, default: 0},	//上下棚标识  0标识上棚  1标识下棚， 默认为0
     createdAt:    {type: Date, default: Date.now},
     ip:           String,
     information:  [Number]
   
});

var Information = mongoose.model('Information', schema);

module.exports = Information;
