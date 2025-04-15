
import React, { useState } from "react";
import OlympistaForm from "./OlympistaForm";
import ContactForm from "./ContactForm";
import Sidebar from "./Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [currentStep, setCurrentStep] = useState("olympista");
  const [olympistaData, setOlympistaData] = useState(null);

  const handleOlympistaSubmit = (data) => {
    setOlympistaData(data);
    setCurrentStep("contact");
  };

  const handleBack = () => {
    setCurrentStep("olympista");
  };

  return (
    <main className={styles.layout}>
      <Sidebar />
      <section className={styles.content}>
        {currentStep === "olympista" ? (
          <OlympistaForm onNext={handleOlympistaSubmit} />
        ) : (
          <ContactForm onBack={handleBack} />
        )}
      </section>
    </main>
  );
};

export default MainLayout;
