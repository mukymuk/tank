var util = require('util');
var tod = require('./tod');

exports.log = function()
{
	var now = tod.create( new Date() );
	util.print( tod.toString(now) + ", " );
	util.print( util.format.apply( this, arguments ) );
	util.print( "\n" );
}
