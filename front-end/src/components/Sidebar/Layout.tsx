import React from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
  role: "idea-holder" | "investor";
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ role, children }) => {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6">{children}</main>
    </div>
  );
};

export default Layout;
