// src/layout/BaseLayout.tsx
import React from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { Outlet } from "react-router";

interface BaseLayoutProps {}

/**
 * A layout component that:
 * - Renders <Header /> at the top
 * - Displays an <Outlet /> in the main area
 * - Renders <Footer /> at the bottom
 */
const BaseLayout: React.FC<BaseLayoutProps> = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* The Outlet renders whichever child route is currently active */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default BaseLayout;
