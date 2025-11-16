import React from "react";
import Logo from "../assets/ulam-logo.svg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#201908] text-orange-400 mt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-6 py-10 md:py-12">
        <img
          src={Logo}
          alt="Ulam logo"
          className="h-10 w-auto md:h-12"
        />
        <p className="mt-2 text-sm font-medium tracking-wide">
          penguino
        </p>
        <p className="text-xs text-orange-300">
          2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
