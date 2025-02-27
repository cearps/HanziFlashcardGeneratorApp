import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "~/config/apiConfig";
import { useAuth } from "~/context/AuthContext";

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [loading] = useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // Could also redirect if you want, e.g. <Navigate to="/login" /> in a real app
    return <p>Please log in to view your dashboard.</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Welcome to AnkiCreator
      </h1>
      <p className="text-gray-600 mb-8">
        Create, manage, and export flashcards for Anki
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Flashcards Card */}
        <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center">
          <div className="text-4xl mb-2 text-gray-500">+</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Create Flashcards
          </h2>
          <p className="text-gray-500 mb-4">
            Create individual cards or batch import from word lists
          </p>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Start Creating
          </button>
        </div>

        {/* My Collections Card */}
        <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center">
          <div className="text-4xl mb-2 text-gray-500">📚</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            My Collections
          </h2>
          <p className="text-gray-500 mb-4">
            View and manage your flashcard collections
          </p>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            View Collections
          </button>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Recent Activity
          </h2>
          <p className="text-gray-500 mb-4">
            A quick look at your latest actions
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Imported 20 words into “Spanish Deck”</li>
            <li>Created a new deck “Japanese Kanji”</li>
            <li>Edited a card in “French Verbs”</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
