#!/bin/bash
# Main Menu - used to set the main parameters
# 1. system - default gateway, i.e. the IP addres of your router
# 2. system - mask - usually 255.255.255.0
# 3. system - SSID
# 4. system - WPA Password
# 5. system - LAN address (e.g. 192.168.1.17)
# 6. node.js - LAN port, e.g. 8080
# 7. node.js - External website IP


# Global variables
                                                                                                       
setInterfaces() {

# Ooo this looks rather complicated, well I can never remember stuff like this it just makes sure you can run the command as root.
# If you don't put the /dev/null bit in then it does the tee before the sudo and fails.
# Cool or what!
sudo tee /etc/network/interfaces.tmp > /dev/null << _EOF
auto lo
iface lo inet loopback
iface eth0 inet dhcp
allow-hotplug wlan0
auto wlan0
iface wlan0 inet static
wpa-ssid $4
wpa-psk $5
address $3
netmask $2
gateway $1

_EOF

} # END setInterfaces

get_user_input() {
	configfile=~/.pingpirc

	echo "..Reading Properties file.."
	if [ -r $configfile ]
	then
		source "$configfile"
	else
		echo ".pingpirc not found - will be created following this config"
	fi

	echo "------------------------------------------------"
	echo "Please enter the properties for initial setup."
	echo "These can be changed from the GUI once started"
	echo "------------------------------------------------"
	echo
	echo -n "Default gateway [$default_gateway] "
	read input
	[[ $input != "" ]] && default_gateway=$input

	echo -n "Mask            [$mask] "
	read input 
	[[ $input != "" ]] && mask=$input

	echo -n "SSID            [$ssid] "
	read input
	[[ $input != "" ]] && ssid=$input

	echo -n "WPA Password    [$password] "
	read input
	[[ $input != "" ]] && password=$input

	echo -n "LAN address     [$lanip] "
	read input
	[[ $input != "" ]] && lanip=$input

	echo -n "LAN port        [$lanport] "
	read input
	[[ $input != "" ]] && lanport=$input

	echo -n "External IP     [$extip] "
	read input
	[[ $input != "" ]] && extip=$input
	
	echo -n "Time period		 [$timeperiod]"
	read input
	[[ $input != "" ]] && timeperiod=$input
	
	
	check_ok
}

check_ok() {
	echo -n "Correct y/n or q ? "
	read input
	if [[ $input == "y" ]]
	then
		# Write the properties to the props file
		echo "default_gateway=$default_gateway" > $configfile
		echo "mask=$mask" >> $configfile
		echo "ssid=$ssid" >> $configfile
		echo "password=$password" >> $configfile
		echo "lanip=$lanip" >> $configfile
		echo "lanport=$lanport" >> $configfile
		echo "extip=$extip" >> $configfile
		echo "timeperiod=$timeperiod" >> $configfile
		# Note the call does not include timeperiod or port as these are only in node server.js
		setInterfaces $default_gateway $mask $lanip $ssid $password $timeperiod
	elif [[ $input == "n" ]]
	then
		get_user_input
	elif [[ $input == "q" ]]
	then
		:
	else
		check_ok
	fi

}

# If parameters are given then use them to set the config
# This is so it can be called from server.js when set from web page.
if [[ $# -eq 5 ]]
then
	setInterfaces $1 $2 $3 $4 $5
else
	get_user_input
fi

