#!/bin/sh

dtc -O dtb -o BB-SPI1-01-00A0.dtbo -b 0 -@ BB-SPI1-01-00A0.dts
mv BB-SPI1-01-00A0.dtbo /lib/firmware
echo BB-SPI1-01 > /sys/devices/bone_capemgr.*/slots

