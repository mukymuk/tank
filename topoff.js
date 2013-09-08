var rb = require('./rb');
var inp = require('./in');
var log = require('./log').log;
var alarm = require('./alarm');

var waterlevel = rb.open(1,2);

var onPeriod = 60 * 1000;
var offPeriod = 60 * 1000;

var interval = null;
var done = false;
var topoff = false;


off = function()
{
	log("topoff, off");
	waterlevel.set(false); 
	if( topoff == false )
	{
		clearInterval( interval );
		interval = null;
	}
}

modulate = function()
{
	alarm.set( alarm.config.close );
	log("topoff, on");
	waterlevel.set(true);
	setTimeout( off, onPeriod );
}

cb = function( state )
{
	log(" state = %d", state );
	if( state )
	{
		topoff = true;
		if(  interval == null  )
		{
			modulate();
			interval = setInterval( modulate, onPeriod+offPeriod);
		}
	}
	else
		topoff = false;
}

inp.register( inp.topoff, cb, 3 );

exports.close = function()
{
	clearInterval( interval );
	log("topoff, off");
	waterlevel.set(false);
}


