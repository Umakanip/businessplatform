import React from "react";

const invites = [
  {
    name: "Bhaiya",
    category: "IT Consultant",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Riya Sharma",
    category: "Business Strategist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mike Brown",
    category: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Emily Davis",
    category: "HR Specialist",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Lee",
    category: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
  },
  {
    name: "Olivia Garcia",
    category: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Alex Kim",
    category: "Marketing Lead",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Sophia Chen",
    category: "Data Scientist",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "Samuel Evans",
    category: "Cloud Architect",
    image: "https://randomuser.me/api/portraits/men/83.jpg",
  },
  {
    name: "Laura Martin",
    category: "Sales Director",
    image: "https://randomuser.me/api/portraits/women/23.jpg",
  },
];

const Notifications: React.FC = () => (
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
      {invites.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center p-4 bg-gray-800 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded-full border-2 border-purple-500 object-cover mr-6 shadow-inner"
          />
          <div className="flex-1">
            <div className="text-xl font-semibold text-gray-200">
              {item.name}
              <span className="font-normal text-gray-400 block text-sm mt-0.5">
                {item.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button className="px-5 py-2 rounded-full bg-gray-700 text-gray-400 font-medium transition hover:bg-gray-600 hover:text-gray-200">
              Ignore
            </button>
            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition hover:from-blue-700 hover:to-purple-700 shadow-lg ml-1">
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Notifications;