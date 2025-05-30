import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const NoteCard = ({ note, onEdit, deleteNote }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 mt-4 flex flex-col">
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {note.title}
        </h2>
        <p className="text-gray-600 mb-4">{note.description}</p>
      </div>

      <div className="flex justify-end space-x-3 mt-auto">
        <button
          className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 p-3 rounded-full shadow-md hover:shadow-lg transition-colors duration-300 cursor-pointer"
          onClick={() => onEdit(note)}
          aria-label="Edit Note"
        >
          <FaEdit size={18} />
        </button>

        <button
          className="text-red-600 hover:text-white bg-red-100 hover:bg-red-600 p-3 rounded-full shadow-md hover:shadow-lg transition-colors duration-300 cursor-pointer"
          onClick={() => deleteNote(note._id)}
          aria-label="Delete Note"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
