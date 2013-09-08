var gpio = require('./gpio');
var log = require('./log').log;
var alarm = require('./alarm');

var input =
[
	gpio.open(60), gpio.open(30), gpio.open(31), gpio.open(48)
];

var targets = new Array();

checkInput = function()
{
	var length = targets.length;
	for( var i=0;i<length;i++)
	{
		var o = targets[i];
		var current = o.gpio.get();
		//log( "%d: %d", i, current );
		if( current != o.last )
		{
			o.debounce_count = o.debounce;
			o.last = current;
		}
		else
		{
			if( o.debounce_count )
			{
				if( !--o.debounce_count)
				{
					o.callback(current);
				}
			}
		}
	}
}

register = function( in_ndx, callback, debounce )
{
	var o =
	{
		gpio: input[in_ndx],
		callback: callback,
		debounce: debounce,
		debounce_count: debounce,
		last: input[in_ndx].get()
	};
	targets.push( o );
	return o;
}

unregister = function( o )
{
}

setInterval( checkInput, 1000 );

module.exports = 
{
	register:register,
	unregister:unregister
}
