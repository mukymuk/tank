var execFile = require('child_process').execFile;
var log = require('./log').log;
var daytime = require('./tanklight').daytime;
var diverter = require('./rb').open(0,4);

var flowTime_day = 20 * 1000;
var flowHz_day = 48.0;

var ebbTime_day	= 40 * 1000;
var ebbHz_day = 33.3;

var flowTime_night = 30 * 1000;
var flowHz_night = 36.0;

var ebbTime_night = 5 * 60 * 1000;
var ebbHz_night = 28.0;

execProc = function( hz, func, time )
{
	hz = hz + hz * (Math.random()-0.5) * 0.2;	// randomize flow by +/- 10%
	hz = hz.toFixed(1);
	execFile("./x200", [ hz ] );
	log("circ, %d, %d", hz, time / 1000 );
	setTimeout( func, time );
}

ebb = function()
{
	if( daytime() )
	{
		execProc( ebbHz_day, flow, ebbTime_day );
	}
	else
	{
		execProc( ebbHz_night, flow, ebbTime_night );
	}
}

flow = function()
{
	if( daytime() )
	{
		execProc( flowHz_day, ebb, flowHz_day );
	}
	else
	{
		execProc( flowHz_night, ebb, flowHz_night );
	}
}

divert = function()
{
	if( diverter.get() )
	{
		diverter.set(0);
		log("diverter, off" );
	}
	else
	{
		diverter.set(1);
		log("diverter, on" );
	}
	if( daytime() )
	{
		setTimeout( divert, 30 * 60 * 1000 );	// 30 minutes
	}
	else
	{
		setTimeout( divert, 3 * 60 * 60 * 1000 );	// 3 hours
	}
}

init = function()
{
	flow();
	divert();
}

module.exports =
{
	init: init
};

