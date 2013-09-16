#!/bin/sh

# read/write main light array

FAN_SCRIPT="./rb.sh 1 4"

usage(){
	echo "Usage:  tl <l|c|r> [ 0 | 600 | 750 | 1000 | 1100 ]"
	exit
}

fan()
{
    if [ $(cat /sys/class/gpio/gpio51/value) -eq "0" ] && [ $(cat /sys/class/gpio/gpio45/value) -eq "0" ] && [ $(cat /sys/class/gpio/gpio50/value) -eq "0" ]; then
	sh ${FAN_SCRIPT} 0
	echo "fan off."
    else
	sh ${FAN_SCRIPT} 1
    fi
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
    "l") GPIO_POWER=51 
	 GPIO_750=70
	 GPIO_1000=80
	 GPIO_1100=44
    ;;
    "c") GPIO_POWER=45 
	 GPIO_750=68
	 GPIO_1000=23
	 GPIO_1100=116
    ;;
    "r") GPIO_POWER=50
	 GPIO_750=66
	 GPIO_1000=67
	 GPIO_1100=69
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
	;;
	"600") 	echo 0 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
	;;
	"750")  echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 0 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
	;;
	"1000") echo 0 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
	;;
	"1100") echo 1 > /sys/class/gpio/gpio${GPIO_1100}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_1000}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_750}/value
		echo 1 > /sys/class/gpio/gpio${GPIO_POWER}/value
	;;
    esac
    fan
    if [ "$POWER" != "$STATE" ] ; then
    	echo Lamp \'$BALLAST\' power changed from $POWER to $STATE at `date +%r`
    fi
fi
