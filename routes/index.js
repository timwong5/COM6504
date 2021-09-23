var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/getdata', function (req, res) {
  let roomNumber = req.body.roomNumber;
  let imageUrl = req.body.imageUrl;
  let usersData = getUsersData(roomNumber,imageUrl);
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
  if (req.body.roomNumber == null){
    res.setHeader('Content-Type','application/json');
    res.status(403).json({error: 403, reason: 'No RoomNumber'});
  }

});


/**
 * create the ChatData class
 */
class UsersData{
  constructor(roomNumber, imageUrl) {
    this.roomNumber = roomNumber;
    this.imageUrl = imageUrl;
  }
}

/**
 * return the userchatData
 * @param roomNumber
 * @param imageUrl
 * @returns {UsersData}
 */
function getUsersData(roomNumber, imageUrl){
  return new UsersData(roomNumber,imageUrl);
}

module.exports = router;
