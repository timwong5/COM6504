let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/getUsersData', function (req, res) {
  let roomID = req.body.roomNo;
  let imageUrl = req.body.image_url;
  // //the error situations
  // if(req.body == null){
  //   res.setHeader('Content-Type','application/json');
  //   res.status(403).json({error: 403, reason: 'No user data'});
  //   res.end();
  //   return;
  // }
  // if(req.body.imageUrl == null){
  //   res.setHeader('Content-Type','application/json');
  //   res.status(403).json({error: 403, reason: 'No ImageURL'});
  //   res.end();
  //   return;
  // }
  // if (req.body.roomID == null){
  //   res.setHeader('Content-Type','application/json');
  //   res.status(403).json({error: 403, reason: 'No roomID'});
  //   res.end();
  //   return;
  // }
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
