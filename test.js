/**
 * Created by TangentGuo on 16/9/5.
 */
//mongod.exe --dbpath "C:\Program Files\MongoDB\data"
//.\mongod.exe --logpath "C:\Program Files\MongoDB\logs\log.txt" --logappend --dbpath "C:\Program Files\MongoDB\data" --directoryperdb --serviceName MongoDB -install

const fs = require('fs');
const charset = require('superagent-charset');
const request = require('superagent');
const cheerio = require('cheerio');
const moment = require('moment');
//var encoding = require('encoding');
charset(request);

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/ebook", {native_parser:true});
var book = db.bind('king');

var option = {
    url:'http://www.3zm.net/files/article/html/16/16148/'
};
var fail = '';
request.get(option.url).charset('gbk').end(function(err, res){
    // Calling the end function will send the request
    var $ = cheerio.load(res.text);
    $('#list a').each(function(n,el){
        //console.log(n);
        var title = $(this).text();
        var url = $(this).attr('href');


        if(fail.split(',').indexOf(n+'')==-1){
            return;
        }
        console.log(title,url,n);

        request.get(option.url+url).charset('gbk').end(function(err, res){

            if(err){
                console.log(err);
                failarr.push(n);
                log(n+',');
                return;
            }



            var $ = cheerio.load(res.text);

            //var regx =/[\n\r]+&nbsp;&nbsp;&nbsp;&nbsp;([\w\W]+)<\/div>[\n\r]+<!-- 翻页上AD开始 -->/g;
            //var arr = regx.exec(txt);
            //console.log(arr[1]);
            var time = moment().format('YYYY-DD-MM hh:mm:ss');

            var content = $.html('#content');
            //console.log(content);
            book.insert({id:n,bookid:2,name:'非常秘书',title:title,content:content});
        });



    });
});



function log(str){
    fs.appendFile('log/log2.txt',str, function (err) {
        console.log(err);
    });
}
