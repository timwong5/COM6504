let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/getdata', function (req, res) {
  let roomID = req.body.roomID;
  let imageUrl = req.body.imageUrl;
  let usersData = getUsersData(roomID,imageUrl)
  res.setHeader('Content-Type', 'application/json');
  res.json(usersData);

  //the error situations
  if(req.body == null){
    res.setHeader('Content-Type','application/json');
    res.status(403).json({error: 403, reason: 'No user data'});
  }
  if(req.body.imageUrl == null){
    res.setHeader('Content-Type','application/json');
    res.status(403).json({error: 403, reason: 'No ImageURL'});
  }
  if (req.body.roomID == null){
    res.setHeader('Content-Type','application/json');
    res.status(403).json({error: 403, reason: 'No roomID'});
  }

});

module.exports = router;
