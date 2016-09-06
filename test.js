/**
 * Created by TangentGuo on 16/9/5.
 */
//mongod.exe --dbpath "C:\Program Files\MongoDB\data"


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
    url:'http://www.piaotian.net/html/6/6309/'
};
request.get(option.url).charset('gbk').end(function(err, res){
    // Calling the end function will send the request
    var $ = cheerio.load(res.text);
    $('.centent ul li').each(function(n,el){
        //console.log(n);
        var title = $(this).text();
        var url = $(this).find('a').attr('href');

        if(n>3){
            console.log(title,url,n-3);
            //fs.appendFile('txt/我要当皇帝.txt',title+''+(n-3)+'\n\r', function (err) {});
            request.get('http://www.piaotian.net/html/6/6309/'+url).charset('gbk').end(function(err, res){
                //var $ = cheerio.load(res.text);
                if(err){
                    console.log(err);
                    log('http://www.piaotian.net/html/6/6309/'+url+' 抓取失败\n');
                    return;
                }
                var txt = res.text;
                var regx =/[\n\r]+&nbsp;&nbsp;&nbsp;&nbsp;([\w\W]+)<\/div>[\n\r]+<!-- 翻页上AD开始 -->/g;
                var arr = regx.exec(txt);
                //console.log(arr[1]);
                var time = moment().format('YYYY-DD-MM hh:mm:ss');
                if(!arr){
                    console.log(title+'没有匹配到');
                    log(title+'   没有匹配到\n');
                }else{
                    book.insert({id:(n-3),name:'我要做皇帝',title:title,content:arr[1]});
                }

            });

        }

    });
});



function log(str){
    fs.appendFile('txt/我要当皇帝.txt',str, function (err) {
        console.log(err);
    });
}
