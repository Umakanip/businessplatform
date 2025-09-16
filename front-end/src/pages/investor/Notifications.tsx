// @/components/Notifications.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";

type ConnectionRequestType = {
  id: number;
  sender: {
    id: number;
    name: string;
    email: string;
    category: string;
    profileImage: string | null;
  };
};

const Notifications: React.FC = () => {
  const [invites, setInvites] = useState<ConnectionRequestType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/connections/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvites(res.data);
    } catch (error) {
      console.error("Error fetching invites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleRespond = async (requestId: number, action: "accept" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        "/connections/respond",
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        title: action === "accept" ? "Accepted ✅" : "Rejected 🚫",
        text:
          res.data.message ||
          (action === "accept"
            ? "Connection accepted successfully!"
            : "Invite rejected."),
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background:
          action === "accept"
            ? "linear-gradient(135deg, #d0fceaff, #8db3f0ff)"
            : "linear-gradient(135deg, #FCA5A5, #e7bcbcff)",
        color: "#fff",
      });

      setInvites(invites.filter((invite) => invite.id !== requestId));
    } catch (error: any) {
      Swal.fire({
        title: "Error ⚠️",
        text: error.response?.data?.message || "Error responding to invite",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: "linear-gradient(135deg, #FDE68A, #e29f2aff)",
        color: "#000",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-400">Loading invites...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 rounded-3xl shadow-2xl p-8 mt-18">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Invites received ({invites.length})
        </h2>
        <button className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:underline transition-all duration-300">
          Show all
        </button>
      </div>

      <div className="space-y-6">
        {invites.length === 0 ? (
          <p className="text-gray-400 text-center">No new invites.</p>
        ) : (
          invites.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-4 bg-gray-800 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {/* ✅ Profile Image or First Letter Fallback */}
              {item.sender.profileImage ? (
                <img
                  src={`http://localhost:5000/uploads/${item.sender.profileImage}`}
                  alt={item.sender.name}
                  className="w-16 h-16 rounded-full border-2 border-purple-500 object-cover mr-6 shadow-inner"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-purple-500 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mr-6 shadow-inner">
                  {item.sender.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-200">
                  {item.sender.name}
                  <span className="font-normal text-gray-400 block text-sm mt-0.5">
                    {item.sender.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleRespond(item.id, "reject")}
                  className="px-5 py-2 rounded-full bg-gray-700 text-gray-400 font-medium transition hover:bg-gray-600 hover:text-gray-200"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleRespond(item.id, "accept")}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition hover:from-blue-700 hover:to-purple-700 shadow-lg ml-1"
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
