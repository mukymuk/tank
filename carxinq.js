var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
var async = require("async");

function inquire( redis_client, cb )
{
	var quit_when_done;
	if( redis_client == null )
	{
		redisClient = require("redis").createClient();
		quit_when_done = true;
	}
	else
	{
		quit_when_done = false;
		redisClient = redis_client;
	}
	array = new Array();
	btSerial.on('found', function( addr, name ) {
		var hashtag_ndx = name.indexOf('CaRx-1 #');
		if( hashtag_ndx == 0 )
		{
			var ndx = name.substring( 8, name.length );
			//console.log( "ndx " + ndx + ", address " + addr );
			array.push( { name: ndx, address : addr } );
		}
	});

	btSerial.inquire();
	var multi = redisClient.multi();

	redisClient.smembers( "carx", function( err, reply ) 
	{ 
		if( reply != undefined )
		{
			multi.del( "carx:" + reply ) 
		}
	});
	multi.del("carx");
	async.map( array, function(item,callback) {
		redisClient.get( "carx:name:" + item.name, function(err, reply) { 
			if( reply == undefined )
			{
				reply = item.name;
			}
			return callback( null, { name: reply, address: item.address } );
		});
	}, function( err, results ) {
		 multi.set( "carx", JSON.stringify(results) );
		 multi.exec( function( err, replys ) { 
			 if( quit_when_done )
			 {
				 redisClient.quit();
			 }
			 if( cb == undefined )
			 {
				 console.log( JSON.stringify(results) );
			 }
			 else
			 {
				 cb();
			 }
		 });
	});
}

inquire();

module.exports = 
{
	inquire:inquire
}
