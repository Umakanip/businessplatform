import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faFileAlt,
  faHandPointer,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const Roles: React.FC = () => {
  return (
    <section
      id="roles"
      className="w-full min-h-screen flex flex-col lg:flex-row font-[Poppins]"
    >
      {/* Left Side – Idea Holders */}
      {/* Left Side - White Background */}
      <div className="flex-1 bg-white py-20 px-8 flex items-center">
        <div className="max-w-xl mx-auto">
          <p className="text-sm font-semibold text-gray-800 mb-2">Have a Brilliant Idea?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8"> Idea Holders </h2>

          <div className="space-y-8">
            {/* Point 1 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBolt} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                You’ve got the idea. We help you find investors who believe in your
                vision and can make it real.
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Create a detailed idea profile — show your concept, goals, and
                investment needs clearly.
              </p>
            </div>

            {/* Point 3 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHandPointer} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Get instant visibility among verified investors who are actively
                searching for new ideas.
              </p>
            </div>

            {/* Point 4 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faStar} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                All connections are paid and verified — ensuring real
                collaborations, not casual chats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Pink Background */}
      <div className="flex-1 bg-pink-50 py-20 px-8 flex items-center">
        <div className="max-w-xl mx-auto"> <p className="text-sm font-semibold text-gray-800 mb-2">Looking to Invest?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8"> Investor </h2>

          <div className="space-y-8">
            {/* Point 1 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBolt} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Have the funds but need the right project? Discover innovative
                ideas ready for execution.
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Filter by category, budget, or experience level — find ideas that
                match your investment goals.
              </p>
            </div>

            {/* Point 3 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHandPointer} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Connect directly with creators through paid sessions — no middlemen,
                no wasted time.
              </p>
            </div>

            {/* Point 4 */}
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 flex items-center justify-center text-white shadow-md mr-5 transform group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faStar} className="text-xl" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our AI-based matching system recommends the most promising ideas for
                your investment range.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roles;
