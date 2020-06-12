const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    const token = req.header('token')
    const type = req.header('type')
    if(!token){
        console.log("no token found")
        return res.status(401).send('Access Denied')
    }
    if(type != 'Admin'){
        console.log("not an admin")
        return res.status(401).send('Access Denied')
    }
    try{
        const verified = jwt.verify(token, 'prcproject')
        console.log("token checks out")
        req.user=verified
        next()
    }catch(err){
        res.status(400).send('Invalid Token')
    }
}

