/**
 * Created by wit on 10/3/13.
 */
var fs = require('fs');
var rmdir = require('rimraf');
var zip = require('adm-zip');
var extend = require('extend');
var zipload = require('./zipload');
var tools = require('./tools');

var getDateForexI = function(settings) {
    var dt = settings.date;
    // "http://www.forexite.com/free_forex_quotes/2011/11/011111.zip"
    var url = "http://www.forexite.com/free_forex_quotes/";
    url += dt.getFullYear() + "/";

    var month = dt.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    url += month + "/";

    var day  = dt.getDate();
    day = (day < 10 ? "0" : "") + day;
    var filename = day + month + (dt.getFullYear()+"").substr(2,2);
    url += filename + ".zip";

    zipload.load({
        fileurl : url,
        dir : settings.dir,
        ready: function(filepath) {
            // console.log("callback ok " + filepath);
            var zipfile = new zip(filepath);
            zipfile.extractAllTo(settings.dir, true);
            // console.log('extracted file: ' + dir + "/" + filename + '.txt');
            var recs = new Array();

            if(settings.parse) {
                tools.parseCsvFile(settings.dir + "/" + filename + '.txt', function(rec) {
                    recs.push(rec);
                    settings.onRecordParsed(rec);
                }, function(recs) {
                    settings.onAllRecordsParsed(recs);
                });
            }
        }
    });
};

exports.getDateForex = function(op) {
     var defaults = {
        date : new Date(2011, 9+1, 10),
        dir : "./zip",
        clean : true,
        parse : true,
        onRecordParsed : function(rec) {},
        onAllRecordsParsed: function(recs) {}
    }

    var settings = extend(true, defaults, op);

    if(settings.clean) {
        rmdir(settings.dir, function(error){
            fs.mkdirSync(settings.dir);
            getDateForexI(settings);
        });
    } else {
        getDateForexI(settings);
    }
}


