import React from "react";
import SidebarInv from "./SidebarInv";
import SidebarIh from "./SidebarIh";

type LayoutProps = {
  role: "idea-holder" | "investor";
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ role, children }) => {
  return (
    <div className="flex">
      {role === "investor" ? <SidebarInv /> : <SidebarIh />}
      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6">{children}</main>
    </div>
  );
};

export default Layout;
