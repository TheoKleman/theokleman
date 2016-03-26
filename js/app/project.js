var Project = function(id, link, thumbnail, title, shortTitle, client, stack, type, role) {
    this.id = id;
    this.link = link;
    this.thumbnail = thumbnail;
    this.title = title;
    this.shortTitle = shortTitle;
    this.client = client;
    this.stack = stack;
    this.type = type;
    this.role = role;

    this.domElem = $('#' + this.id);
};

Project.prototype.show = function(){
    this.domElem.stop().fadeIn();
};

Project.prototype.hide = function(){
    this.domElem.stop().fadeOut();
};
