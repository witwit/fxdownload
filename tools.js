/**
 * Created by wit on 10/4/13.
 */

var fs = require('fs');

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate()+days);
};


exports.parseCsvFile = function(fileName, callback, callbackAll){
    var stream = fs.createReadStream(fileName);
    var iteration = 0, header = [], buffer = "";
    var pattern = /(?:^|,)("(?:[^"]+)*"|[^,]*)/g;
    var recs = new Array();

    stream.on('data', function(data){
        buffer+=data.toString();
        var parts = buffer.split('\r\n');
        parts.forEach(function(d, i){
            if(i == parts.length-1) return
            if(iteration++ == 0 && i == 0){
                d = "ticker,date,time,open,high,low,close";
                header = d.split(pattern);
            } else {
                var rec = buildRecord(d);
                recs.push(rec);
                callback(rec);
            }
        });
        buffer = parts[parts.length-1];
    });
    stream.on('end', function() {
        callbackAll(recs);
    });

    function buildRecord(str){
        var record = {};
        str.split(pattern).forEach(function(value, index){
            if(header[index] != '')
                record[header[index].toLowerCase()] = value.replace(/"/g, '');
        });
        return record
    }
};