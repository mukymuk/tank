var log = require('./log').log;

dispatch = function( o, ndx )
{
	var i = o.array[ndx];
	var period = i.period;
	var l = o.array.length;
	i.func( o, i.arg );
	ndx++;
	if( ndx >= l)
	{
		this.timeout = null;
	}
	else
	{
		this.timeout = setTimeout( function() { dispatch(o,ndx); }, period * 1000 );
	}
}

Periodic.prototype.Stop = function()
{
	if( this.interval )
	{
		clearInterval( this.interval );
		this.interval = null;
	}
	if( this.timeout )
	{
		clearTimeout( this.timeout );
		this.timeout = null;
	}
}

Periodic.prototype.Start = function()
{
	var i, l = this.array.length;
	var totalPeriod = 0;
	for(i=0;i<l;i++)
		totalPeriod += this.array[i].period;
	this.Stop();
	this.interval = setInterval( function(o) { dispatch(o,0); }, totalPeriod * 1000, this );
	dispatch( this, 0 );
}

// [ { period:period, func:function(arg){}, arg:arg }, ... ]
// func, onPeriod, offPeriod

function Periodic()
{
	this.array = null;
	this.interval = null;
	this.timeout = null;
}

both = function( periodic, arg )
{
	if( arg )
	{
		on();
	}
	else
	{
		off();
		periodic.Stop();
	}
}
on = function()
{
	log("on");
}

off = function()
{
	log("off");
}

createFromArray = function( array )
{
	var periodic = new Periodic();
	periodic.array = array;
	return periodic;
}

createBinary = function( func, onPeriod, offPeriod )
{
	var periodic = new Periodic();
	periodic.array = [ { period:onPeriod, func:func, arg:true }, { period:offPeriod, func:func, arg:false } ];
	return periodic;
}

var p = createBinary( both, 3, 6 );

p.Start();

module.exports =
{
	createBinary: createBinary,
	createFromArray: createFromArray
}
