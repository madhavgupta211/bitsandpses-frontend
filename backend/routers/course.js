const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/course');

// get all courses
router.get('/api/course/all', async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      'name title slug',
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    );
    res.send(courses);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// get details of a course
router.get('/api/course/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) {
      res.status(404).send();
    } else {
      const courseJSON = await course.allData();
      res.send(courseJSON);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// search the stations by name for ps1
router.get('/api/course', async (req, res) => {
  const queries = {};

  if (req.query.name) {
    queries.name = { $regex: new RegExp(req.query.name, 'i') };
  }

  if (req.query.title) {
    queries.title = { $regex: new RegExp(req.query.title, 'i') };
  }

  try {
    const courses = await Course.find(queries,
      'name title slug',
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      });

    res.send(courses);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// post a new comment on the opportunity for ps1
router.post('/api/1/:slug/comment', auth, async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });

  if (!course) {
    return res.status(404).send('Course not found');
  }

  course.discussion.push({
    comment: {
      user: req.user._id,
      data: req.body.data
    }
  });

  try {
    await course.save();
    const courseJSON = await course.allData();
    res.send(courseJSON);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// post a new reply on a comment for ps1
router.post('/api/1/:slug/:comment/reply', auth, async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });

  if (!course) {
    return res.status(404).send('Course not found');
  }

  // eslint-disable-next-line eqeqeq
  const commentIndex = course.discussion.findIndex((comment) => comment._id == req.params.comment);

  if (commentIndex === -1) {
    return res.status(404).send('Comment not found');
  }

  course.discussion[commentIndex].comment.replies.push({
    user: req.user._id,
    data: req.body.data
  });

  try {
    await course.save();
    const courseJSON = await course.allData();
    res.send(course);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
