
var config = require('./../configs/config');
var pg = require('pg');

function dbSelectAllParam(query, queryParams, createElem, cb) {
    pg.connect(config.getConnString(), function(err, client, done){
        if (err) return cb("Error fetching client from pool: "+err);
        client.query(query, queryParams, function(err, result) {
            done();
            if (err) return cb("Error running query: "+err);

            var elems = result.rows.map(createElem);
            cb (null, elems);
        });
    });
}

function dbSelectOne(query, queryParams, createElem, cb) {
    pg.connect(config.getConnString(), function(err, client, done){
        if (err) return cb("Error fetching client from pool: "+err);
        client.query(query, queryParams, function(err, result) {
            done();
            if (err) return cb("Error running query: "+err);
            if(result.rowCount == 0) return cb(null, null);

            var elem = createElem(result.rows[0]);
            cb (null, elem);
        });
    });
}

function dbExecuteQuery(query, queryParams, cb) {
    pg.connect(config.getConnString(), function(err, client, done) {
        if(err) return cb("Error fetching client from pool: " + err);
        client.query(query, queryParams, function(err, result) {
            done();
            if(err) return cb("Error running query: " + err);

            cb(null, result);
        });
    });
}

module.exports = { selectAllParam: dbSelectAllParam, selectOne : dbSelectOne, executeQuery: dbExecuteQuery }
