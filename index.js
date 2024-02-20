//necessary modules
const express = require('express');
const bodyParser = require('body-parser');
//create express app
const app = express();

//server start
const PORT = 3000;
//user database
const userDatabase =[
  {id:1, username:'user1',rollNumber:'001', password:'password1'},
  {id:2, username:'user2',rollNumber:'002', password:'password2'},
  {id:3, username:'user3',rollNumber:'003', password:'password3'},
];
//body-parser incoming json request
app.use(bodyParser.json());

 //user id validation
const validateUserID = (req, res, next) => {
  const userID = req.body.userID;

  // check user id exist in database
  const user = userDatabase.find((user) => user.rollNumber === userID);

  if (!user) {
    return res.status(401).json({error: 'invalid user id'});
  }
  //attach the user object the request further process
  req.user = user;
  
  //next middleware
  next();
}
// authentication user
app.post('/api/authenticate', validateUserID, (req, res) => {
  const { user, body} = req;
  const { password } = body;

  //check password matches
  if(user.password === password) {
    res.json({ message: 'Authentication successful', userData: user});
  } else {
    res.status(401).json({error:'Incorrect Password'});
  }

});
//start the server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
