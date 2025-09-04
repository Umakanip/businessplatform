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

// Helper function for the second design
const getRoleIcon = (role: string) => {
  switch (role) {
    case "IT Consultant":
      return "💻";
    case "Business Strategist":
      return "📈";
    case "UI/UX Designer":
      return "🎨";
    case "HR Specialist":
      return "🤝";
    case "Software Engineer":
      return "👨‍💻";
    case "Product Manager":
      return "🚀";
    case "Marketing Lead":
      return "📣";
    case "Data Scientist":
      return "📊";
    case "Cloud Architect":
      return "☁️";
    case "Sales Director":
      return "💰";
    default:
      return "💼";
  }
};

const ConnectPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Design 1: Minimalist with Hover Effects */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight">Design Option 1: Minimalist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {profiles.map((profile) => (
              <div
                key={`min-${profile.id}`}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8 flex flex-col items-center text-center"
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover mb-5 border-4 border-white shadow-md"
                />
                <div className="text-xl font-bold text-gray-800 mb-1">{profile.name}</div>
                <div className="text-sm text-gray-600 font-medium mb-6">{profile.role}</div>
                <button
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-12 border-t-2 border-gray-300" />

      {/* Design 2: Card with Border and Icons */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight">Design Option 2: Card with Icons</h2>
          <p className="text-gray-500 mb-8">பயனரின் பங்கு மற்றும் தொழிலை அடையாளம் காண உதவும் குறியீடுகளுடன் கூடிய வடிவமைப்பு.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <div
                key={`icon-${profile.id}`}
                className="bg-gray-50 rounded-xl shadow-md border-t-4 border-blue-500 hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 p-6 flex flex-col items-center text-center"
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-300"
                />
                <div className="text-lg font-semibold text-gray-800">{profile.name}</div>
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <span>{getRoleIcon(profile.role)}</span>
                  <span>{profile.role}</span>
                </div>
                <button
                  className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-auto shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-12 border-t-2 border-gray-300" />
      
      {/* Design 3: Sleek and Modern with Glassmorphism */}
      <div className="py-12 px-4 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-2 text-white tracking-tight drop-shadow-lg">Design Option 3: Glassmorphism</h2>
          <p className="text-white/80 mb-8 drop-shadow-lg">அழகான மற்றும் கண்ணாடிகள் போன்ற தோற்றத்துடன் கூடிய நவீன வடிவமைப்பு.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <div
                key={`glass-${profile.id}`}
                className="bg-white/20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                />
                <div className="text-lg font-bold text-white mb-1 drop-shadow">{profile.name}</div>
                <div className="text-sm text-white/80 font-medium mb-6">{profile.role}</div>
                <button
                  className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;