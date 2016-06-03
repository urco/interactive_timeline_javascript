import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';



// this variable will store the visualisation so we can delete it when we need to 

  Meteor.subscribe('Shows');
  
  Template.seasons.helpers({

    get_seasons : function(){
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
        //console.log('numero de temporadas' + counterSeasons);
          for (var g = 1; g <= counterSeasons; g++) {
             seasons_aux[g] = {season:g}
          } 
         return seasons_aux;  
      }
     },

     get_episodes: function(){
      var episodesbySeason = [];
      var episodes_aux = [];
     

      $(document).ready(function(){
       $('.js-select-season').change(function() {
         seasonSelected = $('.js-select-season option:selected').val();
         episodes_aux = [];
          shows = Shows.findOne(); 

          if (shows != undefined){
             var episodes = shows._embedded.episodes.length;
             console.log("Season Selected" + seasonSelected);
            for (var i=0;i < episodes;i++){
              episodesbySeason[i] = shows._embedded.episodes[i];
              if (episodesbySeason[i].season == seasonSelected){
                 episodes_aux.push(episodesbySeason[i]);
              }
            }

            console.log(episodes_aux.length);
            console.log(episodes_aux);
            return episodes_aux; 
          }  
        });  
      }); //end document ready 
     }
  });
  
  Template.content.helpers ({
    // returns an array of the names of all features of the requested type
    get_content : function(){
      // pull an example song from the database
      // - we'll use this to find the names of all the single features
       var visjsobj;
       var episodes_a = []; 
       // create a data set with groups
       var seasons = [];
       var seassonsAux = 0 ;
      
      shows = Shows.findOne(); 

      if (shows != undefined) {// looks good! 
        // get an array of all the song feature names 
        // (an array of strings)
        console.log("hay datos");
        var episodes = shows._embedded.episodes.length;
        
        
       //create items dataset
       var items = new vis.DataSet();

         //collecting episodes/items 
          
        for (var i=0;i < episodes;i++){

            episodes_a[i] = shows._embedded.episodes[i];
            season = episodes_a[i].season;
            seasons.push(season); 

            items.add({
                group:season,
                content: 'Episode ' + episodes_a[i].number +
          ' <span>' + episodes_a[i].name + '</span>',//episodes_a[i].name + '.' + '<span>Episode</span>' + episodes_a[i].number + '<span>,Season</span>' + episodes_a[i].season,
                start:   episodes_a[i].start
              });
          }
        
     // new dataset for groups

        var groups = new vis.DataSet();
        var counterSeasons = Math.max.apply(Math, seasons); 
        //console.log('numero de temporadas' + counterSeasons);
          for (var g = 1; g <= counterSeasons; g++) {
            //var gAux = g +1;
            groups.add({ //loading data group
              id: g, 
              value: g,
              content:'<span>SEASON</span>' + g});
          }
          //console.log(groups);
        //create VIS object. Timeline vis.js
      
        if (visjsobj != undefined){
          visjsobj.destroy();
        }
        var options = {
               type:'point',
               showMajorLabels: false,
               start:'2011',
               end:'2017',
               autoResize:true,
               min:'2011'
          };
       
        var container = document.getElementById('visualization');
        //var timeline = new vis.Timeline(container, groups, items, options);
        var timeline = new vis.Timeline(container);
        timeline.setOptions(options);
        timeline.setGroups(groups);
        timeline.setItems(items);
        timeline.fit();
        return episodes_a; 

      }
      else {
        return [];

      }
    }
});
   
