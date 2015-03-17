
function User (nickname, user_name, email, type, userpass) {
    this.name = nickname || "default";
    this.user_name = user_name || "User-default";
    this.email = email || "";
    this.usertype = type || 'authenticated';
    this.password = userpass || "";
    this.logged = false;
}

module.exports = { User: User };