var log = require('./log').log;
var rb = require('./rb');

var diverter;
var t = 0;

var series = 
[
	{
		amplitude:1,
		frequency:0.1,
		phase:0,
		offset:0
	}
];


tick = function()
{
	var i;
	var a  = 0;
	for(i=0;i<series.length;i++)
	{
		a += series[i].amplitude * Math.sin( 2.0 * Math.PI * series[i].frequency * t + series[i].phase ) + series[i].offset;
	}
	a /= i;
	log("%d, %d", t, a );
	t++;
}

init = function() 
{
	diverter = rb.open(0,4);
	setInterval( tick, 1000 );
}


init();

module.exports = 
{
	init: init
};
