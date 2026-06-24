const Timetable = require('../models/Timetable');

// @desc Get timetable for logged-in user
// @route GET /api/timetable
const getTimetable = async (req, res, next) => {
  try {
    const entries = await Timetable.find({ user: req.user._id }).sort({ startTime: 1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

// @desc Create a timetable entry
// @route POST /api/timetable
const createTimetableEntry = async (req, res, next) => {
  try {
    const { day, subject, startTime, endTime, room, faculty } = req.body;
    if (!day || !subject || !startTime || !endTime) {
      return res.status(400).json({ message: 'Day, subject, startTime and endTime are required' });
    }

    const entry = await Timetable.create({
      user: req.user._id,
      day,
      subject,
      startTime,
      endTime,
      room,
      faculty,
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// @desc Update a timetable entry
// @route PUT /api/timetable/:id
const updateTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    Object.assign(entry, req.body);
    const updated = await entry.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a timetable entry
// @route DELETE /api/timetable/:id
const deleteTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry removed', _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry };
