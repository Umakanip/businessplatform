import React from "react";

type Profile = {
  id: number;
  name: string;
  role: string;
  image: string;
};

const profiles: Profile[] = [
  {
    id: 1,
    name: "John Doe",
    role: "IT Consultant",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Business Strategist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Mike Brown",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "HR Specialist",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "David Lee",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
  },
  {
    id: 6,
    name: "Olivia Garcia",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 7,
    name: "Alex Kim",
    role: "Marketing Lead",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 8,
    name: "Sophia Chen",
    role: "Data Scientist",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 9,
    name: "Samuel Evans",
    role: "Cloud Architect",
    image: "https://randomuser.me/api/portraits/men/83.jpg",
  },
  {
    id: 10,
    name: "Laura Martin",
    role: "Sales Director",
    image: "https://randomuser.me/api/portraits/women/23.jpg",
  },
];

const ConnectPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">More suggestions for you</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 p-6 flex flex-col items-center"
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-white shadow"
              />
              <div className="text-lg font-semibold text-gray-800">{profile.name}</div>
              <div className="text-sm text-gray-500 mb-4">{profile.role}</div>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition mt-auto shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
