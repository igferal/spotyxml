var readline = require('readline');
var request = require('request'); // "Request" library
var fs = require('fs');
var querystring = require('querystring');


var client_id = 'e2a7e6aca07d489c9d221dffe84491b2';
var client_secret = '49cabb78a20c452c8d9a3ca27362c91b';
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


loging();


function loging() {

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    rl.question("Inserte su nombre de usuario: ", function(answer) {

        request.post(authOptions, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                // use the access token to access the Spotify Web API
                var token = body.access_token;
                var options = {
                    url: 'https://api.spotify.com/v1/users/' + answer,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                };
                request.get(options, function(error, response, body) {
                    if (!error && response.statusCode === 200) {

                        console.log("Autenticado");
                        getPlaylists(answer, token);
                    } else {
                        console.log("User not found");
                        process.exit(1);

                    }
                });
            } else {
                console.log("Token app error please send me an email");
                process.exit(1);

            }
        });


    });
}


function getPlaylists(user, token) {

    var playlists = {
        url: 'https://api.spotify.com/v1/users/' + user + '/playlists/',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        form: {
            name: "Playlist via post"
        },
        json: true
    };

    request.post(playlists, function(error, response, body) {

        console.log("Error");
        console.log(error);
        console.log("Response");
        console.log(response)
        console.log("Body");
        console.log(body);

    })
}