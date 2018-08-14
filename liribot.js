require('dotenv').config();

var keys=require("./API_keys.js");

var request = require('request');
var inquirer = require("inquirer");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
 
var client = new Twitter(keys.twit_keys);

var spotify = new Spotify(keys.spot_keys);

function getTwitter (id) {
    client.get('statuses/user_timeline', id, function(error, tweets, response) {
        if (!error) {
            for (i=0;i<tweets.length;i++) {
                console.log("\n"+tweets[i].created_at);
                console.log(tweets[i].text+"\n");
            }
        }
        else {console.log("No twitter data found!");}
    });
}

function getSpotify (song) {
    spotify.search({type: 'track', query: song}, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
    
        // Do something with 'data'
        console.log("\nThe artists name is: "+data.tracks.items[0].artists[0].name);
        console.log("The album is: "+data.tracks.items[0].album.name);
        console.log("The release year was: "+data.tracks.items[0].album.release_date);
        console.log("Disc: "+data.tracks.items[0].disc_number);
        console.log("Track: "+data.tracks.items[0].track_number);
        console.log("Current Pop Rating: "+data.tracks.items[0].popularity+"%");
        console.log("Link: "+data.tracks.items[0].preview_url+"\n");
    });
}

function getOMDB (movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=f0738fdd";
                            
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
    
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        console.log(JSON.parse(body),2,null);
        console.log("\nTitle: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("Rated: " + JSON.parse(body).Rated);
        console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
        console.log("Release Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Main Plot: " + JSON.parse(body).Plot);
        console.log("Cast: " + JSON.parse(body).Actors+"\n");
        }
    });
}

function runLIRi () {

    console.log("\n");
    inquirer.prompt([
        {
            type:"list",
            message: "What would you like LIRI to search today?\n",
            choices:["tweets","spotify-a-song","get-my-movie","do-what-it-says"],
            name:"action"
        },
        {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
        }
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            switch (inquirerResponse.action) {
                case "tweets":

                    inquirer.prompt([
                        {
                            type: "input",
                            message: "What is your username?",
                            name: "twit_id"
                        },
                        {
                            type: "confirm",
                            message: "Are you sure:",
                            name: "confirm",
                            default: true
                        }
                    ]).then(function(inquirerResponse) {
                        if (inquirerResponse.confirm) {
                            getTwitter(inquirerResponse.twit_id);  
                            checkRunAgain(); 
                        }
                        else {
                            checkRunAgain();
                        }
                    });
                break;
            
                case "spotify-a-song":

                    inquirer.prompt([
                        {
                            type: "input",
                            message: "What is your song?",
                            name: "fav_song"
                        },
                        {
                            type: "confirm",
                            message: "Are you sure:",
                            name: "confirm",
                            default: true
                        }
                    ]).then(function(inquirerResponse) {
                        if (inquirerResponse.confirm) {
                            getSpotify(inquirerResponse.fav_song);
                            checkRunAgain();
                        }
                        else {
                            checkRunAgain();
                        }
                    });
                    
                break;
            
                case "get-my-movie":

                    inquirer.prompt([
                        {
                            type: "input",
                            message: "What is your movie?",
                            name: "user_movie"
                        },
                        {
                            type: "confirm",
                            message: "Are you sure:",
                            name: "confirm",
                            default: true
                        }
                    ]).then(function(inquirerResponse) {
                        if (inquirerResponse.confirm) {
                            // Then run a request to the OMDB API with the movie specified
                            getOMDB(inquirerResponse.user_movie);
                            checkRunAgain();
                        }
                        else {
                            checkRunAgain();
                        }
                    });
                break;
            
                case "do-what-it-says":
                    var fs = require("fs");
                    fs.readFile("random.txt", "utf8", function(error, data) {

                        // If the code experiences any errors it will log the error to the console.
                        if (error) {
                        return console.log(error);
                        }
                    
                        // We will then print the contents of data
                        console.log(data);
                    
                        // Then split it by commas (to make it more readable)
                        var dataArr = data.split(",");
                        var file_action = dataArr[0];
                        var file_data=dataArr[1];
                    
                        switch (file_action) {
                            case "tweets":
                                getTwitter(file_data);   
                            break;
                        
                            case "spotify-a-song":
                                getSpotify(file_data);                         
                            break;
                        
                            case "get-my-movie":
                                getOMDB(file_data);
                            break;
                        }
                    });
                    checkRunAgain();
                break;
            };
        }}
    );
}

function checkRunAgain() {
    setTimeout(function() {
        inquirer.prompt([
            {
                type: "confirm",
                message: "Would you like to use LIRI again?",
                name: "confirm",
                default: true
            }
        ]).then(function(inquirerResponse) {
                if (inquirerResponse.confirm) {
                    runLIRi();
                }
                else {console.log("\nThanks for using LIRI!");}
        });
    },1000);
}

runLIRi();



