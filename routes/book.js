/**
 * Created by TangentGuo on 16/9/5.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.query);
    var sql = {};
    if(req.query.bookName){
        sql.name = req.query.bookName;
    }
    console.log(sql);
    req.db.king.find(sql,{name:1,id:1,title:1}).sort({id:1}).toArray(function (err,result) {
        if(err) console.log(err);
       console.log(result);
       res.render('book', { title: sql.name,data:result });
    });
    
});
//文章列表
router.get('/:id', function(req, res, next) {
	//console.log(req.params.id);
	var id = req.params.id.substr(1);
    //req.db.king.findById(id,function (err,result) {
    //   if(err) console.log(err);
    //   res.render('bookContent', { title:resul t.title,data:result });
    //});
    var name = req.query.name;

    req.db.king.find({id:parseInt(id),name:name}).toArray(function (err,result) {
        var result = !err&&result.length>0?result:[{title:'没有此章',content:''}];
        console.log(result);
        res.render('bookContent', { title:result[0].title,data:result[0] });
    })
    
});


module.exports = router;
