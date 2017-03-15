var GET_VERSION_SQL = 'select version from usermarks where userid = ?';

var INC_VERSION_SQL = 'update usermarks set version=version+1 where userid=?';

var COMMON_SQL = {
    GET_VERSION_SQL: GET_VERSION_SQL,
    INC_VERSION_SQL: INC_VERSION_SQL
}


module.exports = {
    COMMON_SQL: COMMON_SQL
}