import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Roles from "./Roles";
import Footer from "./Footer";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Roles />
      
      <Footer />
    </div>
  );
};

export default Home;
