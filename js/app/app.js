var App = function(){
    this.projects = [];
    this.previousItem = null;
    this.currentItem = null;
    this.nextItem = null;

    this.sliderTemplateHbs = null;
    this.templateSliderData = null;

    this.controlsTemplateHbs = null;
    this.templateControlsData = null;

    // Templates DOM Elems
    this.sliderElem = $('section#slider');
    this.controlsElem = $('nav#controls');
    this.aboutElem = $('section#about');

    // CTA DOM Elems
    this.controlSelector = null;
    this.controlNextBtn = null;
    this.controlPreviousBtn = null;
    this.aboutCta = $('.cta-about');
    this.aboutCtaLabel = $('.cta-about > .label > span');

    // Others DOM Elems
    this.timerBar = null;

    // Tweens
    this.timerTimeLine = null;

    // Others
    this.disableControls = false;
};

App.prototype.init = function(){

    var self = this;

    // Get slider template
    $.get('templates/slider.hbs', function(data){
        self.sliderTemplateHbs = data;
        self.templateSliderData = Handlebars.compile(self.sliderTemplateHbs);
    });

    // Get controls template
    $.get('templates/controls.hbs', function(data){
        self.controlsTemplateHbs = data;
        self.templateControlsData = Handlebars.compile(self.controlsTemplateHbs);
    });

    // Get projects and template them
    $.getJSON('json/projects.json', function(data){
        // Create slider projects items
        var projects = data;
        self.sliderElem.html(app.templateSliderData(projects));

        var entry = data.projects;
        for (var i = 0; i < entry.length; i++){
            var key = entry[i].key;
            var id = entry[i].id;
            var link = entry[i].link;
            var thumbnail = entry[i].thumbnail;
            var title = entry[i].title;
            var shortTitle = entry[i].shortTitle;
            var client = entry[i].client;
            var type = entry[i].type;
            var role = entry[i].role;
            var stack = entry[i].stack;
            var more = entry[i].more;

            // Create projects objects
            self.projects[i] = new Project(key, id, link, thumbnail, title, shortTitle, client, type, role, stack, more);
        }

        // Init slider
        self.slider();
    });
};

App.prototype.slider = function(){
    // Create controls panel in DOM
    this.controlsElem.html(app.templateControlsData(app));

    // Init controls
    this.bind();

    // Set each project section position 
    this.projects[0].show();
    this.setCurrentItem(this.projects[0]);

    // Init sequence between items
    this.timer();
    this.timerTimeLine.pause();
};

App.prototype.bind = function() {
    // Bind controls
    this.controlSelector = $('.slider-controls > .selectors > ul > li');
    this.controlNextBtn = $('.next-project');
    this.controlPreviousBtn = $('.previous-project');
    this.controlsNextInner = $('.next-project .text-inner');
    this.controlsPreviousInner = $('.previous-project .text-inner');
    this.bindNavItem();
    this.bindNextItem();
    this.bindPreviousItem();
    this.bindAboutCta();

    // On keydown
    $(window).on('keydown', $.proxy(this.onKeydown, this));
    // On scroll
    $(document).on('mousewheel', $.proxy(this.onMousewheel, this));

    // Bind other elems 
    this.timerBar = $('.slider-loader > span');
};

App.prototype.bindAboutCta = function() {
    var self = this;

    this.aboutCta.on('click',function(){
        if (self.aboutElem.hasClass('active')) {
            // Animate out
            var tl = new TimelineMax();
            tl.to(self.aboutElem, .4, {
                opacity: 0,
                ease: Power2.easeInOut,
                onComplete: function(){
                    self.aboutElem.removeClass('active');
                    self.disableControls = false;
                    self.aboutCtaLabel.text('About');
                },
            });
        } else {
            var socials = $('section#about nav.socials a');
            // Animate in
            var tl = new TimelineMax();
            tl.to(self.aboutElem, .4, {
                opacity: 1,
                ease: Power2.easeInOut,
                onStart: function(){
                    self.aboutElem.addClass('active');
                    self.disableControls = true;
                },
                onComplete: function(){
                    self.aboutCtaLabel.text('Close');
                }
            });
            tl.staggerFrom($('section#about h1'), .2, {
                opacity: 0,
                y: -20,
                ease: Power2.easeInOut
            }, .05);
            tl.staggerFrom([$('section#about > p'), $('section#about > span')], .2, {
                opacity: 0,
                ease: Power2.easeInOut
            }, .05);
            tl.staggerFrom([socials[0],socials[1],socials[2],socials[3],socials[4]], .3, {
                opacity: 0,
                x: -5,
                ease: Power2.easeInOut
            }, .10);
        }
    })
};

App.prototype.bindNavItem = function() {
    var self = this;

    this.controlSelector.on('click',function(){
        if (self.disableControls === false) {
            var projectId = $(this).attr('data-item');
            
            if ( projectId != self.currentItem.id) {
                // Show new item
                app.showItem(projectId);
            }
        }
    })
};

App.prototype.bindNextItem = function() {
    var self = this;

    this.controlNextBtn.on('click',function(){
        if (self.disableControls === false) {
            app.toggleItem('next',app.currentItem);
        }
    });
};

App.prototype.bindPreviousItem = function() {
    var self = this;

    this.controlPreviousBtn.on('click',function(){
        if (self.disableControls === false) {
            app.toggleItem('previous',app.currentItem);
        }
    });
};

App.prototype.onKeydown = function() {
    var self = this;

    if (self.disableControls === false) {
        self.disableControls === true;
        // Left arrow
        if (event.keyCode == 37) {
            app.toggleItem('previous',app.currentItem);
        };

        // Right arrow
        if (event.keyCode == 39) {
            app.toggleItem('next',app.currentItem);
        };
    }
};

