s

create = function( period, event )
{
	return function( tod )
	{
		if( period.intersect( tod ) )
		{
			event();
		}
	}
}


module.exports = 
{
	create: create
};
