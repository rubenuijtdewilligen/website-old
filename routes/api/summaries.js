// Bring in Node modules
const express = require('express');

// Initialize Express router
const router = express.Router();

// Bring in Mongoose models
const Subject = require('../../models/Subject');
const { shouldBeAuthenticated, shouldBeAdministrator } = require('../../util/authentication');

// Routes
router.post('/add_subject', shouldBeAdministrator, async (req, res) => {
  if (await Subject.findOne({ name: req.body.name })) return res.status(403).json({ error: 'A subject with this name already exists.' });

  const subject = new Subject({
    name: req.body.name,
  });

  try {
    const savedSubject = await subject.save();
    return res.status(200).json({ subjectId: savedSubject._id });
  } catch (error) {
    res.status(500).json({ error: 'An unknown error has occurred on the server.' });
    return console.log(error);
  }
});

router.get('/subjects', async (req, res) => {
  try {
    const subject = await Subject.find();
    let subjects = [];

    subject.forEach((element) => {
      subjects.push(element.name);
    });

    return res.status(200).send(subjects);
  } catch (error) {
    res.status(500).json({ error: 'An unknown error has occurred on the server.' });
    return console.log(error);
  }
});

router.post('/add_chapter', shouldBeAdministrator, async (req, res) => {
  if (!(await Subject.findOne({ name: req.body.subject }))) return res.status(400).json({ error: 'The provided subject does not exist.' });

  try {
    const subject = await Subject.findOne({ name: req.body.subject });
    let array = subject.summaries;

    const chapter = {
      number: array.length + 1,
      name: req.body.name,
      summaries: [],
    };

    array.push(chapter);

    await Subject.findOneAndUpdate({ name: req.body.subject }, { summaries: array });
    return res.status(200).json({ message: 'Added chapter to database.' });
  } catch (error) {
    res.status(500).json({ error: 'An unknown error has occurred on the server.' });
    return console.log(error);
  }
});

router.post('/chapters', async (req, res) => {
  if (!(await Subject.findOne({ name: req.body.subject }))) return res.status(400).json({ error: 'The requested subject does not exist.' });

  try {
    const subject = await Subject.findOne({ name: req.body.subject });
    let array = subject.summaries;
    let chapters = [];

    array.forEach((chapter) => {
      chapters.push(`Hoofdstuk ${chapter.number}: ${chapter.name}`);
    });

    return res.status(200).send(chapters);
  } catch (error) {
    res.status(500).json({ error: 'An unknown error has occurred on the server.' });
    return console.log(error);
  }
});

router.post('/add_summary', shouldBeAdministrator, async (req, res) => {
  if (!(await Subject.findOne({ name: req.body.subject }))) return res.status(400).json({ error: 'The provided subject does not exist.' });

  const subject = await Subject.findOne({ name: req.body.subject });
  const arrayIndex = req.body.chapter - 1;
  let chapterArray = subject.summaries[arrayIndex];
  let summariesArray = chapterArray.summaries;

  if (req.body.chapter > chapterArray.length) return res.status(400).json({ error: 'The provided chapter does not exist.' });

  try {
    const summary = {
      number: summariesArray.length + 1,
      name: req.body.name,
      content: req.body.content,
    };

    summariesArray.push(summary);
    chapterArray.summaries = summariesArray;

    await Subject.findOneAndUpdate({ name: req.body.subject }, { summaries: chapterArray });
    return res.status(200).json({ message: 'Added summary to database.' });
  } catch (error) {
    res.status(500).json({ error: 'An unknown error has occurred on the server.' });
    return console.log(error);
  }
});

// Export the magic
module.exports = router;
