const jwt = require('jsonwebtoken')

module.exports = {
    getToken: (req) => {
        return req.headers.authorization.replace('Bearer ', '');
    },
    isLogin: (req, res, next) => {
        require('dotenv').config()
        // const jwt = require('jsonwebtoken')

        if (req.headers.authorization != null) {

            const token = req.headers.authorization.replace('Bearer ', '');
            const key = process.env.secret;

            try {
                const verify = jwt.verify(token, key)
                if (verify != null) {
                    next();
                }
            } catch (e) { }

        } else {
            // res.statusCode = 401;
            return res.send('FAILED AUTHORIZATION');
        }
    },
    getMemberId: (req,res)=>{
        
        const token = req.headers.authorization.replace('Bearer ', '');
        const payLoad = jwt.decode(token);
        return payLoad.id;
    },
    getAdminId: (req,res)=>{
        
        const token = req.headers.authorization.replace('Bearer ', '');
        const payLoad = jwt.decode(token);
        return payLoad.id;
    }
}
