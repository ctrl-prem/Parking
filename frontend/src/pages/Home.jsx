import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NoteModal from "../components/NoteModal";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import NoteCard from "../components/NoteCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import notesImg from "../assets/notes.svg";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/note`, {
        headers: {
          Authorization: token ? `Bearer ${localStorage.getItem("token")}` : undefined,
        },
      });
      setNotes(data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, notes]);

  const handleClick = () => setIsModalOpen((prev) => !prev);
  const { user } = useAuth();
  const closeModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const addNote = async (title, description) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/add`,
        { title, description },
        {
          headers: {
            Authorization: token ? `Bearer ${localStorage.getItem("token")}` : undefined,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        closeModal();
        fetchNotes();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${localStorage.getItem("token")}` : undefined,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success("Note Deleted");
        fetchNotes();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editNote = async (id, title, description) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/${id}`,
        { title, description },
        {
          headers: {
            Authorization: token ? `Bearer ${localStorage.getItem("token")}` : undefined,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        closeModal();
        fetchNotes();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onEdit = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 min-h-screen">
      <Navbar setQuery={setQuery} />
      <div className="px-8 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {user && filteredNotes.length > 0 ? (
          filteredNotes.map((note, idx) => (
            <NoteCard
              key={idx}
              note={note}
              onEdit={onEdit}
              deleteNote={deleteNote}
            />
          ))
        ) : (
          // Cool Empty State
          <div className="col-span-full flex flex-col items-center mt-20 text-center">
            <img
              src={notesImg}
              alt="No Notes"
              className="w-60 mb-6 opacity-90"
            />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Notes Yet
            </h2>
            <p className="text-gray-500 mb-4">
              You haven't created any notes yet. Let’s get started!
            </p>
            <button
              onClick={() => {
                if (user) {
                  handleClick(); // open modal
                } else {
                  navigate("/login"); // redirect to login
                }
              }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              + Create Your First Note
            </button>
          </div>
        )}
      </div>
      {user && filteredNotes.length > 0 && (
        <button
          onClick={handleClick}
          className="fixed right-4 bottom-4 text-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-xl transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:from-teal-600 hover:to-teal-700 cursor-pointer"
        >
          + Add Note
        </button>
      )}
      {isModalOpen && (
        <NoteModal
          closeModal={closeModal}
          addNote={addNote}
          currentNote={currentNote}
          editNote={editNote}
        />
      )}
    </div>
  );
}

export default Home;
