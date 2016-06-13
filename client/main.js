import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';



Meteor.subscribe('Shows');
var timeline;

  // Functions 
function drawTimeline(episodes) {
      
      if (timeline != undefined) {
        timeline.destroy();
      } 

       var episodes_a = episodes; 
       var group = $('.js-select-season option:selected').val();
       shows = Shows.findOne(); 

      if (shows != undefined) {// looks good! 
       var episodes_aux = episodes_a.length;  
       //create items dataset
       var items = new vis.DataSet();

         //collecting episodes/items     
        for (var i=0; i < episodes_aux; i++){
            items.add({
                group:group,
                content: 'Episode ' + episodes_a[i].number +
          ' <span>' + episodes_a[i].name + '</span>',//episodes_a[i].name + '.' + '<span>Episode</span>' + episodes_a[i].number + '<span>,Season</span>' + episodes_a[i].season,
                start:   episodes_a[i].start
              });
          }
        
     // new dataset for groups
        var groups = new vis.DataSet(); 
            groups.add({ //loading data group
              id:group, 
              value: group,
              content:'<span>SEASON</span>' + group
            });

        var options = {
               type:'point',
               showMajorLabels: true,
               start:'2011',
               end:'2017',
               autoResize:true,
               min:'2011'
          };

        var container = document.getElementById('visualization');
        timeline = new vis.Timeline(container, items, groups, options);
        timeline.fit();  
      }
      else {
        return [];
      }
}

 function getSeasons(){  
      var seasons_aux = [];
      var seasons = [];
      var episodes_a = []; 
      shows = Shows.findOne();

      if (shows != undefined) {
        var episodes = shows._embedded.episodes.length;
        
        for (var i=0;i < episodes;i++){
            episodes_a[i] = shows._embedded.episodes[i];
            season = episodes_a[i].season;
            seasons.push(season); 
          }
        var counterSeasons = Math.max.apply(Math, seasons); 
        
          for (var g = 1; g <= counterSeasons; g++) {
             seasons_aux[g] = {season:g}
             $('.js-select-season').append('<option value="' + g + '">' + 'Season' + g + '</option>');
          } 
         return seasons_aux; 
        
      }
} 

  function getEpisodes(){
      var episodesbySeason = [];
      var episodes_aux = [];
      shows = Shows.findOne();

      seasonSelected = $('.js-select-season option:selected').val(); 
  // $('.js-select-episodes').empty();
          if (shows != undefined){
             
             var episodes = shows._embedded.episodes.length;
           
                //$('.js-select-episodes').empty();
                for (var i=0;i < episodes;i++){
                  episodesbySeason[i] = shows._embedded.episodes[i];
                  if (episodesbySeason[i].season == seasonSelected){
                     episodes_aux.push(episodesbySeason[i]);
                     $('.js-select-episodes').append('<option value="' + episodesbySeason[i].id + '">' + episodesbySeason[i].name  + '</option>');                
                  }
                }

            return episodes_aux; //return values to draw in the timeline the episodes
          }  

  }

 function getEpisode(episodes){
   var episodes_aux = [];   
   var sizeEpisodes;
   var episode;
   var episodeSelected;
   var episodeTemp;

   shows = Shows.findOne();

  if (shows != undefined) {
    episodes_aux = episodes;
    sizeEpisodes = episodes_aux.length;
    Template.instance().var_episode.set($('.js-select-episodes option:selected').val()); 

    console.log('aqui tabmien deberia salir el episodio correcto '+ Template.instance().var_episode.get());
       
       //delete duplicate values in the episode dropdrown list
       $(".js-select-episodes option").each(function(){
          $(this).siblings("[value='"+ this.value+"']").remove();
      });

      for (var i = 0; i < sizeEpisodes; i++){
         if (episodes_aux[i].id == Template.instance().var_episode.get()){
            episodeTemp = episodes_aux[i];    
         }
      } //end for
       return episodeTemp;
    }
 } 

  //Helpers
  
Template.content.onCreated(function(){
  this.variable = new ReactiveVar(); //storage JSON object episode
  this.var_episode = new ReactiveVar(); //storage the number of the episode 

});

Template.content.helpers ({
      get_content: function() {
        return Template.instance().variable.get();
      },
      get_seasons : function(){
        getSeasons();
        drawTimeline(getEpisodes());
     }
  });

  //Events
  Template.content.events({
    'change .js-select-season':function(event, template){
       event.preventDefault();
       $('.js-select-episodes').empty();
       drawTimeline(getEpisodes());
       Template.instance().variable.set(getEpisode(getEpisodes()));
      },
      'change .js-select-episodes':function(event, template){
       event.preventDefault();
       console.log('este es el ID del capitulo correcto ' + $('.js-select-episodes option:selected').val());
       Template.instance().variable.set(getEpisode(getEpisodes()));

      }
   });
 

   