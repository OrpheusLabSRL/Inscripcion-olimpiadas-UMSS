import React from "react";
 import styles from "./ToggleButton.module.css";
 
 const ToggleButton = ({ isActive, onChange }) => {
   return (
     <button
       type="button"
       className={`${styles.toggle} ${isActive ? styles.active : ""}`}
       onClick={onChange}
       role="switch"
       aria-checked={isActive}
     >
       <span className={styles.slider} />
     </button>
   );
 };
 
 export default ToggleButton;