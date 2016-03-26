var App = function(){
    this.projects = [];
    this.currentItem = null;

    this.sliderTemplateHbs = null;
    this.templateSliderData = null;
    this.projectTemplateHbs = null;
    this.templateProjectData = null;
};

App.prototype.init = function(){

    var self = this;

    // Get slider template
    $.get('templates/slider.hbs', function(data){
        self.sliderTemplateHbs = data;
        self.templateSliderData = Handlebars.compile(self.sliderTemplateHbs);
    });

    // Get project template 
    $.get('templates/project.hbs', function(data){
        self.projectTemplateHbs = data;
        self.templateProjectData = Handlebars.compile(self.projectTemplateHbs);
    });

    // Get projects and template them
    $.getJSON('json/projects.json', function(data){
        // Append slider template
        var projects = data;
        $('section#slider').html(app.templateSliderData(projects));

        var entry = data.projects;
        for (var i = 0; i < entry.length; i++){
            var id = entry[i].id;
            var link = entry[i].link;
            var thumbnail = entry[i].thumbnail;
            var title = entry[i].title;
            var shortTitle = entry[i].shortTitle;
            var client = entry[i].client;
            var technos = entry[i].technos;
            var type = entry[i].type;
            var role = entry[i].role;

            // Create projects objects
            self.projects[i] = new Project(id, link, thumbnail, title, shortTitle, client, technos, type, role);

            // Create projects in DOM
            $('section.project#'+id+' > .content').html(app.templateProjectData(app.projects[i]));
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
