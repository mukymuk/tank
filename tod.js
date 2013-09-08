var util = require('util');
sprintf = require('sprintf').sprintf;

function diurnalModulo( seconds )
{
	return seconds % 86400;
}

function create( hours, minutes, seconds )
{
	if( hours instanceof Date )
	{
		date = hours;
		hours = date.getHours();
		minutes = date.getMinutes();
		seconds = date.getSeconds();
	}
	else if( typeof hours === "string" )
	{
		a = hours.split(':');
		if( a.length > 2 )
			seconds = parseInt( a[2] );
		else
			seconds = 0;
		if(  a.length > 1 )
			minutes = parseInt( a[1] );
		else
			minutes = 0;
		hours = parseInt( a[0] );
	}
	else
	{
		if( seconds === undefined )
			seconds = 0;
		if( minutes === undefined )
			minutes = 0;
	}
	return diurnalModulo(60*(hours*60+minutes)+seconds);
}

toString = function( seconds)
{
	var t = seconds;

	hours = Math.floor(seconds/3600);
	t= t-(hours*3600);
	minutes = Math.floor(t/60);
	t=t-(minutes*60);
	seconds = t;
	return sprintf( "%.2d:%.2d:%.2d", hours, minutes, seconds );
}

intersect = function( o, tod )
{
	//console.log( "tod=" + tod.toString() + ", begin=" + o.begin + ", end=" + o.end );
	if( o.begin > o.end )
	{
		if(  (tod >= o.begin) || (tod < o.end) )
			return true;
	}
	else
	{
		if( tod >= o.begin && tod < o.end  )
			return true;
	}
	return false;
}

function period( tp )
{
	if( range = tp.split('-'), range.length == 2 )
	{
		_begin = create( range[0] );
		_end = create( range[1] );
	}
	else if( delta = tp.split('+'), delta.length == 2 )
	{
		_begin = create( delta[0] );
		_end = diurnalModulo( _begin + create( delta[1] ) );
	}
	//console.log( "period begin= " + _begin + ", end=" + _end );
	var o = 
	{ 
		begin:_begin,
		end:_end,
		intersect:function(tod)
		{
			return intersect(o,tod);
		},
		toString:toString 
	};
	return o;
}

module.exports = 
{
	create: create,
	period: period,
	toString:toString
};

