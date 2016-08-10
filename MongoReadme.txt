Mongo Howto
-----------

The database used for this project is called beerdata - this is because I originally cloned it from another project.

The collection used is called pingdata.

To query:

# Use the mongo shell
mongo
# show available databases
db.adminCommand( { listDatabases: 1 } )

# Use database beerdata
use beerdata

# Show available collections
db.getCollectionNames()

# count the rows with a timestamp after 1/8/2016
db.pingdate.find({date:{$gte:"2016-08-01:T12:25:22"}}).count()

#return the rows with timestamp after 1/8/2016
db.pingdate.find({date:{$gte:"2016-08-01:T12:25:22"}})

# return rows between 2 dates
db.pingdate.find({date:{$gte:"2016-08-01:T12:25:22",$lt:"2016-08-02:23:59:59"}})

# to export the data between two dates
mongoexport --host localhost --db beerdata --collection pingdata --query '{"date":{$gte:"2016-07-20T00:00:00",$lt:"2016-08-02T23:59:59"}}' --csv --out dropped_data.csv --fields date,dropped,unreachable
