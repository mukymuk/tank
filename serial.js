SerialPort  = require('serialport').SerialPort;


function SerialPort_OnOpen()
{
	sp.on( 'data', SerialPort_OnData );
	console.log( 'open' );
}

function SerialPort_OnData()
{
	console.log( 'data' );
}


var sp = new SerialPort( "/dev/rfcomm0", { baudRate: 115200, dataBits: 8, parity: 'none', stopBits: 1, flowControl: false }, false );

sp.open( SerialPort_OnOpen );




