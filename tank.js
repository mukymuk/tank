
var log = require('./log').log;

log("tank, start");

var tod = require('./tod');
var tanklight = require('./tanklight');
var diurnalevent = require('./diurnal');
var tanklight = require('./tanklight');
var sumplight = require('./sumplight');
var chaetolight = require('./chaetolight');
var topoff = require('./topoff');
var gpio = require('./gpio');


require('./sumpcirc');
var circ = require('./circ');

var rb = require('./rb');

var skimmer = rb.open(1,0);
var sumpPump = rb.open(1,1);

skimmer.set(true);
sumpPump.set(true);

var leftLampConfig = 
[
	"11:30-16:30,600",
	"16:30-17:30,750",
	"17:30-22:30,600",
	"22:30-11:30,0"
];

var rightLampConfig =
[
	"11:45-16:45,600",
	"16:45-17:45,750",
	"17:45-22:45,600",
	"22:45-11:45,0"
];

var centerLampConfig =
[
	"12:00-17:00,600",
	"17:00-18:00,750",
	"18:00-23:00,600",
	"23:00-12:00,0",
];

var sumpLightConfig = 
[ 
	"20:00-07:00,1",
	"07:00-20:00,0"
];

var cheatoLightConfig =
[
	"0:00+16:00,750",
	"16:00+8:00,0"
];

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
