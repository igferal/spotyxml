var readline = require('readline');
var request = require('request'); // "Request" library
var fs = require('fs');
var xml2js = require('xml2js');

var client_id = 'e2a7e6aca07d489c9d221dffe84491b2';
var client_secret = '49cabb78a20c452c8d9a3ca27362c91b';
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var builder = new xml2js.Builder();


// your application requests authorization
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

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
            url: 'https://api.spotify.com/v1/users/csharplover',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        request.get(options, function(error, response, body) {
            console.log("Autenticado");
        });
    }
});



request.get(authOptions, function(error, response, body) {

    if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var playlists = {
            url: 'https://api.spotify.com/v1/users/csharplover/playlists/',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };

        request.get(playlists, function(error, response, body) {

            var items = body.items;

            for (var i = 0; i < items.length; i++) {

                console.log(i + " - " + items[i].name + " - " + items[i].id);
            }

            read(items, token);

        })
    }
});

function read(items, token) {



    rl.question("Escoge una de las playlist (número)  ", function(answer) {


        if (answer < 0 || answer > items.length) {

            answer = -1;
            read(items, token);

        } else {

            rl.close();
            getTracks(answer, items, token);
        }

    });

}

function getTracks(answer, items, token) {

    var url = 'https://api.spotify.com/v1/users/csharplover/playlists/' + items[answer].id + "/tracks";

    var tracks = {
        url: url,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };
    request.get(tracks, function(error, response, body) {

        var songs = body.items;
        for (var i = 0; i < songs.length; i++) {

            console.log(songs[i].track.name);

        }
        parseXML(songs);

    });

}

function parseXML(songs) {

    var xml = builder.buildObject(songs);

    fs.writeFile("salida/playlist.xml", xml, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("Xml listo");
    });

}