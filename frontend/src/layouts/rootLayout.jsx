import React from "react";
import { Outlet } from "react-router-dom";
import FloatingShape from "../components/FloatingShape";

const RootLayout = () => {
  return (
    <div className=" relative min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4  overflow-hidden!">
      <FloatingShape
        color="bg-cyan-500"
        size="w-72 h-72"
        top="-15%"
        left="45%"
        delay={0}
      />
      <FloatingShape
        color="bg-teal-400"
        size="w-56 h-56"
        top="65%"
        left="75%"
        delay={4}
      />
      <FloatingShape
        color="bg-blue-400"
        size="w-40 h-40"
        top="35%"
        left="-5%"
        delay={2}
      />

      <div className="w-full max-w-7xl h-[90vh] bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden flex">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
