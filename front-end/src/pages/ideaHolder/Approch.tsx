
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUserTag,
  faLayerGroup,
  faTimes,
  faLock,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
  bio?: string;
};

const IhApproch: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [allowedIds, setAllowedIds] = useState<number[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const navigate = useNavigate();

  // mask helpers (keep as is)
  const maskEmail = (email: string): string => {
    const [user, domain] = email.split("@");
    if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
    const visible = user.slice(-2);
    return "*".repeat(user.length - 2) + visible + "@" + domain;
  };

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

        // profiles
        const res = await axiosInstance.get("/idealogists/matching-investors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allProfiles: Profile[] = res.data.investors || [];

        // subscription
        const subRes = await axiosInstance.get("/subscriptions/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sub = subRes.data;
        setSubscription(sub);

       // Set premium user status
        setIsPremiumUser(sub?.active && sub.plan === "premium");

        let allowedCount = 0;
        const total = allProfiles.length;

        if (sub?.active) {
          if (sub.plan === "lite") {
            allowedCount = Math.ceil(total * 0.3);
          } else if (sub.plan === "standard") {
            allowedCount = Math.ceil(total * 0.6);
          } else if (sub.plan === "premium") {
            allowedCount = total;
          }
        } else {
          allowedCount = 0;
        }

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
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      setSelectedProfile(profile);
      setShowModal(true);
    }
  };

  // ✅ New component to render first letter instead of image
  const AvatarWithFirstLetter = ({ name, isLocked }: { name: string; isLocked: boolean }) => {
    const getFirstLetter = (name: string) => {
      return name ? name.charAt(0).toUpperCase() : "U";
    };

    const commonClasses = `w-24 h-24 rounded-full flex items-center justify-center border-4 border-white mx-auto shadow-lg transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-4xl font-bold`;

    return (
      <div className={`${commonClasses} ${isLocked ? "blur-md" : ""}`}>
        {getFirstLetter(name)}
      </div>
    );
  };

  if (loading) {
    return <p className="text-center py-10">Loading suggestions...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 pt-8">
        <h1 className="text-2xl font-bold text-gray-800">
          More suggestions for you
        </h1>
        <p className="text-gray-500 text-sm">
          Total {profiles.length} profiles available
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {profiles.map((profile) => {
          // show only first 2 categories, rest hidden with "+more"
          const categoriesToShow = profile.category.slice(0, 2);
          const isLocked = !allowedIds.includes(profile.id);

          return (
            <div
              key={profile.id}
              className="relative bg-white rounded-2xl shadow-lg px-6 py-6 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:shadow-2xl w-[240px] h-[340px] mx-auto"
            >
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>

              {/* Crown Icon for Premium Users */}
              {isPremiumUser && (
                <div className="absolute top-2 right-2 text-yellow-500 z-10">
                  <FontAwesomeIcon
                    icon={faCrown}
                    size="2x"
                    className="text-xl shadow-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                  />
                </div>
              )}

              <div className="flex flex-col items-center relative h-full justify-between">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {profile.profileImage ? (
                      <img
                        src={`http://localhost:5000/uploads/${profile.profileImage}`}
                        alt={profile.name}
                        className={`w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white shadow-lg transition-all duration-500 ${
                          isLocked ? "blur-md" : ""
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ring-2 ring-white shadow-lg transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-[Pacifico] ${
                          isLocked ? "blur-md" : ""
                        }`}
                      >
                        {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    {isLocked && (
                      <div className="mb-4 absolute inset-0 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="text-white text-lg"
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 text-center">
                    {profile.name}
                  </h3>

                  {/* Categories */}
                  <div className="flex flex-wrap justify-center gap-1 mt-2 mb-3">
                    {categoriesToShow.map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}

                    {profile.category.length > 2 && (
                      <button
                        onClick={() => handleViewProfile(profile.id)}
                        className="text-xs text-indigo-600 font-semibold hover:underline"
                      >
                        ..more
                      </button>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 mt-4 w-full">
                  <button
                    onClick={() => handleViewProfile(profile.id)}
                    className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gray-200 hover:bg-gray-300"
                  >
                    View Profile
                  </button>
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
                      disabled={isLocked}
                      onClick={async () => {
                        if (isLocked) {
                          await Swal.fire({
                            title: "Access Denied",
                            text: "You need to upgrade your subscription to connect with more profiles.",
                            icon: "info",
                            showCancelButton: true,
                            confirmButtonText: "Upgrade",
                            confirmButtonColor: "#8b5cf6",
                            cancelButtonText: "Close",
                            cancelButtonColor: "#d33",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              navigate("/subscription");
                            }
                          });
                          return;
                        }
                        try {
                          await axiosInstance.post(
                            "/connections/send",
                            { receiverId: profile.id },
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                              p.id === profile.id ? { ...p, status: "pending" } : p
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
                      className={`w-full font-semibold py-2 rounded-full shadow text-sm mt-2 flex items-center justify-center gap-2 ${
                        isLocked
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-not-allowed "
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <FontAwesomeIcon icon={faLock} />
                          <span>Connect</span>
                        </>
                      ) : (
                        "Connect"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          {!subscription?.active ? (
            // 🔒 Locked Modal
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="relative w-24 h-24 mx-auto">
                  {/* ✅ Profile Image-க்கு பதிலாக முதல் எழுத்து அவதார் */}
                  <AvatarWithFirstLetter
                    name={selectedProfile.name}
                    isLocked={!allowedIds.includes(selectedProfile.id)}
                  />
                  {!allowedIds.includes(selectedProfile.id) && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-white text-lg"
                      />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mt-4">
                  {selectedProfile.name}
                </h2>
                <p className="text-indigo-100">{selectedProfile.role}</p>
                <p className="text-indigo-200 text-sm">
                  {selectedProfile.category.join(", ")}
                </p>
              </div>

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
                  <FontAwesomeIcon
                    icon={faUserTag}
                    className="text-orange-600"
                  />
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
{/* ✅ Bio as separate block */}
<div className="flex items-start space-x-3 text-gray-700 mt-3">
  <FontAwesomeIcon icon={faUserTag} className="text-green-600 mt-1" />
  <div>
    <span className="font-medium block">Bio:</span>
    {allowedIds.includes(selectedProfile.id) ? (
      <p className="text-sm text-gray-800 mt-1">
        {selectedProfile.bio || "No bio available"}
      </p>
    ) : (
      <p className="text-sm text-gray-500 italic mt-1">
        Subscribe to view full bio
      </p>
    )}
  </div>
</div>

              {/* View Plans button separate */}
              {!allowedIds.includes(selectedProfile.id) && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/subscription")}
                    className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow hover:opacity-90"
                  >
                    View Plans
                  </button>
                </div>
              )}
              </div>
            </div>
          ) : (
            // ✅ Normal Profile Details
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="relative w-24 h-24 mx-auto">
                  {/* ✅ Profile Image-க்கு பதிலாக முதல் எழுத்து அவதார் */}
                  <AvatarWithFirstLetter
                    name={selectedProfile.name}
                    isLocked={!allowedIds.includes(selectedProfile.id)}
                  />
                  {!allowedIds.includes(selectedProfile.id) && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-white text-lg"
                      />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mt-4">
                  {selectedProfile.name}
                </h2>
                <p className="text-indigo-100">{selectedProfile.role}</p>
                <p className="text-indigo-200 text-sm">
                  {selectedProfile.category.join(", ")}
                </p>
              </div>

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
                  <FontAwesomeIcon
                    icon={faUserTag}
                    className="text-orange-600"
                  />
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
              {/* ✅ Bio as separate block */}
<div className="flex items-center space-x-3 text-gray-700">
  <FontAwesomeIcon icon={faUserTag} className="text-green-600 mt-1" />
  <div>
    <span className="font-medium block">Bio:</span>
      <p className="text-sm text-gray-800 mt-1">
        {selectedProfile.bio || "No bio available"}
      </p>
    
  </div>
</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IhApproch;



// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEnvelope,
//   faPhone,
//   faUserTag,
//   faLayerGroup,
//   faTimes,
//   faLock,
//   faCrown,
// } from "@fortawesome/free-solid-svg-icons";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

// type Profile = {
//   id: number;
//   name: string;
//   email: string;
//   category: string[];
//   profileImage: string | null;
//   status?: "pending" | "accepted" | "rejected" | "none";
// };
// type ProfileDetail = Profile & {
//   primaryPhone?: string;
//   secondaryPhone?: string;
//   role?: string;
// };

// const IhApproch: React.FC = () => {
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(
//     null
//   );
//   const [showModal, setShowModal] = useState(false);
//   const [allowedIds, setAllowedIds] = useState<number[]>([]);
//   const [subscription, setSubscription] = useState<any>(null);
//   const [isPremiumUser, setIsPremiumUser] = useState(false);

//   const navigate = useNavigate();

//   // Helper to get the first letter of a name
//   const getFirstLetter = (name: string): string => {
//     return name ? name.charAt(0).toUpperCase() : "";
//   };

//   // mask helpers
//   const maskEmail = (email: string): string => {
//     const [user, domain] = email.split("@");
//     if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
//     const visible = user.slice(-2);
//     return "*".repeat(user.length - 2) + visible + "@" + domain;
//   };

//   const maskPhone = (phone: string | undefined): string => {
//     if (!phone) return "-";
//     if (phone.length <= 4) return "*".repeat(phone.length);
//     const visible = phone.slice(-4);
//     return "*".repeat(phone.length - 4) + visible;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // profiles
//         const res = await axiosInstance.get("/idealogists/matching-investors", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const allProfiles: Profile[] = res.data.investors || [];

//         // subscription
//         const subRes = await axiosInstance.get("/subscriptions/status", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const sub = subRes.data;
//         setSubscription(sub);

//         // Set premium user status
//         setIsPremiumUser(sub?.active && sub.plan === "premium");

//         let allowedCount = 0;
//         const total = allProfiles.length;

//         if (sub?.active) {
//           if (sub.plan === "lite") {
//             allowedCount = Math.ceil(total * 0.3);
//           } else if (sub.plan === "standard") {
//             allowedCount = Math.ceil(total * 0.6);
//           } else if (sub.plan === "premium") {
//             allowedCount = total;
//           }
//         } else {
//           allowedCount = 0;
//         }

//         const allowed = allProfiles.slice(0, allowedCount).map((p) => p.id);

//         setProfiles(allProfiles);
//         setAllowedIds(allowed);
//       } catch (error) {
//         Swal.fire({
//           title: "Error",
//           text: "Failed to fetch investors or subscription.",
//           icon: "error",
//           confirmButtonColor: "#d33",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleViewProfile = (id: number) => {
//     const profile = profiles.find((p) => p.id === id);
//     if (profile) {
//       setSelectedProfile(profile);
//       setShowModal(true);
//     }
//   };

//   if (loading) {
//     return <p className="text-center py-10">Loading suggestions...</p>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8 pt-8">
//         <h1 className="text-2xl font-bold text-gray-800">
//           More suggestions for you
//         </h1>
//         <p className="text-gray-500 text-sm">
//           Total {profiles.length} profiles available
//         </p>
//       </div>

//       {/* Profiles Grid */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//         {profiles.map((profile) => {
//           const isLocked = !allowedIds.includes(profile.id);

//           return (
//             <div
//               key={profile.id}
//               className="relative bg-white rounded-2xl shadow-lg px-6 py-6 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:shadow-2xl w-[240px] h-[340px] mx-auto"
//             >
//               {/* Background Gradient */}
//               <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>

//               {/* Crown Icon for Premium Users */}
//               {isPremiumUser && (
//                 <div className="absolute top-2 right-2 text-yellow-500 z-10">
//                   <FontAwesomeIcon
//                     icon={faCrown}
//                     size="2x"
//                     className="text-xl shadow-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
//                   />
//                 </div>
//               )}

//               <div className="flex flex-col items-center relative h-full justify-between">
//                 <div className="flex flex-col items-center">
//                   <div className="relative">
//                     {profile.profileImage ? (
//                       <img
//                         src={`http://localhost:5000/uploads/${profile.profileImage}`}
//                         alt={profile.name}
//           className={`w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white shadow-lg transition-all duration-500 ${
//                           isLocked ? "blur-md" : ""
//                         }`}
//                       />
//                     ) : (
//                       <div
//           className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ring-2 ring-white shadow-lg transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-[Pacifico] ${
//                           isLocked ? "blur-md" : ""
//                         }`}
//                       >
//                         {getFirstLetter(profile.name)}
//                       </div>
//                     )}
//                     {isLocked && (
//                       <div className="mb-4 absolute inset-0 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
//                         <FontAwesomeIcon
//                           icon={faLock}
//                           className="text-white text-lg"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <h3 className="text-md font-semibold text-gray-900 text-center">
//                     {profile.name}
//                   </h3>

//                   {/* Categories */}
//                   <div className="flex flex-wrap justify-center gap-1 mt-2 mb-3">
//                     {profile.category.slice(0, 2).map((cat) => (
//                       <span
//                         key={cat}
//                         className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
//                       >
//                         {cat}
//                       </span>
//                     ))}
//                     {profile.category.length > 2 && (
//                       <button
//                         onClick={() => handleViewProfile(profile.id)}
//                         className="text-xs text-indigo-600 font-semibold hover:underline"
//                       >
//                         ..more
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="space-y-2 mt-4 w-full">
//                   <button
//                     onClick={() => handleViewProfile(profile.id)}
//                     className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gray-200 hover:bg-gray-300"
//                   >
//                     View Profile
//                   </button>

//                   {profile.status === "accepted" ? (
//                     <button
//                       disabled
//                       className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-2"
//                     >
//                       Connected
//                     </button>
//                   ) : profile.status === "pending" ? (
//                     <button
//                       disabled
//                       className="w-full font-semibold py-2 rounded-full shadow text-sm bg-yellow-300 mt-2"
//                     >
//                       Pending...
//                     </button>
//                   ) : (
//                     <button
//                       disabled={isLocked}
//                       onClick={async () => {
//                         if (isLocked) {
//                           await Swal.fire({
//                             title: "Access Denied",
//                             text: "You need to upgrade your subscription to connect with more profiles.",
//                             icon: "info",
//                             showCancelButton: true,
//                             confirmButtonText: "Upgrade",
//                             confirmButtonColor: "#8b5cf6",
//                             cancelButtonText: "Close",
//                             cancelButtonColor: "#d33",
//                           }).then((result) => {
//                             if (result.isConfirmed) {
//                               navigate("/subscription");
//                             }
//                           });
//                           return;
//                         }
//                         try {
//                           await axiosInstance.post(
//                             "/connections/send",
//                             { receiverId: profile.id },
//                             {
//                               headers: {
//                                 Authorization: `Bearer ${localStorage.getItem(
//                                   "token"
//                                 )}`,
//                               },
//                             }
//                           );

//                           await Swal.fire({
//                             title: "Request Sent!",
//                             text: "Connection request sent successfully.",
//                             icon: "success",
//                             position: "center",
//                             showConfirmButton: false,
//                             timer: 2000,
//                             timerProgressBar: true,
//                             background: "#f0f9ff",
//                           });

//                           setProfiles((prev) =>
//                             prev.map((p) =>
//                               p.id === profile.id
//                                 ? { ...p, status: "pending" }
//                                 : p
//                             )
//                           );
//                         } catch (err) {
//                           Swal.fire({
//                             title: "Error",
//                             text: "Unable to send request.",
//                             icon: "error",
//                             position: "center",
//                             confirmButtonColor: "#d33",
//                             background: "#fff5f5",
//                           });
//                         }
//                       }}
//                       className={`w-full font-semibold py-2 rounded-full shadow text-sm mt-2 flex items-center justify-center gap-2 ${
//                         isLocked
//                           ? "bg-gray-400 text-gray-800 cursor-not-allowed"
//                           : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
//                       }`}
//                     >
//                       {isLocked ? (
//                         <>
//                           <FontAwesomeIcon icon={faLock} />
//                           <span>Connect</span>
//                         </>
//                       ) : (
//                         "Connect"
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Modal */}
//       {showModal && selectedProfile && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           {!subscription?.active ? (
//             // 🔒 Locked Modal
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg"
//                 >
//                   <FontAwesomeIcon icon={faTimes} />
//                 </button>
//                 <div className="relative w-24 h-24 mx-auto">
//                   {selectedProfile.profileImage ? (
//                     <img
//                       src={`http://localhost:5000/uploads/${selectedProfile.profileImage}`}
//                       alt={selectedProfile.name}
//                       className={`w-24 h-24 rounded-full object-cover border-4 border-white mx-auto shadow-lg transition-all duration-500 ${
//                         !allowedIds.includes(selectedProfile.id) ? "blur-md" : ""
//                       }`}
//                     />
//                   ) : (
//                     <div
//                       className={`w-24 h-24 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold text-4xl border-4 border-white mx-auto shadow-lg transition-all duration-500 ${
//                         !allowedIds.includes(selectedProfile.id) ? "blur-md" : ""
//                       }`}
//                     >
//                       {getFirstLetter(selectedProfile.name)}
//                     </div>
//                   )}
//                   {!allowedIds.includes(selectedProfile.id) && (
//                     <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
//                       <FontAwesomeIcon
//                         icon={faLock}
//                         className="text-white text-lg"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <h2 className="text-2xl font-bold text-white mt-4">
//                   {selectedProfile.name}
//                 </h2>
//                 <p className="text-indigo-100">{selectedProfile.role}</p>
//                 <p className="text-indigo-200 text-sm">
//                   {selectedProfile.category.join(", ")}
//                 </p>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
//                   <span className="font-medium">Email:</span>
//                   <span>
//                     {allowedIds.includes(selectedProfile.id)
//                       ? selectedProfile.email
//                       : maskEmail(selectedProfile.email)}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon icon={faPhone} className="text-green-600" />
//                   <span className="font-medium">Primary Phone:</span>
//                   <span>
//                     {allowedIds.includes(selectedProfile.id)
//                       ? selectedProfile.primaryPhone || "-"
//                       : maskPhone(selectedProfile.primaryPhone)}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
//                   <span className="font-medium">Secondary Phone:</span>
//                   <span>
//                     {allowedIds.includes(selectedProfile.id)
//                       ? selectedProfile.secondaryPhone || "-"
//                       : maskPhone(selectedProfile.secondaryPhone)}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon
//                     icon={faUserTag}
//                     className="text-orange-600"
//                   />
//                   <span className="font-medium">Role:</span>
//                   <span>{selectedProfile.role || "-"}</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon
//                     icon={faLayerGroup}
//                     className="text-pink-600"
//                   />
//                   <span className="font-medium">Category:</span>
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {selectedProfile.category.map((cat) => (
//                       <span
//                         key={cat}
//                         className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
//                       >
//                         {cat}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => navigate("/inv/subscription")}
//                   className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow hover:opacity-90"
//                 >
//                   View Plans
//                 </button>
//               </div>
//             </div>
//           ) : (
//             // ✅ Normal Profile Details
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg"
//                 >
//                   <FontAwesomeIcon icon={faTimes} />
//                 </button>
//                 <div className="relative w-24 h-24 mx-auto">
//                   {selectedProfile.profileImage ? (
//                     <img
//                       src={`http://localhost:5000/uploads/${selectedProfile.profileImage}`}
//                       alt={selectedProfile.name}
//                       className={`w-24 h-24 rounded-full object-cover border-4 border-white mx-auto shadow-lg transition-all duration-500 ${
//                         !allowedIds.includes(selectedProfile.id) ? "blur-md" : ""
//                       }`}
//                     />
//                   ) : (
//                     <div
//                       className={`w-24 h-24 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold text-4xl border-4 border-white mx-auto shadow-lg transition-all duration-500 ${
//                         !allowedIds.includes(selectedProfile.id) ? "blur-md" : ""
//                       }`}
//                     >
//                       {getFirstLetter(selectedProfile.name)}
//                     </div>
//                   )}
//                   {!allowedIds.includes(selectedProfile.id) && (
//                     <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
//                       <FontAwesomeIcon
//                         icon={faLock}
//                         className="text-white text-lg"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <h2 className="text-2xl font-bold text-white mt-4">
//                   {selectedProfile.name}
//                 </h2>
//                 <p className="text-indigo-100">{selectedProfile.role}</p>
//                 <p className="text-indigo-200 text-sm">
//                   {selectedProfile.category.join(", ")}
//                 </p>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
//                   <span className="font-medium">Email:</span>
//                   <span>
//                     {allowedIds.includes(selectedProfile.id)
//                       ? selectedProfile.email
//                       : maskEmail(selectedProfile.email)}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon icon={faPhone} className="text-green-600" />
//                   <span className="font-medium">Primary Phone:</span>
//                   <span>
//                     {allowedIds.includes(selectedProfile.id)
//                       ? selectedProfile.primaryPhone || "-"
//                       : maskPhone(selectedProfile.primaryPhone)}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
//                   <span className="font-medium">Secondary Phone:</span>
//                   <span>
//                     {allowedIds.includes(selectedProfile.id)
//                       ? selectedProfile.secondaryPhone || "-"
//                       : maskPhone(selectedProfile.secondaryPhone)}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon
//                     icon={faUserTag}
//                     className="text-orange-600"
//                   />
//                   <span className="font-medium">Role:</span>
//                   <span>{selectedProfile.role || "-"}</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <FontAwesomeIcon
//                     icon={faLayerGroup}
//                     className="text-pink-600"
//                   />
//                   <span className="font-medium">Category:</span>
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {selectedProfile.category.map((cat) => (
//                       <span
//                         key={cat}
//                         className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
//                       >
//                         {cat}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default IhApproch;