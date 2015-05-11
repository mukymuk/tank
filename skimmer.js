var log = require('./log').log;
var rb = require('./rb');
var alarm = require('./alarm');
var inp = require('./in');
var periodic = require('./periodic');

var waterlevel = rb.open(1,5);

var waterLevelState;

var topoff = false;
var p = null;


topOffPump = function (periodic, onOff )
{
	if( onOff )
	{
		if( waterLevelState == false )
		{
			periodic.Stop();
			p = null;
			log("topoff, complete");
			waterlevel.set( false );
			return;
		}
	}
	log("topoff, %s", onOff ? "on" : "off" );
	if( onOff )
	{
		alarm.set( alarm.config.close );
	}
	waterlevel.set( onOff );
}

cb = function( state )
{
	//log("state=%d", state );
	waterLevelState = state;
	if( waterLevelState )
	{
		if( !p )
		{
			p = periodic.createBinary( topOffPump, 60, 120 );
			p.Start();
		}
	}
}


close = function()
{
	if( p )
	{
		p.Stop();
		log("topoff, off");
	}
	waterlevel.set(false);
}

open = function()
{
	inp.register( inp.topoff, cb, 3 );
}


module.exports = 
{
	open: open,
	close: close
}

