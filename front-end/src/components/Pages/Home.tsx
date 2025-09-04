import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Roles from "./Roles";
import Footer from "./Footer";
import Subscription from "./subscription";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header stays clean without gradient */}
      <Header />

      {/* Main content with gradient background */}
      <main className="flex-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Hero />
        <Features />
        <Subscription />
        <Roles />
      </main>

      {/* Footer inside gradient */}
      <Footer />
    </div>
  );
};

export default Home;
