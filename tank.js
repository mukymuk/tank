
var log = require('./log').log;

log("tank, start");

var tod = require('./tod');
var tanklight = require('./tanklight');
var diurnalevent = require('./diurnal');
var tanklight = require('./tanklight');
var sumplight = require('./sumplight');
var topoff = require('./topoff');
var gpio = require('./gpio');


require('./sumpcirc');


var leftLampConfig = 
[
	"12:00+01:00,600",
	"13:00+02:00,750",
	"15:00+02:00,1000",
	"17:00+02:00,750",
	"19:00+01:00,600",
	"20:00-12:00,0",
];

var rightLampConfig =
[
	"14:00+01:00,600",
	"15:00+02:00,750",
	"17:00+02:00,1000",
	"19:00+02:00,750",
	"21:00+01:00,600",
	"22:00-14:00,0",
];

var centerLampConfig =
[
	"16:00+01:00,600",
	"17:00+02:00,750",
	"19:00+02:00,1000",
	"21:00+02:00,750",
	"23:00+01:00,600",
	"00:00-16:00,0"
];

var sumpLightConfig = 
[ 
	"18:00-06:00,1",
	"06:00-18:00,0"
];

var lampConfig =
[
	{ event:tanklight.open("left"), config: leftLampConfig },
	{ event:tanklight.open("right"), config: rightLampConfig },
	{ event:tanklight.open("center"), config: centerLampConfig },
	{ event:sumplight.open(), config: sumpLightConfig }
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
