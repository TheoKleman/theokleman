var Project = function(id, link, thumbnail, title, shortTitle, client, technos, type, role) {
    this.id = id;
    this.link = link;
    this.thumbnail = thumbnail;
    this.title = title;
    this.shortTitle = shortTitle;
    this.client = client;
    this.technos = technos;
    this.type = type;
    this.role = role;

    this.domElem = $('#' + this.id);
};

Project.prototype.show = function() {
    this.bind();

    var self = this;

    this.domElem.fadeIn(function(){
        self.onAnimateIn();
    });
};

Project.prototype.hide = function() {
    var self = this;

    this.domElem.fadeOut(function(){
        self.onAnimateOut();
    });
};


Project.prototype.bind = function() {
    
};

Project.prototype.onAnimateIn = function() {
    
};

Project.prototype.onAnimateOut = function() {
    
};
