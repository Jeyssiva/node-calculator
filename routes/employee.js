var express = require('express');
var router = express.Router();
const fs = require('fs');
const _ = require("lodash");
const auth = require('../authManager.js');

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
    fs.readFile('./datas/employees.json', (err, data) => {
        let employees = data.length === 0 || JSON.parse(data) === {} ? [] : JSON.parse(data)
        res.json({
            success: true,
            data: employees
        });
    });
});

router.post('/', auth, function(req, res, next) {
    try
    {
        fs.readFile('./datas/employees.json', (err, data) => {
        let employees = data.length === 0 || JSON.parse(data) === {} ? [] : JSON.parse(data) ;
        const maxEmp = _.maxBy(employees, 'empId') || {empId: 0};
        employees.push({...req.body, empId : maxEmp.empId + 1}) 
        fs.writeFile('./datas/employees.json', JSON.stringify(employees), (err) => {
            if (err) res.json({
              success: false, message: err.message
            });
            
            res.json({success: true, data: employees});
        });
    });
    }
    catch (err) {
        return res.status(401).json(err);
    }
});

router.patch('/:id', auth, function(req, res, next) {
    const {name, emailId, age,address, mobile } = req.body;
    fs.readFile('./datas/employees.json', (err, data) => {
        let employees = JSON.parse(data);
        const updatedEmployees = employees.map(e => {
            if(e.empId === parseInt(req.params.id)){
                return {
                    ...e,
                    name,
                    emailId,
                    age,
                    address,
                    mobile
                }
            }
            return e
        })
        fs.writeFile('./datas/employees.json', JSON.stringify(updatedEmployees), (err) => {
            if (err) res.json({
              success: false, message: err.message
            });
            res.json({success: true, data: updatedEmployees});
        });
    });
});

router.delete('/:id', auth, function(req, res, next) {
    fs.readFile('./datas/employees.json', (err, data) => {
        let employees = JSON.parse(data);
        const deletedEmployees = employees.filter(df => df.empId !== parseInt(req.params.id))
        fs.writeFile('./datas/employees.json', JSON.stringify(deletedEmployees), (err) => {
            if (err) res.json({
              success: false, message: err.message
            });
            res.json({success: true, data: deletedEmployees});
        });
    });
});

module.exports = router;
