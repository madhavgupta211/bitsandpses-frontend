const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Station = require('../models/station');


// get details of a station for ps1
router.get('/api/1/:station', async (req, res) => {
  const station = await Station.findOne({ category: { type: 'ps1' }, slug: req.params.station });

  if (!station) {
    res.status(404).send();
  } else {
    const stationJSON = await station.toJSON();
    res.send(stationJSON);
  }
});

// search the stations by name for ps1
router.get('/api/1', async (req, res) => {
  try {
    const stations = await Station.find({
      $text: { $search: req.query.name },
      category: { type: 'ps1' }
    });

    for (let i = 0; i < stations.length; i++) {
      stations[i] = await stations[i].toJSON();
    }

    res.send(stations);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// post a new comment on the opportunity for ps1
router.post('/api/1/:station/comment', auth, async (req, res) => {
  const station = await Station.findOne({ category: { type: 'ps1' }, slug: req.params.station });

  if (!station) {
    return res.status(404).send('Station not found');
  }

  station.discussion.push({
    comment: {
      user: req.user._id,
      data: req.body.data
    }
  });

  try {
    await station.save();
    const stationJSON = await station.toJSON();
    res.send(stationJSON);
  } catch (e) {
    res.status(400).send(e);
  }
});

// post a new reply on a comment for ps1
router.post('/api/1/:station/:comment/reply', auth, async (req, res) => {
  const station = await Station.findOne({ category: { type: 'ps1' }, slug: req.params.station });

  if (!station) {
    return res.status(404).send('Station not found');
  }

  // eslint-disable-next-line eqeqeq
  const commentIndex = station.discussion.findIndex((comment) => comment._id == req.params.comment);

  if (commentIndex === -1) {
    return res.status(404).send('Comment not found');
  }

  station.discussion[commentIndex].comment.replies.push({
    user: req.user._id,
    data: req.body.data
  });

  try {
    await station.save();
    const stationJSON = await station.toJSON();
    res.send(stationJSON);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
