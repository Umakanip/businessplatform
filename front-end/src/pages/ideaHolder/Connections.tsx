import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

type Profile = {
  id: number;
  name: string;
  email: string;
  category: string;
  profileImage: string | null;
};

const Connections: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/idealogists/investors/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfiles(res.data.investors || []);
      } catch (error) {
        console.error("Error fetching investors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading suggestions...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          More suggestions for you
        </h1>
      </div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="relative bg-white rounded-2xl shadow-lg px-6 py-6 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-[240px] h-[350px] mx-auto"
          >
            {/* Background Gradient Circle */}
            <div className="absolute top-0 right-0 w-15 h-15 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>

            <div className="flex flex-col items-center z-10 relative h-full justify-between">
              <div className="flex flex-col items-center">
                <img
                  src={
                    profile.profileImage
                      ? `http://localhost:5000/uploads/${profile.profileImage}`
                      : "https://via.placeholder.com/100"
                  }
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover mb-9 ring-2 ring-white shadow-lg"
                />
                <h3 className="text-md font-semibold text-gray-900 text-center">
                  {profile.name}
                </h3>
                {/* Added 'mt-2' for margin top */}
                <p className="text-sm text-gray-500 text-center mt-12">
                  {profile.category}
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm mt-4">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;