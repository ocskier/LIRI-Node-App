require('dotenv').config();

var keys=require("./API_keys.js");

var request = require('request');
// var omdbApi = require('omdb');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
 
var client = new Twitter(keys.twit_keys);

var spotify = new Spotify(keys.spot_keys);

// var twitterUser = {screen_name: process.argv[2]};

var user_Movie = process.argv[3];
// var myYear = process.argv[4];
var twit_id = process.argv[3];
var action_item = process.argv[2];
var favSong = process.argv[3];

switch (action_item) {
    case "my-tweets":
        client.get('statuses/user_timeline', twit_id, function(error, tweets, response) {
            if (!error) {
            console.log(tweets[2].text);
            console.log(tweets[1].text);
            console.log(tweets[0].text);
            }
        });
	break;

	case "spotify-this-song":
        console.log(favSong);
        spotify.search({type: 'track', query: favSong}, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
        
            // Do something with 'data'
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].album.name);
            console.log(data.tracks.items[0].album.release_date);
            console.log(data.tracks.items[0].disc_number);
            console.log(data.tracks.items[0].track_number);
            console.log(data.tracks.items[0].popularity);
        
        });
	break;

	case "movie-this":
    // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" +user_Movie + "&y=&plot=short&apikey=f0738fdd";

        // This line is just to help us debug against the actual URL.
        console.log(queryUrl);
        
        request(queryUrl, function(error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
        
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Release Year: " + JSON.parse(body).Year);
            }
        });
	break;

	case "do-what-it-says":
        console.log("I Want it That Way");
        spotify.search({type: 'track', query: "I Want it That Way"}, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
        
            // Do something with 'data'
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].album.name);
            console.log(data.tracks.items[0].album.release_date);
            console.log(data.tracks.items[0].disc_number);
            console.log(data.tracks.items[0].track_number);
            console.log(data.tracks.items[0].popularity);
        
        });
            // doit();
	break;
};



