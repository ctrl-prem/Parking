import React, { useEffect, useState } from "react";

function NoteModal({ closeModal, addNote, currentNote, editNote }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDescription(currentNote.description);
    }
  }, [currentNote]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentNote) {
      editNote(currentNote._id, title, description);
    } else {
      addNote(title, description);
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {currentNote ? "Edit Note" : "Add New Note"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Note's Description"
            className="border border-gray-300 rounded-md p-3 w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-300 cursor-pointer"
          >
            {currentNote ? "Update" : "Add Note"}
          </button>
        </form>

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-300 font-semibold cursor-pointer"
          onClick={closeModal}
          aria-label="Close modal"
        >
          ✕
        </button>

        <button
          className="mt-4 text-center w-full text-red-600 hover:text-red-700 font-semibold transition duration-300 cursor-pointer"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default NoteModal;
