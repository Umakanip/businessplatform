import React from "react";

const ProfileInv: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-green-700 mb-4">My Profile</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" defaultValue="Investor Name" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" defaultValue="investor@email.com" className="w-full border px-3 py-2 rounded" />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default ProfileInv;
