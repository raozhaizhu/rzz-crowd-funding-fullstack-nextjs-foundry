"use client";
// ANCHOR React & library
import { Home, Flag, BookOpen, FileSearch } from "lucide-react";

// ANCHOR Components
import { NavBar } from "@/components/ui/tubelight-navbar";

// ANCHOR Types & Interfaces

// ANCHOR Constants
const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Campaigns", url: "/campaigns", icon: Flag },
  {
    name: "Etherscan",
    url: "https://sepolia.etherscan.io/address/0x6d21ab537862a8d0302cdb1fb4cfd1f76aee3b5c",
    icon: FileSearch,
  },
  {
    name: "Introduce",
    url: "https://github.com/raozhaizhu/rzz-crowd-funding-fullstack-nextjs-foundry",
    icon: BookOpen,
  },
];
// ANCHOR Component definition
const Header = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)

  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render

  return (
    <header>
      <NavBar items={navItems} />
    </header>
  );
};
export default Header;
