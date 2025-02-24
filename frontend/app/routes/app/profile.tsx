import React from "react";
import { useAuth } from "~/context/AuthContext";

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in or user is null, you might redirect or show a message.
  if (!user) {
    return <p>You must be logged in to view your profile.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="mb-4">
        <strong>Username: </strong>
        <span>{user.username}</span>
      </div>
      <div className="mb-4">
        <strong>Email: </strong>
        <span>{user.email}</span>
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Profile;
