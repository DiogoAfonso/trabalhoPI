
var db = require('./DbManager');
var UsrModel = require('./../models/UserModel');

module.exports.Model = UsrModel;

module.exports.Model.getOneUserWithPass = function(data, cb) {
    console.log(data);
    db.selectOne("SELECT NICKNAME, USER_PASS, USER_NAME FROM USER_COMPLAIN WHERE NICKNAME = $1 AND USER_PASS = $2",
        data,
        function(row) { console.log("row: ", row); return new UsrModel.User(row.nickname.trim(), row.user_name.trim(), undefined, undefined, row.user_pass.trim()); },
        cb
    );
};

module.exports.Model.getOneUser = function(data, cb) {
    db.selectOne("SELECT NICKNAME, USER_PASS, USER_NAME FROM USER_COMPLAIN WHERE NICKNAME = $1",
        [data],
        function(row) { return new UsrModel.User(row.nickname.trim(), row.user_name.trim(), undefined, undefined, row.user_pass.trim()); },
        cb
    );
};

module.exports.Model.retrievePassword = function(nickname, cb) {
    db.selectOne("SELECT USER_PASS, USER_EMAIL FROM USER_COMPLAIN WHERE NICKNAME = $1",
        [nickname],
        function(row) { return new UsrModel.User(undefined, undefined, row.user_email.trim(), undefined, row.user_pass.trim()); },
        cb
    );
};

module.exports.Model.registerUser = function(data, cb) {
    db.executeQuery("INSERT INTO USER_COMPLAIN (NICKNAME, USER_NAME, USER_EMAIL, USER_PASS) VALUES ($1, $2, $3, $4)",
        data,
        cb
    );
};

