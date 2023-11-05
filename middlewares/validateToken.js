import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const validateToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    req.userId = 'guest'
    if(typeof bearerHeader !=='undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, process.env.SECRET, async(err, authData)=>{
            if(err) return next()
            try {   
        const isUser = await User.findById(authData.id);
        if(!isUser) return next()
          req.email = authData.email;
          req.name = authData.name;
          req.userId = authData.id;
          return next()
        } catch (error) {
          console.log(error);
          return next()
        }
      })
    }else{
      next()
    }
}

