
var log = require('./log').log;

log("tank, start");

var tod = require('./tod');
var tanklight = require('./tanklight');
var diurnalevent = require('./diurnal');
var sumplight = require('./sumplight');
var chaetolight = require('./chaetolight');
var topoff = require('./topoff');
var gpio = require('./gpio');


require('./sumpcirc');
var circ = require('./circ');

var rb = require('./rb');

var unused = rb.open(1,0);	
var corx = rb.open(1,1);
//var bo1 = rb.open(1,2); top off control in topoff.
var sump_pump = rb.open(1,3);

corx.set(true);
sump_pump.set(true);


var leftLampConfig = 
[
	"11:30-11:33,1000",
	"11:33-12:30,600",
	"12:30-16:30,750",
	"16:30-17:30,1000",
	"17:30-18:30,750",
	"18:30-22:30,600",
	"22:30-11:30,0"
];

var rightLampConfig =
[
	"11:45-11:48,1000",
	"11:48-12:45,600",
	"12:45-16:45,750",
	"16:45-17:45,1000",
	"17:45-18:45,750",
	"18:45-22:45,600",
	"22:45-11:45,0"
];

var centerLampConfig =
[
	"12:00-12:03,1000",
	"12:03-13:00,600",
	"13:00-17:00,750",
	"17:00-18:00,1000",
	"18:00-19:00,750",
	"19:00-23:00,600",
	"23:00-12:00,0",
];

var sumpLightConfig = 
[ 
	"20:00-08:00,1",
	"08:00-20:00,0"
];

var cheatoLightConfig =
[
	"22:00-14:00,1",
 	"14:00-22:00,0"
];
/*

var leftLampConfig = 
[
	"11:30-22:30,600",
	"22:30-11:30,600"
];

var rightLampConfig =
[
	"11:30-22:30,600",
	"22:30-11:30,600"
];

var centerLampConfig =
[
	"11:30-22:30,600",
	"22:30-11:30,600"
];

var sumpLightConfig = 
[ 
	"20:00-08:00,1",
	"08:00-20:00,1"
];

var cheatoLightConfig =
[
	"22:00-14:00,1",
 	"14:00-22:00,1"
];
*/
var lampConfig =
[
	{ event:tanklight.open("left"), config: leftLampConfig },
	{ event:tanklight.open("right"), config: rightLampConfig },
	{ event:tanklight.open("center"), config: centerLampConfig },
	{ event:sumplight.open(), config: sumpLightConfig },
	{ event:chaetolight.open(), config: cheatoLightConfig }
];


var diurnalSchedule = new Array();

function event( context, power )
{
	return function() { context.set(power) };
}

var lamps = lampConfig.length;

for( var j=0;j<lamps;j++ )
{
	var length = lampConfig[j].config.length;
	for( var i=0;i<length;i++)
	{
		a = lampConfig[j].config[i].split(',');
		period = a[0];
		power = parseInt( a[1] );
		diurnalSchedule.push( diurnalevent.create( tod.period(period), event( lampConfig[j].event, power) ) );
	}
}

schedule = function()
{
	var now = tod.create( new Date() );
	var length = diurnalSchedule.length;
	for( var i=0;i<length;i++)
	{
		diurnalSchedule[i]( now );
	}
	setTimeout( schedule, 60000);
}

circ.init();
topoff.open();

schedule();


dieWithStyle = function() 
{
	topoff.close();
	process.exit();
}

process.on( 'SIGINT', dieWithStyle);
process.on( 'SIGHUP', dieWithStyle);

/*
length = diurnalSchedule.length;

for( t = 0; t < 86400; t+=60 )
{
	var now = tod.create( 0, 0, t );
	console.log( tod.toString(now) );
	for( var i=0;i<length;i++)
	{
		diurnalSchedule[i]( now );
	}
}

*/
