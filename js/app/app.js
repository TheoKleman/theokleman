var App = function(){
    this.projects = [];
    this.currentItem = null;

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
        self.currentItem = self.projects[0];

        // Create controls panel in DOM
        self.controlsElem.html(app.templateControlsData(app));

        self.slider();
    });
};

App.prototype.bind = function() {
    // Bind controls
    this.nextItem();
    this.previousItem();
};

App.prototype.slider = function(){
    // Init controls
    this.bind();
    
    // Init sequence between items
    this.loader();
};

App.prototype.nextItem = function() {
    var self = this;

    $('.next-project').on('click',function(){
        app.toggleProject('next',app.currentItem);
        // wtf i'm doing right here ... 😷
        self.controlsElem.html(app.templateControlsData(app));
        self.bind();
    });
};

App.prototype.previousItem = function() {
    var self = this;

    $('.previous-project').on('click',function(){
        app.toggleProject('previous',app.currentItem);
        // wtf i'm doing right here ... 😷
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
                        project.hide();
                        self.projects[0].show();
                        self.currentItem = self.projects[0];
                    } else {
                        project.hide();
                        self.projects[i+1].show();
                        self.currentItem = self.projects[i+1];
                    }
                }
            }
            break;
        case 'previous':
            for (var i = 0; i < self.projects.length; i++){
                if (project.id === self.projects[i].id) {
                    if (i === 0) {
                        project.hide();
                        self.projects[self.projects.length - 1].show();
                        self.currentItem = self.projects[self.projects.length - 1];
                    } else {
                        project.hide();
                        self.projects[i-1].show();
                        self.currentItem = self.projects[i-1];
                    }
                }
            }
            break;
    }
};
