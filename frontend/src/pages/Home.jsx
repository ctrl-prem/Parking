import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NoteModal from "../components/NoteModal";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = () => setIsModalOpen((prev) => !prev);
  const { user } = useAuth();
  const closeModal = () => {
    setIsModalOpen(prev => !prev);
  }

  const addNote = async (title, description) => {
    try {
        const response = await axios.post(
          "http://localhost:3000/api/note/add",
          { title, description }
        );
        console.log(response);
        if(response.data.success){
          closeModal();
        }
      } catch (err) {console.log(err)};
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {user && (
        <button
          onClick={handleClick}
          className="fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full"
        >
          +
        </button>
      )}

      {isModalOpen && <NoteModal closeModal = {closeModal} addNote = {addNote} />}
    </div>
  );
}

export default Home;
