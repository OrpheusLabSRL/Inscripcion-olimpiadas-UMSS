import React from "react";
import styles from "./BackButton.module.css";

const BackButton = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className={styles.backButton}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;
