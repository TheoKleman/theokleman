var App = function(){
    this.projects = [];
    this.previousItem = null;
    this.currentItem = null;
    this.nextItem = null;

    this.sliderTemplateHbs = null;
    this.templateSliderData = null;

    this.controlsTemplateHbs = null;
    this.templateControlsData = null;

    // templates DOM Elem
    this.sliderElem = $('section#slider');
    this.controlsElem = $('nav#controls');
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

        self.slider();
    });
};

App.prototype.bind = function() {
    // Bind controls
    this.showNextItem();
    this.showPreviousItem();
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

    // Init sequence between items
    this.loader();
};

App.prototype.showNextItem = function() {
    var self = this;

    $('.next-project').on('click',function(){
        app.toggleProject('next',app.currentItem);

        // Regenerate template and re-bind selectors
        self.controlsElem.html(app.templateControlsData(app));
        self.bind();
    });
};

App.prototype.showPreviousItem = function() {
    var self = this;

    $('.previous-project').on('click',function(){
        app.toggleProject('previous',app.currentItem);

        // Regenerate template and re-bind selectors
        self.controlsElem.html(app.templateControlsData(app));
        self.bind();
    });
};

App.prototype.loader = function() {
    // Loading between slides
};

App.prototype.toggleProject = function(direction, project){
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
