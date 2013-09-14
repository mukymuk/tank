#!/bin/sh

# enable SPI access from userland
echo TANK > /sys/devices/bone_capemgr.*/slots

output ()
{
    # output <gpio_number>
    echo $1 > /sys/class/gpio/export
    echo out > /sys/class/gpio/gpio$1/direction
}

input ()
{
    # output <gpio_number>, <edge>
    echo $1 > /sys/class/gpio/export
    echo $2 > /sys/class/gpio/gpio$1/edge
    echo in > /sys/class/gpio/gpio$1/direction
}

###############################################################################
# BALLAST RELAY BOARD

# GPIO1_6 - RELAY K1 -- right 750W
output 38

# GPIO1_7 - K2 -- right 1000W
output 39

# GPIO1_2 - K3 -- right 1100W
output 34

# GPIO1_3 - K4 -- center 750W
output 35

# GPIO1_13 - K5 -- center 1000W
output 45

# GPIO1_12 - K6 -- center 1100W
output 44

# GPIO3_14 - K7 -- left 750W
output 110

# GPIO2_16 - K8 -- left 1000W
output 80

# GPIO3_15 - K9 -- left 1100W
output 111

# GPIO3_17 - K10 -- right ballast power
output 113

# GPIO3_19 - K11 -- center ballast power
output 115

# GPIO3_21 - K12 -- left ballast power
output 117

# GPIO2_9 - J9 # heater
output 73

# GPIO1_5 - J8 # buzzer
output 37

###############################################################################
# RELAY BOARD 1

# GPIO1_4 - 1 
output 36

# GPIO1_1 - 2
output 33

# GPIO1_0 - 3
output 32

# GPIO1_29 - 4
output 61

# GPIO2_22 - 5
output 86

# GPIO2_24 - 6
output 88

# GPIO2_23 - 7
output 87

# GPIO2_25 - 8
output 89

###############################################################################
# RELAY BOARD 2

# GPIO2_13 - 1
output 77

# GPIO2_12 - 2
output 76

# GPIO2_14 - 3
output 78

# GPIO2_15 - 4
output 79

# GPIO0_8 - 5
output 8

# GPIO0_11 - 6
output 11

# GPIO0_9 - 7
output 9

# GPIO2_17 - 8
output 81

###############################################################################
# ADS1248

# GPIO3_19 - START
output 115

# GPIO3_21 - DRDY
input 117 falling

# GPIO1_17 - RESET
output 49

###############################################################################
# contact closure inputs

# GPIO1_28 - IN1 (left most below 244 chip)
input 60 both

# GPIO0_30 - IN2 
input 30 both

# GPIO0_31 - IN3
input 31 both

# GPIO1_16 - IN4
input 48 both


