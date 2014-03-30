var http = require('http-get');

exports.load = function(settings) {
    var filename = settings.filename || settings.fileurl.split('/').pop();
    var dir = settings.dir || "";

    http.get(settings.fileurl, dir + "/" +  filename, function (error, result) {
        if (error) {
            console.error(error);
            if(settings.error) settings.error();
        } else {
            //console.log('File downloaded at: ' + result.file);
            if(settings.ready) settings.ready(result.file);
        }
    });
};




