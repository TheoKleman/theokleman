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

    // CTA DOM Elems
    this.controlSelector = null;
    this.controlNextBtn = null;
    this.controlPreviousBtn = null;

    // Others DOM Elems
    this.scrollerNext = null;
    this.scrollerPrevious = null;
    this.loaderBar = null;

    // Tweens
    this.loaderTween = null;
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
    // this.loader();
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

    // Bind other elems 
    this.loaderBar = $('.slider-loader > span');
};

App.prototype.bindNavItem = function() {
    var self = this;

    this.controlSelector.on('click',function(){
        var projectId = $(this).attr('data-item');
        
        if ( projectId != self.currentItem.id) {
            // Show new item
            app.showItem(projectId);

            // Todo change nav item
        }    
    })
};

App.prototype.bindNextItem = function() {
    var self = this;

    this.controlNextBtn.on('click',function(){
        app.toggleItem('next',app.currentItem);
    });
};

App.prototype.bindPreviousItem = function() {
    var self = this;

    this.controlPreviousBtn.on('click',function(){
        app.toggleItem('previous',app.currentItem);
    });
};

App.prototype.loader = function() {
    var self = this;
    var maxLoaderWidth = this.loaderBar.parent().width();

    this.loaderTween = TweenMax.to(this.loaderBar,7,{
        width: maxLoaderWidth,
        ease: Power0.easeNone,
        onComplete: function(){
            // Check if animation is really completed
            if (self.loaderTween.progress() === 1) {
                self.toggleItem('next',self.currentItem)
            }
        }
    });

    TweenMax.to(this.currentItem.background,7,{
        css:{
            scale: 1.15
        },
        ease: Power0.easeNone
    });
};

App.prototype.setCurrentItem = function(project) {
    var self = this;

    // Set current item
    this.currentItem = project;

    // Set next & previous item (+labels)
    for (var i = 0; i < this.projects.length; i++){
        if (project.id === self.projects[i].id){
            if (i === self.projects.length  - 1){ // Case : Last item
                // Set next item
                self.nextItem = self.projects[0];
                self.controlsBtnAnimateOut("next");
                self.controlsBtnAnimateIn(this.controlsNextInner[0]);
                // Set previous item
                self.previousItem = self.projects[self.projects.length - 2];
                self.controlsBtnAnimateOut("previous");
                self.controlsBtnAnimateIn(this.controlsPreviousInner[self.projects.length - 2]);
            } else if (i === 0){ // Case : First item
                // Set next item
                self.nextItem = self.projects[1];
                self.controlsBtnAnimateOut("next");
                self.controlsBtnAnimateIn(this.controlsNextInner[1]);
                // Set previous item
                self.previousItem = self.projects[self.projects.length - 1];
                self.controlsBtnAnimateOut("previous");
                self.controlsBtnAnimateIn(this.controlsPreviousInner[self.projects.length - 1]);
            } else { // Other cases
                // Set next item
                self.nextItem = self.projects[i+1];
                self.controlsBtnAnimateOut("next");
                self.controlsBtnAnimateIn(this.controlsNextInner[i+1]);
                // Set previous item
                self.previousItem = self.projects[i-1];
                self.controlsBtnAnimateOut("previous");
                self.controlsBtnAnimateIn(this.controlsPreviousInner[i-1]);   
            }
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

App.prototype.controlsBtnAnimateOut = function(control) {
    if (control === "previous") {
        var btnText = $('.previous-project .text-inner.active');
    } else if (control === "next") {
        var btnText = $('.next-project .text-inner.active');
    }
    btnText.removeClass('active');
    btnText.hide();
};

App.prototype.controlsBtnAnimateIn = function(btnText) {
    $(btnText).addClass('active');
    $(btnText).fadeIn();
};
