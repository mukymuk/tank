#!/bin/sh

while :
do
    echo 1 > /sys/class/gpio/gpio73/value
    sleep 1
    echo 0 > /sys/class/gpio/gpio73/value
done
