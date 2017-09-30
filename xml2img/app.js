var http = require('http');
var fs = require('fs');
var xml2js = require('xml2js');
var xmlfile = process.argv[2];


if (xmlfile === undefined || !xmlfile.endsWith(".xml")) {
    console.log("Indica el fichero xml en la linea de comandos $node app.js playlists.xml")
    process.exit(1);

} else {
    parseXML();
}



function parseXML() {

    var parser = new xml2js.Parser();
    fs.readFile(xmlfile, function(err, data) {
        parser.parseString(data, function(err, result) {

            var tracks = result.root.track;
            var url;
            var filename;

            for (var i = 0; i < tracks.length; i++) {

                filename = denormalizeFileName(tracks[i].name);

                url = tracks[i].album[0].images[0].url[0].replace("https", "http"); //request no soporta urls via https
                writeFile(filename, url);


            }

            console.log('Proceso completado, mire la carpeta salida para ver el resultado');

        });
    });
}

function denormalizeFileName(name) {

    var filename = name + "";
    filename.replace("/\//g", "");
    return filename;
}

function writeFile(namefile, url) {

    var file = fs.createWriteStream("salida/" + namefile + ".jpg");
    var request = http.get(url, function(response) {
        response.pipe(file);
    });
}