App.prototype.onMousewheel = function() {
    var self = this;

    if (self.disableControls === false) {
        // Down
        if (event.deltaY < -20) {
            app.toggleItem('previous',app.currentItem);
        };

        // Up
        if (event.deltaY > 20) {
            app.toggleItem('next',app.currentItem);
        };
    }
};

App.prototype.timer = function() {
    var self = this;
    var maxtimerWidth = this.timerBar.parent().width();

    self.timerTimeLine = new TimelineMax();

    self.timerTimeLine.to(this.timerBar, 15, {
        css: {
            width: maxtimerWidth
        },
        ease: Power0.easeNone,
        onComplete: function(){
            // Check if animation is really completed & reset timer
            if (self.timerTimeLine.progress() === 1) {
                self.toggleItem('next',self.currentItem);
            }
        }
    });
    self.timerTimeLine.to(this.currentItem.background, 15, {
        rotation: "+=1.5",
        x: "-=40",
        y: "-=40",
        ease: Power0.easeNone,
        onStart: function(){
            self.timerTimeLine.set(self.previousItem.background, {clearProps:"rotation,x,y"});
        }
    }, "-=15");
};

App.prototype.setCurrentItem = function(project) {
    var self = this;

    // Reset timer animations
    if (this.timerTimeLine) {
        setTimeout(function(){
            self.timerTimeLine.kill();
            self.timerTimeLine.restart();
            self.timer();
        }, 250);
    }

    // Set current item
    this.currentItem = project;

    // Set next & previous item (+labels)
    for (var i = 0; i < this.projects.length; i++){
        if (project.id === self.projects[i].id){
            if (i === self.projects.length  - 1){ // Case : Last item
                // Set next item
                self.nextItem = self.projects[0];
                self.controlsBtnAnimateInOut("next",this.controlsNextInner[0]);
                // Set previous item
                self.previousItem = self.projects[self.projects.length - 2];
                self.controlsBtnAnimateInOut("previous",this.controlsPreviousInner[self.projects.length - 2]);
            } else if (i === 0){ // Case : First item
                // Set next item
                self.nextItem = self.projects[1];
                self.controlsBtnAnimateInOut("next",this.controlsNextInner[1]);
                // Set previous item
                self.previousItem = self.projects[self.projects.length - 1];
                self.controlsBtnAnimateInOut("previous",this.controlsPreviousInner[self.projects.length - 1]);
            } else { // Other cases
                // Set next item
                self.nextItem = self.projects[i+1];
                self.controlsBtnAnimateInOut("next",this.controlsNextInner[i+1]);
                // Set previous item
                self.previousItem = self.projects[i-1];
                self.controlsBtnAnimateInOut("previous",this.controlsPreviousInner[i-1]);
            }
            // Set current nav selector
            self.controlsSelectorAddCurrentClass(self.controlSelector[i]);
        }
    }
};

App.prototype.showItem = function(projectId) {
    var self = this;
    var project = null;

    for (var i = 0; i < this.projects.length; i++){
        if (projectId === self.projects[i].id){
            project = self.projects[i];
        }
    }

    this.currentItem.hide();
    project.show();
    self.setCurrentItem(project);
};

App.prototype.toggleItem = function(direction, project){
    var self = this;

    switch(direction){
        case 'next':
            for (var i = 0; i < self.projects.length; i++){
                if (project.id === self.projects[i].id){
                    if (i === self.projects.length  - 1){
                        // Hide precedent item
                        project.hide();
                        // Show next item
                        self.nextItem.show();
                        // Set new currentItem
                        self.setCurrentItem(self.projects[0]);
                    } else {
                        // Hide precedent item
                        project.hide();
                        // Show next item
                        self.nextItem.show();
                        // Set new currentItem
                        self.setCurrentItem(self.projects[i+1]);
                    }
                }
            }
            break;
        case 'previous':
            for (var i = 0; i < self.projects.length; i++){
                if (project.id === self.projects[i].id) {
                    if (i === 0) {
                        // Hide precedent item
                        project.hide();
                        // Show previous item
                        self.previousItem.show();
                        // Set new currentItem
                        self.setCurrentItem(self.projects[self.projects.length - 1]);
                    } else {
                        // Hide precedent item
                        project.hide();
                        // Show previous item
                        self.previousItem.show();
                        // Set new currentItem
                        self.setCurrentItem(self.projects[i-1]);
                    }
                }
            }
            break;
    }
};

App.prototype.controlsSelectorAddCurrentClass = function(currentItem) {
    $('.slider-controls > .selectors > ul > li.current').removeClass('current');
    $(currentItem).addClass('current');
};

App.prototype.controlsBtnAnimateInOut = function(control, newBtn){
    var self = this;

    // Set oldBtn DOM Elem 
    if (control === "previous") {
        var oldBtn = $('.previous-project .text-inner.active');
    } else if (control === "next") {
        var oldBtn = $('.next-project .text-inner.active');
    }

    // Set newBtn DOM Elem
    newBtn = $(newBtn);

    // Animations timeline
    var tl = new TimelineMax();
    tl.to(oldBtn, .25, {
        opacity: 0,
        y: 2,
        ease: Power2.easeOut,
        onStart: function(){
            self.disableControls = true;
        },
        onComplete: function(){
            oldBtn.removeClass('active');
            tl.set(oldBtn, {clearProps:"y"});
        }
    });
    tl.to(newBtn, .25, {
        opacity: 1,
        y: 0,
        ease: Power2.easeOut,
        onComplete: function(){
            if (tl.progress() === 1) {
                self.disableControls = false;
                newBtn.addClass('active');
            }
        }
    });
}
