import express from "express";
import Note from '../models/Note.js';
import middleware from "../middleware/middleware.js";

const router = express.Router();

router.post('/add', middleware , async (req, res) => {
    try {
    const { title, description } = req.body;

    // Create a new note instance
    const newNote = new Note({
      title,
      description,
      userId: req.user.id
    });

    // Save the new Note
    await newNote.save();

    // Send success response
    return res
      .status(200)
      .json({ success: true, message: "Note Created Successfully" });
  } catch (err) {
    console.log(err);
    // Catch errors and send failure response
    return res
      .status(500)
      .json({ success: false, message: "Error In Adding Note" });
  }
});

router.get('/', middleware, async (req, res) => {
    try{
        const notes = await Note.find({userId: req.user.id});
        return res.status(200).json({success: true, notes});
    }
    catch(error){
        return res.status(500).json({success: false, message: "Can't Retrieve Data"});
    }
})

router.put('/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const updateNote = await Note.findByIdAndUpdate(id, req.body);
    return res.status(200).json({success: true, updateNote});
  }
  catch(error){
    return res.status(500).json({success: false, message: "Can't Update Note"})
  }
})

router.delete('/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const updateNotes = await Note.findByIdAndDelete(id);
    return res.status(200).json({success: true, updateNotes});
  }
  catch(error){
    return res.status(500).json({success: false, message: "Can't Delete Note"})
  }
})

export default router;