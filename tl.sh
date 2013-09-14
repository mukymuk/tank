#!/bin/sh

# read/write main light array

FAN_SCRIPT="./rb.sh 1 4"

usage(){
	echo "Usage:  tl <l|c|r> [ 0 | 600 | 750 | 1000 | 1100 ]"
	exit
}

current(){
    if [ $(cat /sys/class/gpio/gpio${GPIO_POWER}/value) -eq "0" ]; then
    	POWER=0
    elif [ $(cat /sys/class/gpio/gpio${GPIO_750}/value) -eq "0" ]; then
	POWER=600
    elif [ $(cat /sys/class/gpio/gpio${GPIO_1000}/value) -eq "0" ]; then
	POWER=750
    elif [ $(cat /sys/class/gpio/gpio${GPIO_1100}/value) -eq "0" ]; then
	POWER=1000
    else
    	POWER=1100
    fi
}

BALLAST=$1
STATE=$2

if [ -z "$BALLAST" ] ; then
    usage
fi

if [ $BALLAST != "l" ] && [ $BALLAST != "c" ] && [ $BALLAST != "r" ]; then
    usage
fi

case "$BALLAST" in
    "l") GPIO_POWER=63 
	 GPIO_750=110
	 GPIO_1000=80
	 GPIO_1100=111
    ;;
    "c") GPIO_POWER=115 
	 GPIO_750=35
	 GPIO_1000=45
	 GPIO_1100=44
    ;;
    "r") GPIO_POWER=113
	 GPIO_750=38
	 GPIO_1000=39
	 GPIO_1100=34
    ;;
esac

current

if [ -z "$STATE" ] ; then
    echo $POWER
else
    if [ $STATE != "0" ] && [ $STATE != "600" ] && [ $STATE != "750" ] && [ $STATE != "1000" ] && [ $STATE != "1100" ]; then
	usage
    fi
    case "$STATE" in
	"0") 	echo 0 > /sys/class/gpio/gpio${GPIO_POWER}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_750}/value
		sh ${FAN_SCRIPT} 0
	;;
	"600") 	echo 0 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
		sh ${FAN_SCRIPT} 1
	;;
	"750")  echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
		sh ${FAN_SCRIPT} 1
	;;
	"1000") echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
		sh ${FAN_SCRIPT} 1
	;;
	"1100") echo 1 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
		sh ${FAN_SCRIPT} 1
	;;
    esac
    if [ "$POWER" != "$STATE" ] ; then
    	echo Lamp \'$BALLAST\' power changed from $POWER to $STATE at `date +%r`
    fi
fi
