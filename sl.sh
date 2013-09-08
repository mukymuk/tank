#!/bin/sh

# read/write sump lights

RB_QUERY=`./rb.sh 1 2 | tr -d [:cntrl:] && ./rb.sh 1 3 | tr -d [:cntrl:]`

usage(){
	echo "Usage:  sl [0 | 1]"
	exit
}

current(){
    local STATUS=$RB_QUERY
    case "$STATUS" in
    	"00") STATE=0
	;;
	"01") STATE=0
	;;
	"10") STATE=0
	;;
	"11") STATE=1
	;;
    esac
}


STATE=$1

if [ -z "$STATE" ] ; then
    current
    echo $STATE
else

    if [ $STATE -ne "1" ] && [ $STATE -ne "0" ] ; then
	usage
    fi

    ./rb.sh 1 2 $STATE
    ./rb.sh 1 3 $STATE
fi

