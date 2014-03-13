var rb = require('./rb');
var log = require('./log').log;


open = function()
{
	var o =
	{
		pair:
		[
			rb.open(0,6),
			rb.open(0,7)
		],
		set:function( state )
		{
			if( o.get() != state )
			{
				log( "chaetolight, %d", state );
				o.pair[0].set( state );
				o.pair[1].set( state );
			}
		},
		get:function()
		{
			return o.pair[0].get() && o.pair[1].get();
		}
	};
	return o;
}

module.exports = 
{
	open:open
}
