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

    // Others
    this.loaderBar = null;
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

        // Set each project section position 
        self.projects[0].show();
        self.setCurrentItem(self.projects[0]);

        // Create controls panel in DOM
        self.controlsElem.html(app.templateControlsData(app));

        // Init slider
        self.slider();
    });
};

App.prototype.setCurrentItem = function(project) {
    var self = this;

    // Set current item
    this.currentItem = project;

    // Set next & previous item
    for (var i = 0; i < this.projects.length; i++){
        if (project.id === self.projects[i].id){
            if (i === self.projects.length  - 1){
                self.nextItem = self.projects[0];
                self.previousItem = self.projects[self.projects.length - 2];
            } else if (i === 0){
                self.nextItem = self.projects[1]
                self.previousItem = self.projects[self.projects.length - 1];
            } else {
                self.nextItem = self.projects[i+1];
                self.previousItem = self.projects[i-1];
            }
        }
    }
};

App.prototype.slider = function(){
    // Init controls
    this.bind();
};

App.prototype.bind = function() {
    // Bind controls
    this.controlSelector = $('.slider-controls > .selectors > ul > li');
    this.controlNextBtn = $('.next-project');
    this.controlPreviousBtn = $('.previous-project');
    this.bindNavItem();
    this.bindNextItem();
    this.bindPreviousItem();

    // Bind other elems 
    this.loaderBar = $('.slider-loader > span');

    // Init sequence between items
    this.loader();
};

App.prototype.reTemplateControls = function() {
    this.controlsElem.html(app.templateControlsData(app));
    this.bind();
};

App.prototype.bindNavItem = function() {
    var self = this;

    this.controlSelector.on('click',function(){
        var projectId = $(this).attr('data-item');
        
        if ( projectId != self.currentItem.id) {
            // Show new item
            app.showItem(projectId);

            // Regenerate template and re-bind selectors
            self.reTemplateControls();
        }    
    })
};

App.prototype.bindNextItem = function() {
    var self = this;

    this.controlNextBtn.on('click',function(){
        app.toggleItem('next',app.currentItem);

        // Regenerate template and re-bind selectors
        self.reTemplateControls();
    });
};

App.prototype.bindPreviousItem = function() {
    var self = this;

    this.controlPreviousBtn.on('click',function(){
        app.toggleItem('previous',app.currentItem);

        // Regenerate template and re-bind selectors
        self.reTemplateControls();
    });
};

App.prototype.loader = function() {
    var self = this;

    // Loading between slides
    var maxLoaderWidth = this.loaderBar.parent().width();

    this.loaderTween = TweenMax.to(this.loaderBar,7,{
        width: maxLoaderWidth,
        ease: Power0.easeNone,
        onComplete: function(){
            // Check if animation is really completed
            if (self.loaderTween.progress() === 1) {
                self.toggleItem('next',self.currentItem);
                // Regenerate template and re-bind selectors
                self.reTemplateControls();
            }
        }
    });
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
