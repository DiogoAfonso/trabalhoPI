
var dbManager = require('./DbManager');
var dateFormat = require('dateformat');
var CompModel = require('./../models/ComplainModel');

module.exports.Model = CompModel;

module.exports.Model.findAllComplain = function (limit, cb) {
    dbManager.selectAllParam("SELECT ID, USER_NICK, COMPLAINUP, COMPLAINDOWN, TITLE from complain"+limit,
        undefined,
        function(row) { return new CompModel.Complain(row.id, row.title.trim(), row.user_nick.trim(), row.complainup, row.complaindown, dateFormat(row.date_criada, 'fullDate'), undefined, undefined, undefined, undefined); },
        cb
    );
};

module.exports.Model.findComplainsByUser = function (user, cb) {
    dbManager.selectAllParam("SELECT ID, USER_NICK, COMPLAINUP, COMPLAINDOWN, TITLE from complain where user_nick=$1",
        [user],
        function(row) { return new CompModel.Complain(row.id, row.title.trim(), row.user_nick.trim(), row.complainup, row.complaindown, dateFormat(row.date_criada, 'fullDate'), undefined, undefined, undefined, undefined); },
        cb
    );
};

module.exports.Model.findComplainsByLocal = function (user, cb) {
    dbManager.selectAllParam("SELECT ID, USER_NICK, COMPLAINUP, COMPLAINDOWN, TITLE from complain where LOCAL_COMP=$1",
        [user],
        function(row) { return new CompModel.Complain(row.id, row.title.trim(), row.user_nick.trim(), row.complainup, row.complaindown, dateFormat(row.date_criada, 'fullDate'), undefined, undefined, undefined, undefined); },
        cb
    );
};

module.exports.Model.findComplainsByCategory = function (user, cb) {
    dbManager.selectAllParam("SELECT ID, USER_NICK, COMPLAINUP, COMPLAINDOWN, TITLE from complain where CATEGORY_TITLE=$1",
        [user],
        function(row) { return new CompModel.Complain(row.id, row.title.trim(), row.user_nick.trim(), row.complainup, row.complaindown, dateFormat(row.date_criada, 'fullDate'), undefined, undefined, undefined, undefined); },
        cb
    );
};

module.exports.Model.getOneComplainInfo = function(id, cb) {
    dbManager.selectAllParam("SELECT  COMMENT.ID as comentario, COMPLAIN.ID, TITLE, DESCR, DATE_CRIADA, COMPLAINUP, COMPLAINDOWN,COMPLAIN.USER_NICK as userQueixoso, COMMENT.USER_NICK, COMMENT.COMMENT_TEXT, COMMENT.DATE_COMMENT " +
        "FROM COMPLAIN "+
        "INNER JOIN COMMENT ON COMPLAIN.ID=COMMENT.ID_COMPLAIN "+
        "WHERE COMPLAIN.ID = $1",
        [id],
        function(row) { return new CompModel.Complain(row.id, row.title.trim(), row.userqueixoso.trim(), row.complainup, row.complaindown, dateFormat(row.date_criada, 'fullDate'), row.descr, row.comment_text.trim(), row.user_nick.trim(), row.comentario, dateFormat(row.date_comment, 'fullDate')); },
        cb
    );
};

module.exports.Model.getCommentLastID = function(id, cb) {
    dbManager.selectAllParam("SELECT MAX(ID) FROM COMMENT WHERE ID_COMPLAIN = $1 GROUP BY ID_COMPLAIN;",
        [id],
        function(row) { return new CompModel.Complain(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,  undefined, row.max, undefined); },
        cb
    );
}

