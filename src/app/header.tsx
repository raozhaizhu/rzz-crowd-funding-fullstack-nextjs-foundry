"use client";
// ANCHOR React & library
import { Home, User, Briefcase, FileText } from "lucide-react";

// ANCHOR Components
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ANCHOR Types & Interfaces

// ANCHOR Constants
const navItems = [
  { name: "Home", url: "#", icon: Home },
  { name: "About", url: "#", icon: User },
  { name: "Projects", url: "#", icon: Briefcase },
  { name: "Resume", url: "#", icon: FileText },
];
// ANCHOR Component definition
const Header = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)

  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render

  return (
    <>
      <NavBar items={navItems} />
      <ConnectButton />
    </>
  );
};
export default Header;
