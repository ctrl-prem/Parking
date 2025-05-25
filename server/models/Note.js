import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // use to make User's _id a foreign key to create connection b/w this collection and User collection(table).
});

const Note = mongoose.model('Note', NoteSchema);
export default Note;