#!/bin/sh

usage(){
	echo "Usage:  in [0-3]"
	exit
}

INPUT=$1

if [ -z "$INPUT" ] ; then
    usage
else

    if [ $INPUT -lt "1" ] && [ $INPUT -gt "3" ] ; then
	usage
    fi

    case "$INPUT" in
    	"0") GPIO=60
	;;
	"1") GPIO=30
	;;
	"2") GPIO=31
	;;
	"3") GPIO=48
	;;
    esac
    
    cat /sys/class/gpio/gpio${GPIO}/value
fi

