let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/getUsersData', function (req, res) {
  let roomID = req.body.roomNo;
  let imageUrl = req.body.image_url;
  let resData = {
      "userInfo":
          {
              "user": imageUrl,
              "room": roomID
          }
  };
  res.send(resData);
});

module.exports = router;
