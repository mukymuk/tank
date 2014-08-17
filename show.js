var tanklight = require('./tanklight');
var diurnalevent = require('./diurnal');
var sumplight = require('./sumplight');
var chaetolight = require('./chaetolight');
var topoff = require('./topoff');
var gpio = require('./gpio');
var execFile = require('child_process').execFile;
var diverter = require('./rb').open(0,4);
var rb = require('./rb');

var corx = rb.open(1,1);
var sump_pump = rb.open(1,3);

corx.set(true);
sump_pump.set(true);



var flowTime_day = 20 * 1000;
var flowHz_day = 59.9;

var ebbTime_day	= 20 * 1000;
var ebbHz_day = 40.0;



execProc = function( hz, func, time )
{
	hz = hz + hz * (Math.random()-0.5) * 0.2;	// randomize flow by +/- 10%
	hz = hz.toFixed(1);
	execFile("./x200", [ hz ] );
	time = time + time * (Math.random()-0.5) * 0.4;  // randomize time by +/- 20%
	
	setTimeout( func, time );
}

ebb = function()
{
	execProc( ebbHz_day, flow, ebbTime_day );
}

flow = function()
{
	execProc( flowHz_day, ebb, flowTime_day );
}

divert = function()
{
	if( diverter.get() )
	{
		diverter.set(0);
	}
	else
	{
		diverter.set(1);
	}
	setTimeout( divert, 55 * 1000 );	// 55 seconds
}


topoff.open();

left = tanklight.open("left");
right = tanklight.open("right");
center = tanklight.open("center");
sump = sumplight.open();
chaeto = chaetolight.open();

sump.set(1);
chaeto.set(1);
left.set(600);
right.set(600);
center.set(600);

flow();
divert();

dieWithStyle = function() 
{
	topoff.close();
	process.exit();
}

process.on( 'SIGINT', dieWithStyle);
process.on( 'SIGHUP', dieWithStyle);

