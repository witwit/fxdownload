var fxdownload = require('./main.js');

fxdownload.getDateForex({
    date :              new Date(2011, 9+1, 10),
    dir :               "./zip",
    clean :             true,
    parse :             true,
    onRecordParsed :    function(rec) {},
    onAllRecordsParsed: function(recs) {
        console.log(recs.length);
        console.log(recs[0]);
    }
});