import React from "react";
import Header from "../header";
import Hero from "./hero";
import { DealsSection } from "./deals-section";
import TopMiniHeader from "../header/top-mini-header";

const HomeScreen = () => {
  return (
    <div>
      <TopMiniHeader />
      <Header />
      <Hero />
      <DealsSection />
    </div>
  );
};

export default HomeScreen;
