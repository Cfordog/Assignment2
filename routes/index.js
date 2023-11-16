const express = require('express');
const router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');
const moment = require('moment-timezone');

// Render the home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
  
});
// Render the events page
router.get('/event', async (req, res) => {
  try {
    const db = await connectToDB();

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 6;
    const skip = (page - 1) * perPage;

    const [event, total] = await Promise.all([
      db.collection('event').find().skip(skip).limit(perPage).toArray(),
      db.collection('event').countDocuments()
      
    ]);

    res.render('event', { event, total, page, perPage });
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/event/new', async (req, res) => {

    const db = await connectToDB();

    res.render('event/new', { });
 
});

router.post('/event/new', async (req, res) => {
  try {
    const db = await connectToDB();

    const hongKongTimezone = 'Asia/Hong_Kong';
    var currentDateTime = moment().tz(hongKongTimezone).format('MM/DD/YYYY HH:MM');
    console.log(`currentDateTime: '${currentDateTime}'`);

    const addEventData = {
      EventTitle: req.body.EventTitle,
      Organizer: req.body.Organizer,
      Description: req.body.Description,
      DateTime: req.body.DateTime,
      Highlight: req.body.Highlight === 'on',
      CreateAt:currentDateTime,
      ModifiedAt: currentDateTime,
      Location: req.body.Location,
      Quota: req.body.Quota,
      Image: req.body.Image,
    };

    const result = await db.collection('event').insertOne(addEventData);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/event/delete/:id', async (req, res) => {
  try {
    const db = await connectToDB();

    const result = await db.collection('event').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Event deleted' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/event/detail/:id', async (req, res) => {
  try {
    const db = await connectToDB();

    const result = await db.collection('event').findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('event/detail', { event: result });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/event/delete/:id', async (req, res) => {
  try {
    const db = await connectToDB();

    const result = await db.collection('event').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Event deleted' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/event/edit/:id', async (req, res) => {
  try {
    const db = await connectToDB();

    const event = await db.collection('event').findOne({ _id: new ObjectId(req.params.id) });
    if (event) {
      res.render('event/edit', { event });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/event/edit/:id', async (req, res) => {
  try {
    const db = await connectToDB();

    const hongKongTimezone = 'Asia/Hong_Kong';
    var currentDateTime = moment().tz(hongKongTimezone).format('MM/DD/YYYY HH:MM');
    console.log(`currentDateTime: '${currentDateTime}'`);

    const updatedEventData = {
      EventTitle: req.body.EventTitle,
      Organizer: req.body.Organizer,
      DateTime: req.body.DateTime,
      Location: req.body.Location,
      Highlight: req.body.Highlight === 'on',
      Quota: req.body.Quota,
      Image: req.body.Image,
      ModifiedAt: currentDateTime
    };

    const result = await db.collection('event').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedEventData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Event updated' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/becomeVolunteer', async (req, res) => {
  try {
    const db = await connectToDB();

    const volunteerData = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      contact: req.body.contact,
      highlight: req.body.highlight === 'on',
      age: req.body.age,
      remark: req.body.remark
    };

    const result = await db.collection('volunteer').insertOne(volunteerData);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;