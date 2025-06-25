// src/layout/BaseLayout.tsx
import React from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { Outlet } from "react-router";
import { AuthProvider } from "~/context/AuthContext";

interface BaseLayoutProps {}

const BaseLayout: React.FC<BaseLayoutProps> = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
};

export default BaseLayout;
