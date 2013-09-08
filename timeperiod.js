function TimePeriod( hours, minutes, seconds )
{
	this.seconds = 60*(hours*60+minutes)+seconds;
}
