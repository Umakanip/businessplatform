import React from "react";
import HeaderInv from "./HeaderInv";
import HeaderIh from "./HeaderIh";

type LayoutProps = {
  role: "idea-holder" | "investor";
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ role, children }) => {
  return (
    <div> {/* Changed from <div className="flex"> */}
      {role === "investor" ? <HeaderInv /> : <HeaderIh />}
        {children}
    </div>
  );
};

export default Layout;