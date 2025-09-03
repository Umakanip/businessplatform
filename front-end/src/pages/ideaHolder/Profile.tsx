import React from "react";

const ProfileIdeaHolder: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">My Profile</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" className="w-full border px-3 py-2 rounded-md" defaultValue="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="w-full border px-3 py-2 rounded-md" defaultValue="johndoe@email.com" />
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileIdeaHolder;
