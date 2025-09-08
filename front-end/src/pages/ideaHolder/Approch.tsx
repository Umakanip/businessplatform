// @/pages/ideaHolder/IhApproch.tsx
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
import Swal from "sweetalert2";

type Profile = {
  id: number;
  name: string;
  email: string;
  category: string[];
  profileImage: string | null;
  status?: "pending" | "accepted" | "rejected" | "none";
};
type ProfileDetail = Profile & {
  primaryPhone?: string;
  secondaryPhone?: string;
  role?: string;
};

const IhApproch: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [allowedIds, setAllowedIds] = useState<number[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]); // track expanded profiles

  // helper → mask email
  const maskEmail = (email: string): string => {
    const [user, domain] = email.split("@");
    if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
    const visible = user.slice(-2);
    return "*".repeat(user.length - 2) + visible + "@" + domain;
  };

  // helper → mask phone
  const maskPhone = (phone: string | undefined): string => {
    if (!phone) return "-";
    if (phone.length <= 4) return "*".repeat(phone.length);
    const visible = phone.slice(-4);
    return "*".repeat(phone.length - 4) + visible;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch investors
        const res = await axiosInstance.get("/idealogists/matching-investors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allProfiles: Profile[] = res.data.investors || [];

        // ✅ Fetch subscription
        const subRes = await axiosInstance.get("/subscriptions/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const subscription = subRes.data;
        let allowedCount = 0;
        const total = allProfiles.length;

        if (subscription?.active) {
          if (subscription.plan === "lite") {
            allowedCount = Math.ceil(total * 0.3); // 30%
          } else if (subscription.plan === "standard") {
            allowedCount = Math.ceil(total * 0.6); // 60%
          } else if (subscription.plan === "premium") {
            allowedCount = total; // unlimited
          }
        } else {
          allowedCount = 0;
        }

        allowedCount = Math.max(1, allowedCount);
        const allowed = allProfiles.slice(0, allowedCount).map((p) => p.id);

        setProfiles(allProfiles);
        setAllowedIds(allowed);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch investors or subscription.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewProfile = (id: number) => {
    try {
      const profile = profiles.find((p) => p.id === id);
      if (profile) {
        setSelectedProfile(profile);
        setShowModal(true);
      } else {
        throw new Error("Profile not found");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Unable to fetch profile details.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  // toggle category view
  const toggleCategoryView = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <p className="text-center py-10">Loading suggestions...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 pt-8">
        <h1 className="text-2xl font-bold text-gray-800">
          More suggestions for you
        </h1>
        <p className="text-gray-500 text-sm">
          Total {profiles.length} profiles available
        </p>
      </div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {profiles.map((profile) => {
          const isExpanded = expandedCategories.includes(profile.id);
          const categoriesToShow = isExpanded
            ? profile.category
            : profile.category.slice(0, 2);

          return (
            <div
              key={profile.id}
              className="relative bg-white rounded-2xl shadow-lg px-6 py-6 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-[240px] h-[340px] mx-auto"
            >
              {/* Background Gradient Circle */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>

              <div className="flex flex-col items-center z-10 relative h-full justify-between">
                <div className="flex flex-col items-center">
                  <img
                    src={
                      profile.profileImage
                        ? `http://localhost:5000/uploads/${profile.profileImage}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white shadow-lg"
                  />
                  <h3 className="text-md font-semibold text-gray-900 text-center">
                    {profile.name}
                  </h3>

                  {/* Category Section with toggle */}
                  <div className="flex flex-wrap justify-center gap-1 mt-2 mb-3 max-h-[60px] overflow-hidden">
                    {categoriesToShow.map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  {profile.category.length > 2 && (
                    <button
                      onClick={() => toggleCategoryView(profile.id)}
                      className="text-xs text-indigo-600 font-semibold hover:underline mb-2"
                    >
                      {isExpanded ? "View Less" : "View More"}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-4 w-full">
                  <button
                    onClick={() => handleViewProfile(profile.id)}
                    className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gray-200 hover:bg-gray-300"
                  >
                    View Profile
                  </button>
                </div>

                {/* ✅ Status Buttons */}
                {profile.status === "accepted" ? (
                  <button
                    disabled
                    className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-2"
                  >
                    Connected
                  </button>
                ) : profile.status === "pending" ? (
                  <button
                    disabled
                    className="w-full font-semibold py-2 rounded-full shadow text-sm bg-yellow-300 mt-2"
                  >
                    Pending...
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await axiosInstance.post(
                          "/connections/send",
                          { receiverId: profile.id },
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );

                        await Swal.fire({
                          title: "Request Sent!",
                          text: "Connection request sent successfully.",
                          icon: "success",
                          position: "center",
                          showConfirmButton: false,
                          timer: 2000,
                          timerProgressBar: true,
                          background: "#f0f9ff",
                        });

                        setProfiles((prev) =>
                          prev.map((p) =>
                            p.id === profile.id
                              ? { ...p, status: "pending" }
                              : p
                          )
                        );
                      } catch (err) {
                        Swal.fire({
                          title: "Error",
                          text: "Unable to send request.",
                          icon: "error",
                          position: "center",
                          confirmButtonColor: "#d33",
                          background: "#fff5f5",
                        });
                      }
                    }}
                    className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-2"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <img
                src={
                  selectedProfile.profileImage
                    ? `http://localhost:5000/uploads/${selectedProfile.profileImage}`
                    : "https://via.placeholder.com/100"
                }
                alt={selectedProfile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto shadow-lg"
              />
              <h2 className="text-2xl font-bold text-white mt-4">
                {selectedProfile.name}
              </h2>
              <p className="text-indigo-100">{selectedProfile.role}</p>
              <p className="text-indigo-200 text-sm">
                {selectedProfile.category.join(", ")}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                <span className="font-medium">Email:</span>
                <span>
                  {allowedIds.includes(selectedProfile.id)
                    ? selectedProfile.email
                    : maskEmail(selectedProfile.email)}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FontAwesomeIcon icon={faPhone} className="text-green-600" />
                <span className="font-medium">Primary Phone:</span>
                <span>
                  {allowedIds.includes(selectedProfile.id)
                    ? selectedProfile.primaryPhone || "-"
                    : maskPhone(selectedProfile.primaryPhone)}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
                <span className="font-medium">Secondary Phone:</span>
                <span>
                  {allowedIds.includes(selectedProfile.id)
                    ? selectedProfile.secondaryPhone || "-"
                    : maskPhone(selectedProfile.secondaryPhone)}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FontAwesomeIcon icon={faUserTag} className="text-orange-600" />
                <span className="font-medium">Role:</span>
                <span>{selectedProfile.role || "-"}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  className="text-pink-600"
                />
                <span className="font-medium">Category:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProfile.category.map((cat) => (
                    <span
                      key={cat}
                      className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IhApproch;
