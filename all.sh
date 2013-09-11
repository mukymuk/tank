#!/bin/sh

usage(){
	echo "Usage:  all [ 0 | 600 | 750 | 1000 | 1100 ]"
	exit
}
STATE=$1

if [ -z "$STATE" ] ; then
    usage
fi
if [ $STATE != "0" ] && [ $STATE != "600" ] && [ $STATE != "750" ] && [ $STATE != "1000" ] && [ $STATE != "1100" ]; then
   usage
fi

./tl.sh c $STATE
./tl.sh l $STATE
./tl.sh r $STATE