module.exports.Model.getOneComplain = function(id, cb) {
    dbManager.selectOne("SELECT COMPLAIN.ID, COMPLAIN.TITLE, COMPLAIN.descr, COMPLAIN.DATE_CRIADA, COMPLAIN.COMPLAINUP, COMPLAIN.COMPLAINDOWN, COMPLAIN.USER_NICK, COMPLAIN.CATEGORY_TITLE, COMPLAIN.LOCAL_COMP "+
                     "FROM COMPLAIN "+
                     "WHERE COMPLAIN.ID = $1",
                     [id],
                     function(row) { return new CompModel.Complain(row.id, row.title.trim(), row.user_nick.trim(), row.complainup, row.complaindown, dateFormat(row.date_criada, 'fullDate'), row.descr, undefined, undefined, undefined, undefined, row.category_title.trim(), row.local_comp.trim() ); },
                     cb
    );
};

module.exports.Model.getHomeComplains = function(cb) { //TODO refazer esta query aqui
    dbManager.selectAllParam("SELECT ID, TITLE, COMPLAINUP FROM COMPLAIN LIMIT 15",
        undefined,
        function(row) { return new CompModel.Complain(row.id, row.title.trim(), undefined, row.complainup, undefined, undefined, undefined, undefined, undefined, undefined); },
        cb
    );
};

module.exports.Model.postComment = function(data, cb) {
    dbManager.executeQuery("INSERT INTO COMMENT (USER_NICK, ID_COMPLAIN, COMMENT_TEXT) VALUES ($1, $2, $3)",
        data,
        cb
    );
};

module.exports.Model.postComplain = function(data, cb) {
    dbManager.executeQuery("INSERT INTO COMPLAIN (TITLE, USER_NICK, DESCR, CATEGORY_TITLE, LOCAL_COMP) VALUES($1, $2, $3, $4, $5) RETURNING ID",
        data,
        cb
    );
};

module.exports.Model.findAllCategorys = function(cb) {
    dbManager.selectAllParam("SELECT TITLE FROM CATEGORY",
        undefined,
        function(row) { return new CompModel.Category(row.title); },
        cb
    );
}

module.exports.Model.findAllLocations = function(cb) {
    dbManager.selectAllParam("SELECT LOCAL_COMPLAIN FROM LOCATION_COMPLAIN ",
        undefined,
        function(row) { return new CompModel.Location(row.local_complain); },
        cb
    );
}

module.exports.Model.increaseLikes = function(id, cb) {
    dbManager.executeQuery("UPDATE COMPLAIN SET COMPLAINUP = COMPLAINUP+1 WHERE ID = $1",
        [id],
        cb
    );
};

module.exports.Model.decreaseLikes = function(id, cb) {
    dbManager.executeQuery("UPDATE COMPLAIN SET COMPLAINDOWN = COMPLAINDOWN-1 WHERE ID = $1",
        [id],
        cb
    );
};

module.exports.Model.complainVote = function(params , cb) {
    dbManager.executeQuery("INSERT INTO COMPLAIN_VOTE (USER_VOTE, ID_VOTE, VOTE) VALUES ($1, $2, $3)",
        params,
        cb
    );
};

module.exports.Model.getComplainVote = function(params , cb) {
    dbManager.selectAllParam("SELECT VOTE FROM COMPLAIN_VOTE WHERE USER_VOTE = $1 AND ID_VOTE = $2",
        params,
        function(row) { return new CompModel.VoteComplain(row.vote.trim()); },
        cb
    );
};

module.exports.Model.getFollowComplain = function(params, cb) {
    dbManager.selectAllParam("SELECT USER_FOLLOW, ID_FOLLOW FROM COMPLAIN_FOLLOW WHERE USER_FOLLOW=$1 AND ID_FOLLOW = $2",
        params,
        function (row) {
            return new CompModel.FollowComplain(row.user_follow.trim(), row.id_follow);
        },
        cb
    );
};

module.exports.Model.followComplain = function(params, cb) {
  dbManager.executeQuery("INSERT INTO COMPLAIN_FOLLOW (ID_FOLLOW, USER_FOLLOW) VALUES ($1, $2)",
      params,
      cb
  );
};

module.exports.Model.viewComplain = function(params, cb) {
  dbManager.executeQuery("INSERT INTO COMPLAIN_VIEW (USER_VIEW, ID_VIEW) VALUES ($1, $2)",
      params,
      cb
  );
};