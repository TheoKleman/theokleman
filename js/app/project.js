var Project = function(id, title, client, technos, type, role) {
    this.id = id;
    this.title = title;
    this.client = client;
    this.technos = technos;
    this.type = type;
    this.role = role;

    this.domElem = $('#' + this.id);

    this.data = {
        "id": this.id,
        "title": this.title,
        "client": this.client,
        "technos": this.technos,
        "type": this.type,
        "role": this.role
    }
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
