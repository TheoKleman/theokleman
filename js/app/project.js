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
    this.cta = $('#'+ this.id +' > .project--content > .project--content--left a.launch');
    this.rightBox = $('#'+ this.id +' > .project--content > .project--content--right');
    this.labels = $('#'+ this.id +' > .project--content > .project--content--right > .misc >.content');
};

Project.prototype.show = function(){
    var self = this;

    // Show animations
    var tl = new TimelineMax();
    tl.to(this.domElem, .4, {
        scale: 1,
        opacity: 1,
        ease: Power2.easeInOut,
        delay: .25,
        onStart: function(){
            self.domElem.addClass('active');
        },
    });
    tl.from(this.leftBox, .4, {
        y: -10,
        ease: Power4.easeInOut,
        onComplete: function(){
            tl.set(self.leftBox, {clearProps:"y"});
        },
    }, "-=0.4");
    tl.from(this.rightBox, .4, {
        y: 10,
        ease: Power2.easeInOut,
        onComplete: function(){
            tl.set(self.rightBox, {clearProps:"y"});
        },
    }, "-=0.4");
    tl.staggerFrom(
        [this.labels[0],this.labels[1],this.labels[2],this.labels[3]], .4, {
        opacity: 0,
        ease: Power2.easeInOut,
        onComplete: function(){
            tl.set(self.labels, {clearProps:"opacity"});
        },
    }, .03, "-=0.3");
    tl.from(this.cta, .4, {
        opacity: 0,
        ease: Power2.easeInOut,
        onComplete: function(){
            tl.set(self.cta, {clearProps:"opacity"});
        },
    }, "-=0.3");
};

Project.prototype.hide = function(){
    var self = this;

    // Show animation
    var tl = new TimelineMax();
    tl.to(this.domElem, .35, {
        y: "+=10",
        opacity: 0,
        ease: Power2.easeInOut,
        onComplete: function(){
            self.domElem.removeClass('active');
            tl.set(self.domElem, {clearProps:"y"});
        }
    })
    tl.to(this.content, .35, {
        scale: .97,
        ease: Power2.easeInOut,
        onComplete: function(){
            tl.set(self.content, {clearProps:"scale"});
        },
    }, "-=0.35");
};
