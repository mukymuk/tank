var execFile = require('child_process').execFile;
var log = require('./log').log;

var flowTime = 20 * 1000;
var flowHz = 59.9;

var ebbTime	= 30 * 1000;
var ebbHz = 30.3;


ebb = function()
{
	log("circ, %d", ebbHz );
	execFile("./x200", [ ebbHz ] );
}

flow = function()
{
	log("circ, %d", flowHz );
	execFile("./x200", [ flowHz ] );
	setTimeout( ebb, flowTime );
}

init = function()
{
	setInterval( flow, flowTime+ebbTime );
	flow();
}

module.exports =
{
	init: init
};

