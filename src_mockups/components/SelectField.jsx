import React from "react";
import styles from "./SelectField.module.css";

const SelectField = ({ label, required, error, children, ...selectProps }) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.selectWrapper}>
        <select className={styles.select} {...selectProps}>
          {children}
        </select>
        <svg
          className={styles.icon}
          width="30"
          height="31"
          viewBox="0 0 30 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.5625 11.1406L15 19.8594L23.4375 11.1406"
            stroke="black"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="square"
          />
        </svg>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default SelectField;
