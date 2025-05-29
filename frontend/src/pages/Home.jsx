import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NoteModal from "../components/NoteModal";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import NoteCard from "../components/NoteCard";
import {toast} from 'react-toastify';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [query, setQuery] = useState("");
  const {login} = useAuth()

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/note", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(data.notes);
      console.log(data);
      login(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    setFilteredNotes(
      notes.filter((note) =>
        note.title.toLowerCase().includes(query.toLowerCase())
      ) ||
        notes.filter((note) =>
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
        "http://localhost:3000/api/note/add",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        `http://localhost:3000/api/note/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        `http://localhost:3000/api/note/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <div className="bg-gray-100 min-h-screen">
      <Navbar setQuery={setQuery} />

      <div className="px-8 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, idx) => (
            <NoteCard
              key={idx}
              note={note}
              onEdit={onEdit}
              deleteNote={deleteNote}
            />
          ))
        ) : (
          <p>No Notes</p>
        )}
      </div>

      {user && (
        <button
          onClick={handleClick}
          className="fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full"
        >
          +
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
