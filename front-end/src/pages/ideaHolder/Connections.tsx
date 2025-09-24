import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUserTag,
  faLayerGroup,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

type ConnectionType = {
  id: number;
  name: string;
  category: string;
  profileImage: string | null;
  status: string;
};

type ProfileDetail = ConnectionType & {
  email?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  role?: string;
};

// ✅ Avatar Component
const AvatarWithFirstLetter: React.FC<{ name: string; profileImage: string | null; size?: number }> = ({ name, profileImage, size = 80 }) => {
  const getFirstLetter = (name: string) => name ? name.charAt(0).toUpperCase() : "";
  const dimension = `${size}px`;

  if (profileImage) {
    return (
      <img
        src={`http://localhost:5000/uploads/${profileImage}`}
        alt={name}
        style={{ width: dimension, height: dimension }}
        className="rounded-full object-cover border-2 border-purple-200 shadow-sm"
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="rounded-full flex items-center justify-center border-2 border-purple-200 shadow-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
    >
      <span className="text-xl sm:text-lg xs:text-base">{getFirstLetter(name)}</span>
    </div>
  );
};

const Connections: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/connections/connections/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(res.data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleViewProfile = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/auth/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProfile(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 xs:py-6">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-2xl xs:text-xl font-bold text-gray-900 mb-8 text-center">
        My <span className="text-purple-600">Connections</span>
      </h1>

      {connections.length === 0 ? (
        <p className="text-center text-gray-500 text-lg sm:text-base xs:text-sm">
          You don’t have any connections yet.
        </p>
      ) : (
        <div className="space-y-4 xs:space-y-3">
          {connections.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row items-center sm:items-start bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 xs:p-3"
            >
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <AvatarWithFirstLetter name={c.name} profileImage={c.profileImage} size={64} />
                <span
                  className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                    c.status === "connected" ? "bg-green-500" : "bg-yellow-400"
                  }`}
                  title={c.status}
                ></span>
              </div>

              {/* Details */}
              <div className="ml-4 sm:ml-6 mt-3 sm:mt-0 flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-base xs:text-sm font-semibold text-gray-900">{c.name}</h2>
                <p className="text-sm sm:text-xs xs:text-[10px] text-gray-500">{c.category}</p>

                <span
                  className={`inline-block mt-2 px-2 py-1 rounded-full text-xs sm:text-[10px] xs:text-[9px] font-medium ${
                    c.status === "connected"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex mt-3 sm:mt-0 gap-2">
                <button
                  onClick={() => handleViewProfile(c.id)}
                  className="px-3 py-1 xs:px-2 xs:py-1 rounded-lg text-sm xs:text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 xs:p-2">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative xs:p-4">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg xs:text-base"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <AvatarWithFirstLetter name={selectedProfile.name} profileImage={selectedProfile.profileImage} size={80} />
              <h2 className="text-2xl xs:text-xl font-bold text-white mt-3">{selectedProfile.name}</h2>
              <p className="text-indigo-100 text-sm xs:text-[10px]">{selectedProfile.role}</p>
              <p className="text-indigo-200 text-xs xs:text-[9px]">{selectedProfile.category}</p>
            </div>

            {/* Body */}
            <div className="p-5 xs:p-3 space-y-3 text-sm xs:text-xs">
              <div className="flex items-center space-x-2 xs:space-x-1 text-gray-700">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                <span className="font-medium">Email:</span>
                <span>{selectedProfile.email || "-"}</span>
              </div>
              <div className="flex items-center space-x-2 xs:space-x-1 text-gray-700">
                <FontAwesomeIcon icon={faPhone} className="text-green-600" />
                <span className="font-medium">Primary Phone:</span>
                <span>{selectedProfile.primaryPhone || "-"}</span>
              </div>
              <div className="flex items-center space-x-2 xs:space-x-1 text-gray-700">
                <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
                <span className="font-medium">Secondary Phone:</span>
                <span>{selectedProfile.secondaryPhone || "-"}</span>
              </div>
              <div className="flex items-center space-x-2 xs:space-x-1 text-gray-700">
                <FontAwesomeIcon icon={faUserTag} className="text-orange-600" />
                <span className="font-medium">Role:</span>
                <span>{selectedProfile.role || "-"}</span>
              </div>
              <div className="flex items-center space-x-2 xs:space-x-1 text-gray-700">
                <FontAwesomeIcon icon={faLayerGroup} className="text-pink-600" />
                <span className="font-medium">Category:</span>
                <span>{selectedProfile.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
