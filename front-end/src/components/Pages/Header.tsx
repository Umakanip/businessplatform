// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ProfileDrawer from "../Pages/ProfileDrawer";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   category: string;
//   profileImage?: string;
// }

// const Header: React.FC = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [showProfile, setShowProfile] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // ✅ Load and refresh user from backend
//   const loadUser = async () => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (!storedUser || !token) {
//       setUser(null);
//       return;
//     }

//     try {
//       const parsed = JSON.parse(storedUser);
//       const res = await axios.get(
//         `http://localhost:5000/api/auth/profile/${parsed.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUser(res.data);
//       localStorage.setItem("user", JSON.stringify(res.data));
//     } catch (err) {
//       console.error("Failed to load user in header:", err);
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   useEffect(() => {
//     if (!showProfile) {
//       loadUser();
//     }
//   }, [showProfile]);

//   const handleAuthClick = () => {
//     if (!user) {
//       navigate("/auth");
//     } else {
//       setShowProfile(true);
//     }
//   };

//   const handleConnectClick = () => {
//     if (!user) {
//       navigate("/auth");
//     } else {
//       if (user.role === "idea-holder" || user.role === "idealogist") {
//         navigate("/ih/approach");
//       } else if (user.role === "investor") {
//         navigate("/inv/approach");
//       } else {
//         navigate("/auth");
//       }
//     }
//   };

//   return (
//     <>
//       <header className="w-full bg-gradient-to-r from-purple-1000 via-slate-1000 to-purple-800 text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             {/* Logo */}
//             <a
//               href="/"
//               className="font-extrabold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
//             >
//               StartupConnect
//             </a>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-8">
//               <a href="#features" className="text-sm sm:text-base font-bold text-gray-600 ">
//                 Features
//               </a>
//               <a href="#roles" className="text-sm sm:text-base font-bold text-gray-600 ">
//                 Roles
//               </a>
//               <a href="#Subscription" className="text-sm sm:text-base font-bold text-gray-600 ">
//                 Pricing
//               </a>
//             </nav>

//             {/* Right Side Desktop */}
//             <div className="hidden md:flex items-center space-x-4">
//               <button
//                 className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-600 "
//                 onClick={handleAuthClick}
//               >
//                 {user ? (
//                   <>
//                     <img
//                       src={
//                         user.profileImage
//                           ? `http://localhost:5000/uploads/${user.profileImage}`
//                           : "https://via.placeholder.com/40"
//                       }
//                       alt="profile"
//                       className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                     />
//                     <span className="hidden sm:inline">{user.name}</span>
//                   </>
//                 ) : (
//                   "Sign In"
//                 )}
//               </button>

//               <button
//                 className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-500 text-sm sm:text-base"
//                 onClick={handleConnectClick}
//               >
//                 {user ? "Go to Connect" : "Subscribe & Connect"}
//               </button>
//             </div>

//             {/* Mobile Hamburger */}
//             <button
//               className="md:hidden text-gray-600 text-2xl focus:outline-none"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {menuOpen && (
//           <div className="md:hidden bg-gradient-to-r from-purple-900 to-blue-900 px-6 py-4 space-y-4">
//             <a href="#features" className="block text-white font-medium">
//               Features
//             </a>
//             <a href="#roles" className="block text-white font-medium">
//               Roles
//             </a>
//             <a href="#pricing" className="block text-white font-medium">
//               Pricing
//             </a>

//             <button
//               className="w-full flex items-center gap-2 text-white font-medium"
//               onClick={handleAuthClick}
//             >
//               {user ? (
//                 <>
//                   <img
//                     src={
//                       user.profileImage
//                         ? `http://localhost:5000/uploads/${user.profileImage}`
//                         : "https://via.placeholder.com/40"
//                     }
//                     alt="profile"
//                     className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                   />
//                   <span>{user.name}</span>
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>

//             <button
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-500"
//               onClick={handleConnectClick}
//             >
//               {user ? "Go to Connect" : "Subscribe & Connect"}
//             </button>
//           </div>
//         )}
//       </header>

//       {/* Profile Drawer */}
//     <ProfileDrawer
//   isOpen={showProfile}
//   onClose={() => setShowProfile(false)}
// />

//     </>
//   );
// };

// export default Header;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileDrawer from "../Pages/ProfileDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  category: string;
  profileImage?: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Load and refresh user from backend
  const loadUser = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setUser(null);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${parsed.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to load user in header:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!showProfile) {
      loadUser();
    }
  }, [showProfile]);

  const handleAuthClick = () => {
    if (!user) {
      navigate("/auth");
    } else {
      setShowProfile(true);
    }
  };

  const handleConnectClick = () => {
    if (!user) {
      navigate("/auth");
    } else {
      if (user.role === "idea-holder" || user.role === "idealogist") {
        navigate("/ih/approach");
      } else if (user.role === "investor") {
        navigate("/inv/approach");
      } else {
        navigate("/auth");
      }
    }
  };

  // 🔹 ஒரு எழுத்து கொண்ட அவதார்-ஐ ரெண்டர் செய்யும் காம்போனென்ட்
  const AvatarWithFirstLetter = ({ name, profileImage }: { name?: string; profileImage?: string }) => {
    const getFirstLetter = (name: string) => {
      return name ? name.charAt(0).toUpperCase() : "";
    };

    // நீங்கள் கொடுத்த கோடில் இருந்து எடுக்கப்பட்ட கிளாஸ்நேம்கள்
    const baseClasses = "w-8 h-8 rounded-full object-cover border border-gray-300 flex items-center justify-center text-sm font-bold";

    if (profileImage) {
      return (
        <img
          src={`http://localhost:5000/uploads/${profileImage}`}
          alt="profile"
          className={`${baseClasses}`}
        />
      );
    }

    return (
      <div className={`${baseClasses} bg-gradient-to-r from-purple-500 to-pink-500 text-white`}>
        {getFirstLetter(name || "")}
      </div>
    );
  };

  return (
    <>
      <header className="w-full bg-gradient-to-r from-purple-1000 via-slate-1000 to-purple-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <a
              href="/"
              className="font-extrabold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              StartupConnect
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm sm:text-base font-bold text-gray-600 ">
                Features
              </a>
              <a href="#roles" className="text-sm sm:text-base font-bold text-gray-600 ">
                Roles
              </a>
              <a href="#Subscription" className="text-sm sm:text-base font-bold text-gray-600 ">
                Pricing
              </a>
            </nav>

            {/* Right Side Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-600 "
                onClick={handleAuthClick}
              >
                {user ? (
                  <>
                    <AvatarWithFirstLetter name={user.name} profileImage={user.profileImage} />
                    <span className="hidden sm:inline">{user.name}</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-500 text-sm sm:text-base"
                onClick={handleConnectClick}
              >
                {user ? "Go to Connect" : "Subscribe & Connect"}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-gray-600 text-2xl focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gradient-to-r from-purple-900 to-blue-900 px-6 py-4 space-y-4">
            <a href="#features" className="block text-white font-medium">
              Features
            </a>
            <a href="#roles" className="block text-white font-medium">
              Roles
            </a>
            <a href="#pricing" className="block text-white font-medium">
              Pricing
            </a>

            <button
              className="w-full flex items-center gap-2 text-white font-medium"
              onClick={handleAuthClick}
            >
              {user ? (
                <>
                  <AvatarWithFirstLetter name={user.name} profileImage={user.profileImage} />
                  <span>{user.name}</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-500"
              onClick={handleConnectClick}
            >
              {user ? "Go to Connect" : "Subscribe & Connect"}
            </button>
          </div>
        )}
      </header>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

export default Header;