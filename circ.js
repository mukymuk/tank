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

ebb = function()
{
	if( daytime )
	{
		execFile("./x200", [ ebbHz_day ] );
		log("circ, %d", ebbHz_day );
		setTimeout( flow, ebbTime_day );
	}
	else
	{
		execFile("./x200", [ ebbHz_night ] );
		log("circ, %d", ebbHz_night );
		setTimeout( flow, ebbTime_night );
	}
}

flow = function()
{
	if( daytime )
	{
		execFile("./x200", [ flowHz_day ] );
		setTimeout( ebb, flowTime_day );
		log("circ, %d", flowHz_day );
	}
	else
	{
		execFile("./x200", [ flowHz_night ] );
		setTimeout( ebb, flowTime_night );
		log("circ, %d", flowHz_night );
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
	if( daytime )
	{
		setTimeout( divert, 30 * 60 * 100 );	// 30 minutes
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

