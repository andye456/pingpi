# pingpi

Logs pings and other network stats to a MEAN stack<br>
MEAN stack running on RPi<br>
RPi has been running unassisted for over a year<br>
Totally autonomous yay!<br>
Sporned from the beerpi project.<br>
Uses the same framework and Angular front end.<br>
<br>
# Best Practices<br>
Get a Raspberry Pi + new 8G memory card (RPi v3 is best (quickest), but the Mongo implementation is only 32 bit so any old RPi will do) (Also the implementation of Mongo on the RPi can only address a 4G database)
Put the Pi on your network and mount it on your system or ssh to it - assume you're using Linux
git clone https://github.com/andye456/pingpi.git<br>
cd pingpi<br>
npm install<br>
sudo nodemon server.js<br>
<br>


