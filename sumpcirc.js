var rb = require('./rb');
var log = require('./log').log;

var right = rb.open(1,6);
var left = rb.open(1,7);

/*
cycle = function()
{
	if( right.get() )
	{
		log("sumpcirc, right, off");
		right.set(false);
		log("sumpcirc, left, on");
		left.set(true);
	}
	else
	{
		log("sumpcirc, left, off");
		left.set(false);
		log("sumpcirc, right, on");
		right.set(true);
	}
}
*/
	right.set(true);
	left.set(true);

//cycle();
//setInterval( cycle, 3 * 60 * 60 * 1000 );	// 3 hours

