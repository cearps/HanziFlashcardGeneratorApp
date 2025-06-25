// src/components/Footer.tsx
import React from "react";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-muted mt-10">
      <div className="container mx-auto p-4 text-center text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Hanzi Flashcard App. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
