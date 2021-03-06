#!/bin/sh

# sets relay
# rb <board> <relay> < 1 | 0 >

# return relay state
# rb <board> <relay>

usage(){
	echo "Usage:  rb <1|2> <1-8> [ 1 | 0 ]"
	exit
}

BOARD=$1
RELAY=$2
STATE=$3

if [ -z "$BOARD" ] || [ -z "$RELAY" ] ; then
    usage
fi

if [ $BOARD -ne "1" ] && [ $BOARD -ne "2" ] ; then
    usage
fi

if [ $RELAY -lt "1" ] || [ $RELAY -gt "8" ] ; then
    usage
fi

if [ $BOARD -eq "1" ] ; then
    case "$RELAY" in
	"1") GPIO=47
	;;
	"2") GPIO=46
	;;
	"3") GPIO=27
	;;
	"4") GPIO=61
	;;
	"5") GPIO=86
	;;
	"6") GPIO=88
	;;
	"7") GPIO=87
	;;
	"8") GPIO=89
	;;
    esac
else
    case "$RELAY" in
	"1") GPIO=77
	;;
	"2") GPIO=76
	;;
	"3") GPIO=78
	;;
	"4") GPIO=79
	;;
	"5") GPIO=8
	;;
	"6") GPIO=11
	;;
	"7") GPIO=9
	;;
	"8") GPIO=81
	;;
    esac
fi

if [ -z "$STATE" ] ; then
    cat /sys/class/gpio/gpio${GPIO}/value
else

    if [ $STATE -ne "1" ] && [ $STATE -ne "0" ] ; then
	usage
    fi

    echo $STATE > /sys/class/gpio/gpio${GPIO}/value
fi
