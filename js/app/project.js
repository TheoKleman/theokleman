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

    this.domElem = $('#'+ this.id);
    this.background = $('#'+ this.id +' > .project--thumbnail');
    this.content = $('#'+ this.id +' > .project--content');
    this.leftBox = $('#'+ this.id +' > .project--content > .project--content--left');
    this.rightBox = $('#'+ this.id +' > .project--content > .project--content--right');
};

Project.prototype.show = function(){
    var self = this;

    // Show animations
    var tl = new TimelineMax();
    tl.to(this.domElem, .4, {
        scale: 1,
        opacity: 1,
        ease: Power2.easeOut,
        delay: 0.25,
        onStart: function(){
            self.domElem.addClass('active');
        },
    });
    tl.from(this.leftBox, .4, {
        y: -10,
        ease: Power4.easeOut,
        onComplete: function(){
            tl.set(self.leftBox, {clearProps:"y"});
        },
    }, "-=0.4");
    tl.from(this.rightBox, .4, {
        y: 10,
        ease: Power4.easeOut,
        onComplete: function(){
            tl.set(self.rightBox, {clearProps:"y"});
        },
    }, "-=0.4");
};

Project.prototype.hide = function(){
    var self = this;

    // Show animation
    var tl = new TimelineMax();
    tl.to(this.domElem, .25, {
        y: 10,
        opacity: 0,
        ease: Power2.easeOut,
        onComplete: function(){
            self.domElem.removeClass('active');
            tl.set(self.domElem, {clearProps:"y"});
        }
    })
    tl.to(this.content, .25, {
        scale: .95,
        ease: Power2.easeOut,
        onComplete: function(){
            tl.set(self.content, {clearProps:"scale"});
        },
    }, "-=0.25");
};
