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
  // NOTE: hasActiveSubscription will be from the perspective of the Investor (the profile being displayed)
  hasActiveSubscription?: boolean; 
};

type ProfileDetail = Profile & {
  primaryPhone?: string;
  secondaryPhone?: string;
  role?: string;
  bio?: string;
  minInvestment?: number;
  maxInvestment?: number;
};

// Interface for the Idealogist's (current user's) subscription status
type SubscriptionStatus = {
  active: boolean;
  plan: "lite" | "standard" | "premium" | null;
};

const IhApproch: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(
    null
  );
    const [idealogistHasPaidSubscription, setIdealogistHasPaidSubscription] = useState(false); // ✅ New state for idealogist

  const [showModal, setShowModal] = useState(false);
  // Renamed state to reflect the current user's (Idealogist's) subscription status
  const [userSubscription, setUserSubscription] = useState<SubscriptionStatus>({ active: false, plan: null }); 
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();

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

        // 1. Fetch all profiles
        const res = await axiosInstance.get("/idealogists/matching-investors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allProfiles: Profile[] = res.data.investors || [];
        setIdealogistHasPaidSubscription(res.data.idealogistHasPaidSubscription);

        // 2. Fetch current user's subscription
        const subRes = await axiosInstance.get("/subscriptions/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sub: SubscriptionStatus = subRes.data;
        setUserSubscription(sub);
        
        const total = allProfiles.length;
        let allowedCount = 0;

        // 3. Determine allowed count based on the user's plan
        if (sub?.active) {
          if (sub.plan === "lite") {
            allowedCount = Math.ceil(total * 0.3);
          } else if (sub.plan === "standard") {
            allowedCount = Math.ceil(total * 0.6);
          } else if (sub.plan === "premium") {
            allowedCount = total; // Full access
          }
        } else {
          // 🛑 CRITICAL CHANGE: If no active subscription, show ALL profiles but mark them as locked.
          // To achieve this, we set allowedCount to total but we will use the `sub.active` flag 
          // to determine 'isLocked' in the rendering logic.
          allowedCount = total;
        }

        // 4. Filter or Slice profiles to only show the "allowed" set
        // If the user has a subscription, we show only the allowed percentage.
        // If the user has NO subscription, we show all, so the user sees locked profiles and can upgrade.
        const profilesToShow = sub?.active 
            ? allProfiles.slice(0, allowedCount)
            : allProfiles;
        
        // The profiles array now only contains the ones we want to display (either the allowed subset, or all if no subscription)
        setProfiles(profilesToShow);
        
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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleViewProfile = async (id: number) => {
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      // 🛑 Check if the user is allowed to view the full profile and interact
      const isLocked = !userSubscription.active;
      

      // If allowed (active subscription), set selected profile and open modal
      setSelectedProfile(profile);
      setShowModal(true);
      setShowContact(false); // Reset contact view

      try {
        // Increment view count (only if not locked, based on the backend logic/design)
        const token = localStorage.getItem("token");
        if (token) {
          await axiosInstance.post(
            "/profile-views/increment",
            { ideaHolderId: id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          window.dispatchEvent(new Event("refreshViews"));
        }
      } catch (err) {
        console.error("Failed to increment view count", err);
      }
    }
  };


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

  // 🛑 The main locking logic: A profile is locked if the user has NO active subscription.
  // This satisfies your requirement: "subcription panala nalu profile show aganum ella profile um show aganum but locked la irukanum"
  // NOTE: If the profiles list is filtered based on plan (lite/standard), 
  // then the lock logic here is only for the "no subscription" case.
  const isGlobalLocked = !userSubscription.active;
  const isPremiumUser = userSubscription.active && userSubscription.plan === "premium";

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 pt-8">
        <h1 className="text-2xl font-bold text-gray-800">
          More suggestions for you
        </h1>
        <p className="text-gray-500 text-sm">
          {userSubscription.active 
            ? `Total ${profiles.length} profiles available for your ${userSubscription.plan} plan`
            : `Total ${profiles.length} profiles. Upgrade to unlock all features.`
          }
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {profiles.map((profile) => {
          const categoriesToShow = Array.isArray(profile.category)
            ? profile.category.slice(0, 2)
            : [];
          
          // The profile on the card is locked if the current user (idealogist) has no active subscription.
          const isLocked = isGlobalLocked; 

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
                        className={`w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white shadow-lg transition-all duration-500 ${isLocked ? "blur-md" : ""}`}
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ring-2 ring-white shadow-lg transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-[Pacifico] ${isLocked ? "blur-md" : ""}`}
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
                      className={`w-full font-semibold py-2 rounded-full shadow text-sm mt-2 flex items-center justify-center gap-2 ${isLocked
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

      {/* Profile Modal */}
      {showModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden relative">
            {/* Header (blue top bar) */}
            <div className="bg-blue-700 p-6 text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto">
                {selectedProfile.profileImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${selectedProfile.profileImage}`}
                    alt={selectedProfile.name}
                    className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ${!idealogistHasPaidSubscription ? "blur-md" : ""
                      }`}
                  />
                ) : (
                  <AvatarWithFirstLetter
                    name={selectedProfile.name}
                    isLocked={!idealogistHasPaidSubscription}
                  />
                )}

                {/* 🔒 lock overlay when locked */}
                {!idealogistHasPaidSubscription && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faLock} className="text-white text-lg" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 mt-4">
                {/* Toggle Contact Button */}
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-700 border border-gray-200 hover:bg-gray-50 shadow-sm transition"
                >
                  {showContact ? "Close Contact" : "View Contact"}
                </button>

                {/* View Plans Button (only for locked profiles) */}
                {!idealogistHasPaidSubscription && (
                  <button
                    onClick={() => navigate("/ih/subscription")}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow hover:opacity-90 transition"
                  >
                    View Plans
                  </button>
                )}
              </div>

              {/* 👉 Swap Content */}
              {showContact ? (
                <div className="mt-4 space-y-2 text-white text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-200" />
                    <span>
                      {idealogistHasPaidSubscription
                        ? selectedProfile.email
                        : maskEmail(selectedProfile.email)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faPhone} className="text-blue-200" />
                    <span>
                      {idealogistHasPaidSubscription
                        ? selectedProfile.primaryPhone || "-"
                        : maskPhone(selectedProfile.primaryPhone)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faPhone} className="text-blue-200" />
                    <span>
                      {idealogistHasPaidSubscription
                        ? selectedProfile.secondaryPhone || "-"
                        : maskPhone(selectedProfile.secondaryPhone)}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-white mt-4">
                    {selectedProfile.name}
                  </h2>
                  <p className="text-blue-100 text-sm">{selectedProfile.role}</p>
                </>
              )}
            </div>

            {/* Body (white clean section) */}
            <div className="p-5">
              {/* Bio */}
              <div className="flex items-start space-x-2 text-gray-700 text-sm mb-3">
                <FontAwesomeIcon icon={faUserTag} className="mt-0.5 text-blue-600" />
                <p>{selectedProfile.bio || "No bio available"}</p>
              </div>

              {/* Category */}
              <div className="flex items-start space-x-2 text-gray-700 text-sm">
                <FontAwesomeIcon icon={faLayerGroup} className="mt-0.5 text-blue-600" />
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.category.map((cat) => (
                    <span
                      key={cat}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* 🔹 Investment Range */}
              <div className="flex items-start space-x-2 text-gray-700 text-sm">
                <FontAwesomeIcon icon={faCrown} className="mt-0.5 text-green-600" />
                <p>
                  Investment Range:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedProfile.minInvestment ? `₹${selectedProfile.minInvestment}` : "-"}{" "}
                    -{" "}
                    {selectedProfile.maxInvestment ? `₹${selectedProfile.maxInvestment}` : "-"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IhApproch;