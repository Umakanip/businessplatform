import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import home from "../../assest/img-slack-connect-hero@2x-Photoroom.png";
import idea from "../../assest/istockphoto-1392016982-612x612.jpg";
import secure from "../../assest/istockphoto-1311598658-612x612.jpg";
import connect from "../../assest/black-businessman-tablet-planning-and-desktop-at-2022-12-10-02-18-23-utc-1024x686.jpg";

const Hero: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeContent, setActiveContent] = useState('');
  const navigate = useNavigate();

  const handleButtonClick = (contentType: string) => {
    // If the clicked button is the same as the currently active one, hide the content.
    if (activeContent === contentType) {
      setActiveContent('');
    } else {
      // Otherwise, show the content for the clicked button.
      setActiveContent(contentType);
    }
  };

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/status");
        setSubscription(response.data);
      } catch (err) {
        console.error("Error fetching subscription:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptionStatus();
  }, []);

  if (isLoading) {
    return (
      <section
        id="hero"
        className="py-24 px-6 sm:px-12 lg:px-20 text-center bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-400 animate-pulse">
            Loading...
          </h1>
        </div>
      </section>
    );
  }

  const isActive = subscription && subscription.active;

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-white py-16 px-6 sm:px-12 lg:px-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Connect Idea Holders with Investors Seamlessly
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg lg:max-w-none mx-auto">
              Share your ideas with the right investors, get feedback, and grow your venture. Our platform helps you find the perfect match for collaboration and funding.
            </p>
            <div className="flex justify-center lg:justify-start space-x-4">
              <button
                onClick={() => handleButtonClick('ideaHolder')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-500"
              >
                I HAVE AN IDEA
              </button>
              <button
                onClick={() => handleButtonClick('investor')}
                className="border border-purple-800 text-purple-800 font-semibold py-3 px-6 rounded-md hover:bg-purple-50 transition-colors"
              >
                I AM AN INVESTOR
              </button>
            </div>

            {/* Dynamic Content Section */}
            <div className="mt-8 text-left">
              {activeContent === 'ideaHolder' && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Are you an Idea Holder?</h2>
                  <p className="text-gray-700">
                    Many people have brilliant ideas but lack the financial resources to turn them into reality. If you have a solid business concept but need investment, you're in the right place. Our platform allows you to showcase your innovation and connect directly with investors who are actively looking for the next big thing. You can present your idea, discuss your vision, and secure the funding needed to launch and grow your venture.
                  </p>
                </div>
              )}
              {activeContent === 'investor' && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Are you an Investor?</h2>
                  <p className="text-gray-700">
                    You have the capital, but you're searching for a promising opportunity. Instead of waiting for ideas to come to you, our platform gives you direct access to a curated list of innovative business concepts. You can browse various industries, evaluate potential ventures, and connect with passionate idea holders. By investing in these ideas, you not only find a new avenue for growth but also help a new generation of entrepreneurs succeed.
                  </p>
                </div>
              )}
            </div>

          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src={home}
              alt="Illustration of connection"
              className="w-[38rem] h-auto rounded-xl"
            />
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="bg-white py-16 px-6 sm:px-12 lg:px-20 border-b border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Grow Your Network and Ideas Faster
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Whether you are an investor looking for promising ideas or an idea holder seeking support, our platform connects you with the right people efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-around items-center space-y-8 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
              <div className="text-6xl font-extrabold text-purple-800">100+</div>
              <p className="text-gray-600 mt-2">investors actively seeking new ideas</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold text-purple-800">500+</div>
              <p className="text-gray-600 mt-2">idea holders sharing their projects</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold text-purple-800">90%</div>
              <p className="text-gray-600 mt-2">successful connections between investors and idea holders</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            Metrics based on verified connections on our platform. Results may vary.
          </p>
        </div>
      </section>

      {/* Connect Faster Section */}
      <section className="bg-white py-16 px-6 sm:px-12 lg:px-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 flex justify-center lg:justify-start">
            <img
src={idea}
alt="Collaboration illustration"
              className="w-[30rem] h-auto rounded-xl"
            />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6">
              Share Ideas and Get Feedback
            </h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Connect with investors interested in your sector and receive actionable feedback.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Collaborate with idea holders to refine and validate concepts before presenting to investors.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Share your progress and updates in real-time to attract the right support and funding.</span>
              </li>
            </ul>
            <a
              href="#"
              className="text-purple-800 font-semibold mt-6 inline-block hover:underline"
            >
              Explore idea connections &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Connect Securely Section */}
      <section className="bg-white py-16 px-6 sm:px-12 lg:px-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6">
              Securely Connect with Investors
            </h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>All interactions happen securely with verified members on the platform.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Your ideas are protected, and your privacy is our priority.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Communicate confidently with investors without worrying about unsolicited emails.</span>
              </li>
            </ul>
            <a
              href="#"
              className="text-purple-800 font-semibold mt-6 inline-block hover:underline"
            >
              Learn more about secure connections &rarr;
            </a>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src={secure}
              alt="Secure connections illustration"
              className="w-[30rem] h-auto rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Connect Tools Section */}
      <section className="bg-white py-16 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 flex justify-center lg:justify-start">
            <img
              src={connect}
              alt="Workflow tools illustration"
              className="w-[30rem] h-auto rounded-xl"
            />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6">
              Connect Tools and Automate Follow-Ups
            </h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Keep track of investor interactions and idea updates efficiently.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mt-1 mr-3 text-lg">&bull;</span>
                <span>Automate reminders, meetings, and follow-ups to speed up idea validation and funding.</span>
              </li>
            </ul>
            <a
              href="#"
              className="text-purple-800 font-semibold mt-6 inline-block hover:underline"
            >
              Explore tools for idea collaboration &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
