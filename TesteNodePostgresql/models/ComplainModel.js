
function Complain(id, title, user, tbUp, tbDw, date, descr, text, extUser, comentario, dateComment, categoryComplain, location) {
    this.id = id || -1;
    this.title = title || "";
    this.user = user || "";
    this.tbUp = tbUp || 0;
    this.tbDw = tbDw || 0;
    this.date = date || new Date();
    this.descr = descr || "";
    this.text = text || "";
    this.extUsr = extUser || "";
    this.comentario = comentario || -1;
    this.dateComment = dateComment || new Date();
    this.categoryComplain = categoryComplain || "outros";
    this.complainLocation = location || "";
}

function Category(category) {
    this.titleCategory = category || "";
}

function VoteComplain(voted) {
    this.voted = voted || "";
}

function FollowComplain(user, id) {
    this.user = user || "";
    this.id = id || -1;
}

function Location(location) {
    this.complainLocation = location || "";
}

module.exports =  { Complain: Complain,  Category: Category , VoteComplain: VoteComplain, FollowComplain: FollowComplain, Location: Location};