const jwt = require("jsonwebtoken");
const _ = require("lodash");

const User = require("../models/User");

// Create an access or refresh token based on type
const createJwtToken = (user, type) => {

    if(type === "refreshToken")
        return  jwt.sign({user: _.pick(user, ["id"])}, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return  jwt.sign({ user: user.toJSON()}, process.env.JWT_SECRET, { expiresIn: '5m' });
};


module.exports.signUp = (req, res, next) => {
    const { email, password, username } = req.body;

    if(!email || !password || !username){
        return res.status(422).send({ error: "You must provide an email, username and password" });
    }

    User.findOne({ email }, (err, rUser) => {
        if(err){
            return next(err);
        }
        if(rUser){
            return res.status(422).send({ error: "Already registered with this email" });
        }

        const user = new User({ email, password, username});
        user.save((err, rUser) => {
          if(err) return next(err);
          const jwtToken = createJwtToken(rUser, "refreshToken");
          return res.json({ user: { email, username, _id: rUser.id }, token: `jwt ${jwtToken}`});
        });
    });
};

module.exports.signIn = (req, res) => {
  const jwtToken = createJwtToken(req.user, "refreshToken");

  User.findById(req.user.id)
      .then(({ email, username, _id }) => {
        if(!_id) return res.send({ error: true, msg: "No user recordds"});

        return res.json({ user: {email, username, _id}, token: `jwt ${jwtToken}`});
      })

};

// Get an access token with a valid refresh token
module.exports.getToken = (req, res) => {

  if(!req.headers.authorization) return res.status(403).send({"error": true, "message": 'No token provided.'});

  const token = req.headers.authorization.substring(4);
  if(token){
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
      if(err)
        return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
       User.findById(decoded.user.id)
           .then(rUser => {
             if(!rUser) return res.send({ error: false, msg: "No user records"});

             const jwtToken = createJwtToken(rUser, "accessToken");
             res.json({ token: `jwt ${jwtToken}` });
           })
           .catch(err => console.log(err));

       return false;
    })
  }else{
    return res.status(403).send({
      "error": true,
      "message": 'No token provided.'
    });
  }
};


