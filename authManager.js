
const fs = require('fs');
const jwt = require('jsonwebtoken');

const authenticationCheck = (req, res, next) => {
    const accessToken = req.get('Authorization');
    try {   
        const userToken = jwt.verify(accessToken, 'machineTest', {
            expiresIn:"2h"
        });
        fs.readFile('./datas/users.json', (err, data) => {
            if (err) res.json({
                success: false, message: err.message
            });
            let userArray = data.length === 0 || JSON.parse(data) === {} ? [] : JSON.parse(data);
            const findUser = userArray.find(u => u.userId === userToken.userId);
            if(findUser){
                return next();
            } else {
                return res.status(401).json({
                    success: false,
                    message: "UnAuthorized User"
                })
            }
        });
    } catch (err) {
        return res.status(401).json(err);
    }
}

module.exports = authenticationCheck