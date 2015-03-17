
var userConfig = require('./UserConn');

var configs = {
    "development" : {
        getConnString : function() {
            return "postgres://"+userConfig["username"]+":"+userConfig["password"]+"@localhost/"+userConfig["BDname"];
        }
    }
}

var config = configs[process.env.NODE_ENV] || configs["development"];

module.exports = config;