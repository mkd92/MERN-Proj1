const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Note = require("../models/Note");

//@desc Get all Notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  //Get Notes from MDB
  const notes = await Note.find().lean();
  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: "Notes not found" });
  }
  // Add username to each note before sending the response
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );
  res.json(notesWithUser);
});
//@desc create a note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;
  // confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  // check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate title found" });
  }
  // create and store new note
  const note = await Note.create({ user, title, text });
  if (note) {
    //created
    res.status(201).json({ message: "New Note created" });
  } else {
    res.status(400).json({ message: "Invalid Note data received" });
  }
});
//@desc Update a Note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  // confirm note exists to update
  const note = await Note.findById({ id }).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();
  // allow renaming of original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }
  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;
  const updatedNote = await note.save();
  res.json(`${updatedNote.title} is updated`);
});
//@desc Delete a Note
// @route GET /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // confirm data
  if (!id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // confirm note exists to delete
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }
  const result = await note.deleteOne();
  const reply = `Note ${result.title} with ID ${result.id} deleted`;
  res.json(reply);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
