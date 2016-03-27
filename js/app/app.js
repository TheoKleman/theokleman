var App = function(){
    this.projects = [];
    this.currentItem = null;

    this.sliderTemplateHbs = null;
    this.templateSliderData = null;
};

App.prototype.init = function(){

    var self = this;

    // Get slider template
    $.get('templates/slider.hbs', function(data){
        self.sliderTemplateHbs = data;
        self.templateSliderData = Handlebars.compile(self.sliderTemplateHbs);
    });

    // Get projects and template them
    $.getJSON('json/projects.json', function(data){
        // Create slider projects items
        var projects = data;
        $('section#slider').html(app.templateSliderData(projects));

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

        self.slider();
    });
};

App.prototype.slider = function(){
    $('.next-project').on('click',function(){
        app.toggleProject('next',app.currentItem);
    });
    $('.previous-project').on('click',function(){
        app.toggleProject('previous',app.currentItem);
    });
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
                        self.currentItem = self.projects[i+1];
                        self.projects[i+1].show();
                    }
                }
            }
            break;
        case 'previous':
            for (var i = 0; i < self.projects.length; i++){
                if (project.id === self.projects[i].id) {
                    if (i === 0) {
                        project.hide();
                        self.currentItem = self.projects[self.projects.length - 1];
                        self.projects[self.projects.length - 1].show();
                    } else {
                        project.hide();
                        self.currentItem = self.projects[i-1];
                        self.projects[i-1].show();
                    }
                }
            }
            break;
    }
};
