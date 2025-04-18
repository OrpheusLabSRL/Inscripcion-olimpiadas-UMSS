import React from "react";
 import styles from "./FormField.module.css";
 
 const FormField = ({ label, required, error, type, ...inputProps }) => {
   return (
     <div className={styles.field}>
       <label className={styles.label}>
         {label}
         {required && <span className={styles.required}>*</span>}
       </label>
       <div className={styles.inputWrapper}>
         <input
           className={styles.input}
           type={type === "date" ? "date" : "text"}
           {...inputProps}
         />
         {type === "date" && (
           <svg
             className={styles.calendarIcon}
             width="25"
             height="25"
             viewBox="0 0 25 25"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               d="M19.7917 4.16667H5.20833C4.05774 4.16667 3.125 5.09941 3.125 6.25V19.7917C3.125 20.9423 4.05774 21.875 5.20833 21.875H19.7917C20.9423 21.875 21.875 20.9423 21.875 19.7917V6.25C21.875 5.09941 20.9423 4.16667 19.7917 4.16667Z"
               stroke="black"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             />
             <path
               d="M16.6667 2.08333V6.25"
               stroke="black"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             />
             <path
               d="M8.33333 2.08333V6.25"
               stroke="black"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             />
             <path
               d="M3.125 10.4167H21.875"
               stroke="black"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             />
           </svg>
         )}
       </div>
       {error && <div className={styles.error}>{error}</div>}
     </div>
   );
 };
 
 export default FormField;