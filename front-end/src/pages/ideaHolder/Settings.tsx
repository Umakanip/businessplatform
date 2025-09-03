import React from "react";

const Settings: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Settings</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Change Password</label>
          <input type="password" placeholder="New Password" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Notifications</label>
          <select className="w-full border px-3 py-2 rounded">
            <option>Email</option>
            <option>SMS</option>
            <option>Both</option>
          </select>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Update Settings</button>
      </form>
    </div>
  );
};

export default Settings;
