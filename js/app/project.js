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
    var self = this;

    // Show animation
    var tl = new TimelineMax();
    tl.to(this.domElem, .25, {
        scale: 1,
        opacity: 1,
        ease: Power2.easeOut,
        delay: 0.25,
        onStart: function(){
            self.domElem.addClass('active');
        },
    })
};

Project.prototype.hide = function(){
    var self = this;

    // Show animation
    var tl = new TimelineMax();
    tl.to(this.domElem, .25, {
        scale: 1.05,
        opacity: 0,
        ease: Power2.easeOut,
        onComplete: function(){
            self.domElem.removeClass('active');
            tl.set(self.domElem, {clearProps:"scale"});
        }
    })
};
