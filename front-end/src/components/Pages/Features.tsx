import React from "react";
import handshakeImg from "../../assest/network-business-man-tablet.jpg";
import keyImg from "../../assest/business-technology-internet-network-concept-young-businessman-working-virtual-screen-future-sees-117233107.webp";
import categoryImg from "../../assest/online-shopping-concept-businessman-use-600nw-2419777755.webp";
import filterImg from "../../assest/businessman-team-analyzing-financial-statement-finance-task-with-smart-phone-laptop-tablet-wealth-management-concept_265022-8132.jpg";

const Features = () => {
  const features = [
    {
      img: handshakeImg,
      title: "Mutual Connection",
      desc: "Investors and Idea Holders both need to subscribe to connect.",
    },
    {
      img: keyImg,
      title: "Subscription Unlock",
      desc: "With subscription, Idea Holders can view Investor profiles, and vice versa.",
    },
    {
      img: categoryImg,
      title: "Explore Categories",
      desc: "Both sides can explore across multiple categories to discover the perfect match.",
    },
    {
      img: filterImg,
      title: "Smart Filtering",
      desc: "Our system highlights matching profiles to save time and effort.",
    },
  ];

  return (
    <section id="features" className="py-28 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-wide"> How It Works </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"> Both
            <span className="font-semibold text-gray-800"> Idea Holders </span> and
            <span className="font-semibold text-gray-800"> Investors</span> need an active
            <span className="font-semibold text-gray-800"> Subscription </span> to connect, collaborate, and grow together. </p>
        </div>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-2 hover:scale-105"
            >
              {/* Image Container */}
              <div className="w-full h-44 sm:h-48 lg:h-52 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
