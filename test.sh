#!/bin/sh

usage(){
	echo "Usage:  test [ 1 | 0 ]"
	exit
}
STATE=$1

if [ "$STATE" != "0" ] && [ "$STATE" != "1" ] ; then
    usage
fi

set_all(){
    for RB in 1 2
    do
	for PORT in 1 2 3 4 5 6 7 8
	do
	    ./rb.sh $RB $PORT $STATE
	done
    done
}

set_all $1

if [ $STATE -eq "1" ] ; then
    ./all.sh 1100
else
    ./all.sh 0
fi

echo $STATE > /sys/class/gpio/gpio73/value
echo $STATE > /sys/class/gpio/gpio37/value
