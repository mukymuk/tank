var gpio = require('./gpio');
var log = require('./log').log;


var config =
{
	general:
	{
		reason: "general alarm",
		code: 3,
		pulse: [ 200, 100 ],
		delay: 60000
	},
	close:
	{
		reason: "input closed",
		code: 1,
		pulse: [ 100, 0 ],
		delay: 0
	},
	open:
	{
		reason: "input open",
		code: 2,
		pulse: [ 100, 50 ],
		delay: 0
	}
};


var alarm = gpio.open(71);
var id;

buzz = function( config )
{
	id = setInterval( 	function() 
						{	
							if( config.count )
							{
								alarm.set(true);	
								setTimeout(	function() { alarm.set(false); }, config.pulse[0] );	
								config.count--;
							}
							else
							{
								config.count = config.code;
								clearInterval(id);
								if( config.delay )
									setTimeout( function() { buzz(config) }, config.delay );
							}
						}, config.pulse[0] + config.pulse[1] );
}

set = function( config )
{
	log( "alarm, %d, %s", config.code, config.reason );
	config.count = config.code;
	buzz( config );
}

clear = function()
{
	clearTimeout(id);
	alarm.set(false);
}

clear();

module.exports = 
{
	set: set,
	clear: clear,
	config: config
}
