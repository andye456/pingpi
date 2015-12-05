#!/bin/bash
# Main Menu - used to set the main parameters
# 1. default gateway, i.e. the IP addres of your router
# 2. mask - usually 255.255.255.0
# 3. SSID
# 4. WPA Password
# 5. LAN address (e.g. 192.168.1.17)
# 6. LAN port, e.g. 8080
# 7. External website IP



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

# Write the properties to the props file
echo "default_gateway=$default_gateway" > $configfile
echo "mask=$mask" >> $configfile
echo "ssid=$ssid" >> $configfile
echo "password=$password" >> $configfile
echo "lanip=$lanip" >> $configfile
echo "lanport=$lanport" >> $configfile
echo "extip=$extip" >> $configfile

# Write the values to the various config locations
# restart demons if necessary, 
/etc/network/interfaces
e.g. ifdown eth01, ifup eth01 or whatever
