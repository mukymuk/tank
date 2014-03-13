var btsp = require('bluetooth-serial-port');

function enumerate(redis_client, cb )
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
    var caRxAdvise = new Buffer([ 0x16, 0x16, 0x03, 0x01, 0x01, 0xFB, 0x16 ]);

    redisClient.get( "carx", function( err, reply ) {
        if( quit_when_done )
        {
            redisClient.quit();
        }
        if(  reply != undefined  )
        {
            var carx = JSON.parse(reply);
            if(  cb != undefined )
            {
                cb( carx );
            }
        }
    });
}

function escape_encode( byte_array )
{
    var array = new Array();
    var i;
    for( i=0;i<byte_array.length;i++ )
    {
        if(  byte_array[i] == 0x16 || byte_array[i] == 0x1B )
        {
            array.push( 0x1B );
        }
        array.push( byte_array[i] );
    }
    return array;
}

function escape_decode( unit, byte_array, messageCallback )
{
    var i;
    for(i=0;i<byte_array.length;i++)
    {
        if( unit.escaped )
        {
            unit.message.push( byte_array[i] );
            unit.escaped = false;
        }
        else
        {
            if( byte_array[i] == 0x1B )
            {
                unit.escaped = true;
            }
            else if( byte_array[i] == 0x16 )
            {
                if( unit.message.length )
                {
                    messageCallback( unit );
                    unit.message = new Array();
                    unit.escaped = false;
                }
            }
            else
            {
                unit.message.push( byte_array[i] );
            }
        }
    }
}

function OnMessageComplete( unit  )
{
    var i;
    var length = unit.message[i];
    var sum = 0;
    for(i=1;i<=length;i++)
    {
        sum += unit.message[i];
        sum &= 0xFF;
    }
    if( !sum )
    {
        switch( unit.message[1] )
        {
            case 0x02:
            {
                var ts = unit.message[3] << 8 | unit.message[2];
                console.log( unit.name + ": valve = " + unit.message[4] + ", ts = " + ts );
                break;
            }
        }
    }
}

enumerate(null, function( carx ) {
    carx.forEach( function(unit) {
        var btSerial = new (btsp).BluetoothSerialPort();
        btSerial.connect( unit.address, 1, function() {
            console.log( 'connected to ' + unit.name );
            unit.escaped = false;
            unit.message = new Array();
            btSerial.on( 'data', function( buffer ) {
                escape_decode( unit, buffer, OnMessageComplete );
            });
            btSerial.write( new Buffer([ 0x16, 0x16, 0x03, 0x01, 0x01, 0xFB, 0x16 ]), function( err, bytesWritten ) {
                if( err )
                {
                    console.log( 'write error = ' + err );
                    btSerial.close();
                }
                else
                {
                    console.log( unit.name + ' advised.' );
                }
            });
        }, function() {
             console.log( 'connection to ' + unit.name + ' failed.' );
        });
    });
});

module.exports = 
{
	enumerate:enumerate
}
