
/*
 * Creación del aplicativo
*/
AsistentesApp = Ember.Application.create();


/*
 * Routing del aplicativo
*/
AsistentesApp.Router.map(function() {  
  this.resource('evento', { path: '/evento/:evento_id' });
});


/*
 * Definición de modelos
*/
AsistentesApp.Evento=Ember.Object.extend();

/*
 * Definición unificada de ruta y controlador para el index del aplicativo
*/
AsistentesApp.IndexRoute = Ember.Route.extend({
  setupController: function (controller, model) { 	   
   	var meetupAPI="http://api.meetup.com/2/events?format=jsonp&callback=?";
		var eventos = [];

		return $.getJSON(meetupAPI,{
			status :'past,upcoming',
			order : 'time',
			limited_events : true,
			group_urlname : 'medellinjs',
			desc : false,
			offset : 0,
			format : 'json',
			page : 20,
			fields : 'id,name,description',			
			sign : true,
			key: '2e315e2e7450773444574a712d5619'			
	      },function(data){      	
	      	data.results.forEach( function (evento) {
			  eventos.push( AsistentesApp.Evento.create(evento) );
			});		
      }).then(function(){
      	console.log(eventos);
    	controller.set("model", eventos);  
      });   
  }
});	


/*
 * Definición de ruta y controlador para la vista de cada evento
*/
AsistentesApp.EventoRoute = Ember.Route.extend({
  setupController: function(controller, model) {
  	
  		var meetupAPI="http://api.meetup.com/2/rsvps?format=jsonp&callback=?";		

		return $.getJSON(meetupAPI,{
			event_id: model.id,
			order: 'event',
			rsvp: 'yes',
			desc: false,
			offset: 0,
			format: 'json',
			page: 200,			
			sign : true,
			key: '2e315e2e7450773444574a712d5619'			
	      },function(data){   
	      	model.set('asistentes',data.results);	      	
      }).then(function(){
      	controller.set('model', model);
      });   
  }
});

/*
 *	Helpers procesando información para ser mostrada en una forma mas presentable
*/
Ember.Handlebars.helper('fecha', function(value, options) {    
  var nice_date = moment(value).format("LLL");
  return new Handlebars.SafeString(nice_date);
});

Ember.Handlebars.helper('etiqueta_estado', function(value, options) {    
  label='success'
  if(value=='upcoming'){  	
  	label='warning';
  }
  return new Handlebars.SafeString(label);
});


Ember.Handlebars.helper('estado', function(value, options) {    
  estado='realizado';
  label='success'
  if(value=='upcoming'){
  	estado='pendiente';
  	label='warning';
  }
  return new Handlebars.SafeString('<span class="label label-'+label+'">' + estado+ '</span>');
});


