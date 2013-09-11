var log = require('./log').log;
var rb = require('./rb');
var alarm = require('./alarm');
var inp = require('./in');
var periodic = require('./periodic');

var waterlevel = rb.open(1,2);


var topoff = false;
var p = null;


topOffPump = function (periodic, onOff )
{
	log("topoff, %s", onOff ? "on", "off" );
	alarm.set( alarm.config.close );
	waterlevel.set( onOff );
}

cb = function( state )
{
	log("state=%d", state );
	if( state )
	{
		if( !p )
		{
			p = periodic.createBinary( topOffPump, 3, 7 );
		}
	}
	else
	{
		if( !p )
		{
		}
	}
}


close = function()
{
	p.Stop();
	log("topoff, off");
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
