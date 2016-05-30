import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
 


  if (!Shows.findOne()) {

		console.log("No hay episodios todavia... cargando datos");
		// pull in the NPM package 'fs' which provides
		// file system functions
		var fs = Meteor.npmRequire('fs');
		// get a list of files in the folder private/jsonfiles, which
		// ends up as assets/app/jsonfiles in the app once it is built
		var file = fs.readdirSync('./assets/app/jsonfiles/');
		
				
		var filename = 'jsonfiles/game_of_thrones.json';
		console.log(filename);
	
		var show = JSON.parse(Assets.getText(filename));
		show = JSON.parse(JSON.stringify(show).split('"airdate":').join('"start":'));
		var showFormated = JSON.stringify(show);
		//show = JSON.parse(showFormated);
		console.log(showFormated);
		
		Shows.insert(show);
		console.log("JSON insertado correctamente");

	}else {
	
		console.log('Hay datos');
	}
		 	// in case the file does not exist, put it in a try catch
		 	/*try{
		 		var song = JSON.parse(Assets.getText(filename));
		 		// now flatten the rhythm and tonal features
		 		// into a single set of properties
		 		
		 		var single_features = {};
		 		var array_features = {};
		 		var string_features = {};

		 		rhythm_keys = Object.keys(song.rhythm);
      			tonal_keys = Object.keys(song.tonal);
      			for (var j=0;j<rhythm_keys.length;j++){
      				console.log("type of "+rhythm_keys[j]+" is "+typeof(song.rhythm[rhythm_keys[j]]));
      				// only use features that are numbers ... ignore arrays etc. 
      				if (typeof(song.rhythm[rhythm_keys[j]]) === "number"){
      					single_features[rhythm_keys[j]] = song.rhythm[rhythm_keys[j]];
      				}
      				if (typeof(song.rhythm[rhythm_keys[j]]) === "object" && 
      					song.rhythm[rhythm_keys[j]].length != undefined){// its an array
      					array_features[rhythm_keys[j]] = song.rhythm[rhythm_keys[j]];
      				}
      				if (typeof(song.rhythm[rhythm_keys[j]]) === "string"){
      					string_features[rhythm_keys[j]] = song.rhythm[rhythm_keys[j]];
      				}
      	
      			}
      			for (var j=0;j<tonal_keys.length;j++){
      				console.log("type of "+tonal_keys[j]+" is "+typeof(song.tonal[tonal_keys[j]]));
      				if (typeof(song.tonal[tonal_keys[j]]) === "number"){
      					single_features[tonal_keys[j]] = song.tonal[tonal_keys[j]];
      				}
      				if (typeof(song.tonal[tonal_keys[j]]) === "object" && 
      					song.tonal[tonal_keys[j]].length != undefined){// its an array
      					array_features[tonal_keys[j]] = song.tonal[tonal_keys[j]];
      				}
      				if (typeof(song.tonal[tonal_keys[j]]) === "string"){
      					string_features[tonal_keys[j]] = song.tonal[tonal_keys[j]];
      				}
      			}
		 		// insert the song to the DB:
		 		// 
		 		song.single_features = single_features;
		 		song.array_features = array_features;
		 		song.string_features = string_features;
		 		
		 		Songs.insert(song);
		 		inserted_songs ++;
		 	}catch (e){
		 		console.log("error parsing file "+filename);
		 	}
		}
		console.log("Inserted "+inserted_songs+" new songs...");*/



	//publish methods

   	Meteor.publish('Shows', function(){
   	return Shows.find({})
   });
});
