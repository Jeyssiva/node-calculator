var express = require('express');
var router = express.Router();
const fs = require('fs');
const _ = require("lodash");

/* GET users listing. */
router.get('/', function(req, res, next) {
    fs.readFile('./datas/history.json', (err, data) => {
        let historyData = data.length === 0 || JSON.parse(data) === {} ? [] : JSON.parse(data)
        return res.json({
            success: historyData.length === 0 ? false : true,
            data: historyData
        });
    });
});

router.post('/', function(req, res, next) {
    try
    {
        fs.readFile('./datas/history.json', (err, data) => {
        let historyData = data.length === 0 || JSON.parse(data) === {} ? [] : JSON.parse(data);
        historyData.push({...req.body}) 
        fs.writeFile('./datas/history.json', JSON.stringify(historyData), (err) => {
            if (err) return res.json({
              success: false, message: err.message
            });
            
            return res.json({success: true, data: {...req.body}});
        });
    });
    }
    catch (err) {
        return res.status(401).json(err);
    }
});

router.delete('/', function(req, res, next) {
    fs.readFile('./datas/history.json', (err, data) => {
        const deletedHistory = []
        fs.writeFile('./datas/history.json', JSON.stringify(deletedHistory), (err) => {
            if (err) return res.json({
              success: false, message: err.message
            });
            return res.json({success: true, data: deletedHistory});
        });
    });
});

module.exports = router;
