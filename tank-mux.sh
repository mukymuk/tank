#!/bin/sh

# enable SPI access from userland


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

# GPIO2_2 - RELAY K1 -- right 750W
output 66

# GPIO2_3 - K2 -- right 1000W
output 67

# GPIO2_5 - K3 -- right 1100W
output 69

# GPIO2_4 - K4 -- center 750W
output 68

# GPIO0_23 - K5 -- center 1000W
output 23

# GPIO3_20 - K6 -- center 1100W
output 116

# GPIO2_6 - K7 -- left 750W
output 70

# GPIO2_16 - K8 -- left 1000W
output 80

# GPIO1_12 - K9 -- left 1100W
output 44

# GPIO1_18 - K10 -- right ballast power
output 50

# GPIO1_13 - K11 -- center ballast power
output 45

# GPIO1_19 - K12 -- left ballast power
output 51

# GPIO2_9 - J9 # heater
output 73

# GPIO2_7 - J8 # buzzer
output 71

###############################################################################
# RELAY BOARD 1

# GPIO1_15 - 1 
output 47

# GPIO1_14 - 2
output 46

# GPIO0_27 - 3
output 27

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


