/**
 * Created by TangentGuo on 16/9/5.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    req.db.king.find({},{name:1,id:1}).sort({id:1}).toArray(function (err,result) {
       console.log(result);
    });
    res.render('book', { title: '我要做皇帝' });
});

module.exports = router;
