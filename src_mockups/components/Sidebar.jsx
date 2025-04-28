import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <header className={styles.header}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7330cc38170480eadf5800dd915ae76c4a5737cb"
          alt="LOGO O SANSI"
          className={styles.logo}
        />
        <h1 className={styles.title}>O! SanSi</h1>
      </header>

      <div className={styles.menuSection}>
        <button className={styles.menuItemActive}>
          <svg
            width="30"
            height="31"
            viewBox="0 0 30 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 15.5L6.25 12.9167M6.25 12.9167L15 3.875L23.75 12.9167M6.25 12.9167V25.8333C6.25 26.1759 6.3817 26.5044 6.61612 26.7467C6.85054 26.9889 7.16848 27.125 7.5 27.125H11.25M23.75 12.9167L26.25 15.5M23.75 12.9167V25.8333C23.75 26.1759 23.6183 26.5044 23.3839 26.7467C23.1495 26.9889 22.8315 27.125 22.5 27.125H18.75M11.25 27.125C11.5815 27.125 11.8995 26.9889 12.1339 26.7467C12.3683 26.5044 12.5 26.1759 12.5 25.8333V20.6667C12.5 20.3241 12.6317 19.9956 12.8661 19.7533C13.1005 19.5111 13.4185 19.375 13.75 19.375H16.25C16.5815 19.375 16.8995 19.5111 17.1339 19.7533C17.3683 19.9956 17.5 20.3241 17.5 20.6667V25.8333C17.5 26.1759 17.6317 26.5044 17.8661 26.7467C18.1005 26.9889 18.4185 27.125 18.75 27.125M11.25 27.125H18.75"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Inicio</span>
        </button>

        <button className={styles.menuItem}>
          <svg
            width="30"
            height="31"
            viewBox="0 0 30 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 10.333L13.6125 17.1272C14.0233 17.4104 14.5061 17.5616 15 17.5616C15.4939 17.5616 15.9767 17.4104 16.3875 17.1272L26.25 10.333M6.25 24.5413H23.75C24.413 24.5413 25.0489 24.2692 25.5178 23.7847C25.9866 23.3002 26.25 22.6432 26.25 21.958V9.04134C26.25 8.3562 25.9866 7.69912 25.5178 7.21465C25.0489 6.73018 24.413 6.45801 23.75 6.45801H6.25C5.58696 6.45801 4.95107 6.73018 4.48223 7.21465C4.01339 7.69912 3.75 8.3562 3.75 9.04134V21.958C3.75 22.6432 4.01339 23.3002 4.48223 23.7847C4.95107 24.2692 5.58696 24.5413 6.25 24.5413Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Contacto</span>
        </button>
      </div>

      <footer className={styles.footer}>
        <button className={styles.menuItem}>
          <svg
            width="30"
            height="31"
            viewBox="0 0 30 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.75 24.5413L5 15.4997L13.75 6.45801M23.75 24.5413L15 15.4997L23.75 6.45801"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Contraer menú</span>
        </button>

        <button className={styles.menuItemLogout}>
          <svg
            width="30"
            height="31"
            viewBox="0 0 30 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.25 20.667L26.25 15.5003M26.25 15.5003L21.25 10.3337M26.25 15.5003H8.75M16.25 20.667V21.9587C16.25 22.9864 15.8549 23.972 15.1517 24.6987C14.4484 25.4254 13.4946 25.8337 12.5 25.8337H7.5C6.50544 25.8337 5.55161 25.4254 4.84835 24.6987C4.14509 23.972 3.75 22.9864 3.75 21.9587V9.04199C3.75 8.01428 4.14509 7.02866 4.84835 6.30195C5.55161 5.57525 6.50544 5.16699 7.5 5.16699H12.5C13.4946 5.16699 14.4484 5.57525 15.1517 6.30195C15.8549 7.02866 16.25 8.01428 16.25 9.04199V10.3337"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </footer>
    </nav>
  );
};

export default Sidebar;
