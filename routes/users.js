var express = require('express');
var router = express.Router();
const fs = require('fs');
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req,res) {
  const  {userName, emailId } = req.body;
  fs.readFile('./datas/users.json', (err, data) => {
    if (err) res.json({
      success: false, message: err.message
    });
    let userArray = data.length === 0 || JSON.parse(data) === {} ? [] : JSON.parse(data);
    const findUser = userArray.find(u => u.userName === userName);
    const findEmail = userArray.find(u => u.emailId === emailId);
    if(!findUser && !findEmail){
      const hashPwd = bcrypt.hashSync(req.body.password, 10);
      const maxUser = _.maxBy(userArray, 'userId') || {userId: 0};
      userArray.push({...req.body, password: hashPwd, userId: maxUser.userId + 1});
      fs.writeFile('./datas/users.json', JSON.stringify(userArray), (err) => {
        if (err) res.json({
          success: false, message: err.message
        });
        res.json({success: true, message: 'User Added'});
      });
    } else {
      res.json({success : false, message: "User already exists"})
    }
  });
});

router.get('/login', function(req, res, next) {
  return passport.authenticate('local', (err, authUser, info) => {
    if(err) {
      return next(err);
    }

    if(authUser) {
      const {firstName, lastName, userName, emailId, userId} = authUser;
      const payload = {userName, userId};
        const token = jwt.sign(payload, 'machineTest', {
          expiresIn: "2h" 
        });
        return res.json({success: true, info : {
          token,
          firstName,
          lastName,
          userName,
          emailId,
          userId
        }
        })
    } else {
       return res.json({
          success: false, message: "Invalid UserName and Password"
        });
    }
  })(req, res, next);
  // fs.readFile('./datas/users.json', (err, data) => {
  //   if (err) res.json({
  //     success: false, message: err.message
  //   });
  //   let {users : userArray} = JSON.parse(data);
  //   const findUser = userArray.find(u => u.userName === userName);
  //   if(findUser){
  //     if (bcrypt.compareSync(password, findUser.password)) {
  //       const {firstName, lastName, userName, emailId, userId} = findUser;
  //       const payload = {userName, userId};
  //       const token = jwt.sign(payload, 'machineTest', {
  //         expiresIn: "2h" 
  //       });
  //       res.json({
  //         token,
  //         firstName,
  //         lastName,
  //         userName,
  //         emailId,
  //         userId
  //       })
  //     }else {
  //       res.json({
  //         success: false, message: "Invalid UserName and Password"
  //       });
  //     }
  //   } else {
  //     if (err) res.json({
  //       success: false, message: "Invalid UserName and Password"
  //     });
  //   }
  // });
});

module.exports = router;
