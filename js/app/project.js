var Project = function(key, id, link, thumbnail, title, shortTitle, client, stack, type, role, more, current) {
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
    this.background = $('#' + this.id + ' > .project--thumbnail');
};

Project.prototype.show = function(){
    this.domElem.stop().show();
};

Project.prototype.hide = function(){
    this.domElem.stop().hide();
};
