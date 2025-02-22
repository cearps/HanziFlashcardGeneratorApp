// src/components/Footer.tsx
import React from "react";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
