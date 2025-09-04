// import React from "react";

// type Profile = {
//   id: number;
//   name: string;
//   role: string;
//   image: string;
// };

// const profiles: Profile[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     role: "IT Consultant",
//     image: "https://randomuser.me/api/portraits/men/32.jpg",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     role: "Business Strategist",
//     image: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     id: 3,
//     name: "Mike Brown",
//     role: "UI/UX Designer",
//     image: "https://randomuser.me/api/portraits/men/52.jpg",
//   },
//   {
//     id: 4,
//     name: "Emily Davis",
//     role: "HR Specialist",
//     image: "https://randomuser.me/api/portraits/women/68.jpg",
//   },
//   {
//     id: 5,
//     name: "David Lee",
//     role: "Software Engineer",
//     image: "https://randomuser.me/api/portraits/men/77.jpg",
//   },
//   {
//     id: 6,
//     name: "Olivia Garcia",
//     role: "Product Manager",
//     image: "https://randomuser.me/api/portraits/women/65.jpg",
//   },
//   {
//     id: 7,
//     name: "Alex Kim",
//     role: "Marketing Lead",
//     image: "https://randomuser.me/api/portraits/men/11.jpg",
//   },
//   {
//     id: 8,
//     name: "Sophia Chen",
//     role: "Data Scientist",
//     image: "https://randomuser.me/api/portraits/women/22.jpg",
//   },
//   {
//     id: 9,
//     name: "Samuel Evans",
//     role: "Cloud Architect",
//     image: "https://randomuser.me/api/portraits/men/83.jpg",
//   },
//   {
//     id: 10,
//     name: "Laura Martin",
//     role: "Sales Director",
//     image: "https://randomuser.me/api/portraits/women/23.jpg",
//   },
// ];

// const Connections: React.FC = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen py-8 px-4">
//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">More suggestions for you</h1>
//       </div>

//       {/* New Design for Connecting Profiles */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {profiles.map((profile) => (
//           <div
//             key={profile.id}
//             className="relative bg-white rounded-3xl shadow-xl p-8 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
//           >
//             {/* Background Gradient Circle */}
//             <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/2 -translate-y-1/2 opacity-60"></div>

//             <div className="flex flex-col items-center z-10 relative">
//               <img
//                 src={profile.image}
//                 alt={profile.name}
//                 className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-white shadow-lg"
//               />
//               <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
//               <p className="text-sm text-gray-500 mb-6">{profile.role}</p>
//               <button
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 Connect
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Connections;


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


const Connections: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-800">More suggestions for you</h1>
      </div>

      {/* Compact Design for Connecting Profiles */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="relative bg-white rounded-2xl shadow-lg px-4 py-3 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Background Gradient Circle */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>

            <div className="flex flex-col items-center z-10 relative">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-14 h-14 rounded-full object-cover mb-2 ring-1 ring-white shadow-lg"
              />
              <h3 className="text-sm font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{profile.role}</p>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
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