var App = function(){
    this.projects = [];
    this.projectTemplateHbs = null;
    this.templateData = null;
    this.currentPage = null;
};

App.prototype.init = function() {

    var self = this;

    // Get project template 
    $.get('assets/project.hbs', function(data){
        self.projectTemplateHbs = data;
        self.templateData = Handlebars.compile(self.projectTemplateHbs);
    });

    // Get projects 
    $.getJSON('assets/projects.json', function(data){
        for (var i = 0; i < data.length; i++){
            var id = data[i].id;
            var link = data[i].link;
            var thumbnail = data[i].thumbnail;
            var title = data[i].title;
            var shortTitle = data[i].shortTitle;
            var client = data[i].client;
            var technos = data[i].technos;
            var type = data[i].type;
            var role = data[i].role;

            // Create projects objects
            app.projects[i] = new Project(id, link, thumbnail, title, shortTitle, client, technos, type, role);

            // Create projects in DOM
            $('body').append('<section class="project" id="'+id+'"></section');
            $('section#'+id).html(app.templateData(app.projects[i]));
        }

    });
};

$(document).ready(function(){

    app = new App();
    app.init();

});
