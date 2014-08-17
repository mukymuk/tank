#!/bin/sh

logger build_dt:  configuring bone_capemgr
echo build_dt: configuring bone_capemgr

dtc -O dtb -o TANK-00A0.dtbo -b 0 -@ TANK-00A0.dts
cp TANK-00A0.dtbo /lib/firmware
echo TANK > /sys/devices/bone_capemgr.9/slots
