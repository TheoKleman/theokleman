var App = function(){
    this.projects = [];
    this.sliderTemplateHbs = null;
    this.templateSliderData = null;
    this.projectTemplateHbs = null;
    this.templateProjectData = null;
    this.currentPage = null;
};

App.prototype.init = function() {

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

    // Get projects 
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
            app.projects[i] = new Project(id, link, thumbnail, title, shortTitle, client, technos, type, role);

            // Create projects in DOM
            $('section.project#'+id+' > .content').html(app.templateProjectData(app.projects[i]));

            // Set each project section position 
            $('section.project#'+id).css('left',[i]*100+'vw');
        }

    });
};

$(document).ready(function(){

    app = new App();
    app.init();

});
