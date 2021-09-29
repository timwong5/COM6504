var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/getdata', function (req, res) {
  let roomNumber = req.body.roomNumber;
  let imageUrl = req.body.imageUrl;
  let usersData = getUsersData(roomNumber,imageUrl)
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


/**
 * create the ChatData class
 */
class UsersData{
  constructor(roomID, imageUrl) {
    this.roomID = roomID;
    this.imageUrl = imageUrl;
  }
}

/**
 * return the userchatData
 * @param roomID
 * @param imageUrl
 * @returns {UsersData}
 */
function getUsersData(roomID, imageUrl){
  return new UsersData(roomID,imageUrl);
}

module.exports = router;
