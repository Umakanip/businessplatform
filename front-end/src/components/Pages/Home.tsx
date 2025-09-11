import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Roles from "./Roles";
import Footer from "./Footer";
import Subscription from "./subscription";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

        <Hero />
        <Features />
        <Subscription />
        <Roles />


      <Footer />
    </div>
  );
};

export default Home;
