import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faFileAlt, faHandPointer, faStar } from "@fortawesome/free-solid-svg-icons";

const Roles: React.FC = () => {
  return (
    <section
      id="roles"
      className="w-full min-h-screen flex flex-col lg:flex-row"
    >
      {/* Left Side - White Background */}
      <div className="flex-1 bg-white py-20 px-8 flex items-center">
        <div className="max-w-xl mx-auto">
          <p className="text-sm font-semibold text-gray-800 mb-2">Got an idea?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        Idea holders 
          </h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faBolt} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                Connect directly with verified investors – no middlemen.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faFileAlt} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                Showcase everything upfront – idea details, funding needs, and vision.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faHandPointer} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                No long proposals – your profile is enough. One click to connect.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faStar} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                Unique opportunities with serious investors you won’t find elsewhere.
              </p>
            </div>
          </div>

          
        </div>
      </div>

      {/* Right Side - Pink Background */}
      <div className="flex-1 bg-pink-50 py-20 px-8 flex items-center">
        <div className="max-w-xl mx-auto">
          <p className="text-sm font-semibold text-gray-800 mb-2">Need ideas?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
            Investor
          </h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faBolt} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                Access a community of 10K+ startup-ready idea holders.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faFileAlt} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                Everything you need to kickstart – filters, profiles, and criteria setup in minutes.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faHandPointer} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                Free matching system, or integrate with your own tools.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faStar} className="text-pink-600 text-lg" />
              </div>
              <p className="text-gray-700">
                AI-based matching scans 500+ ideas and shortlists the best for you in days.
              </p>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Roles;
