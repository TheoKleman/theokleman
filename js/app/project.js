var Project = function(key, id, link, thumbnail, title, shortTitle, client, stack, type, role, more) {
    this.key = key;
    this.id = id;
    this.link = link;
    this.thumbnail = thumbnail;
    this.title = title;
    this.shortTitle = shortTitle;
    this.client = client;
    this.type = type;
    this.role = role;
    this.stack = stack;
    this.more = more;

    this.domElem = $('#' + this.id);
};

Project.prototype.show = function(){
    this.domElem.stop().fadeIn();
};

Project.prototype.hide = function(){
    this.domElem.stop().fadeOut();
};
