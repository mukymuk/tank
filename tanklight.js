var gpio = require('./gpio');
var log = require('./log').log;


var override = true;

var left = 
{ 
	power: gpio.open(63), 
	p750: gpio.open(47),
	p1000: gpio.open(46),
	p1100: gpio.open(27)
};
var center = 
{ 
	power: gpio.open(22), 
	p750: gpio.open(35),
	p1000: gpio.open(45),
	p1100: gpio.open(44)
};
var right = 
{ 
	power: gpio.open(65), 
	p750: gpio.open(38),
	p1000: gpio.open(39),
	p1100: gpio.open(34)
};

var lamps = new Array();


open = function( light )
{
	var fan = gpio.open(61);
	var o =
	{
		set: function( state )
		{
			if( state ==  o.get() || (override == true) )
				return;
			var fanState = true;
			log( 'tanklight, %s, %d', light, state );
			l = eval(light);
			switch( state )
			{
				case 0:
				{
					l.power.set(false);
					l.p750.set(false);
					l.p1000.set(false);
					l.p1100.set(false);
					var sum = 0;
					for( var i=0;i<lamps.length;i++ )
					{
						sum += lamps[i].get();
					}
					if( !sum )
					{
						fanState = false;
					}
					break;
				}
				case 600:
				{
					l.p750.set(false);
					l.p1000.set(false);
					l.p1100.set(false);
					l.power.set(true);
					break;
				}
				case 750:
				{
					l.p1100.set(false);
					l.p1000.set(false);
					l.p750.set(true);
					l.power.set(true);
					break;
				}
				case 1000:
				{
					l.p1100.set(false);
					l.p1000.set(true);
					l.p750.set(true);
					l.power.set(true);
					break;
				}
				case 1100:
				{
					l.p1100.set(true);
					l.p1000.set(true);
					l.p750.set(true);
					l.power.set(true);
					break;
				}
			}
			if(  fanState != fan.get() )
			{
				fan.set(fanState);
				if( fanState )
					log("tanklight, fan, %s", fanState ? "on" : "off" );
			}
		},
		get: function()
		{
			l = eval(light);
			if( l.p1100.get() )
				return 1100;
			if( l.p1000.get() )
				return 1000;
			if( l.p750.get() )
				return 750;
			if( l.power.get() )
				return 600;
			return 0;
		}
	};
	lamps.push(o);
	return o;
}

module.exports =
{
	open: open
};

