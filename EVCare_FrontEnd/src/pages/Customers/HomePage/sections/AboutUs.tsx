import React from "react";
import styles from "../CSS/AboutUs.module.css";
export default function AboutUs() {
  return (
    <div className={styles.wrapperAboutUs}>
      <div className={styles.aboutUs}>
        <h2 className={styles.title}>ABOUT US</h2>
        <p className={styles.aboutUsText}>
          We are committed to delivering{" "}
          <span className={styles.highlightBlue}>reliable</span>,{" "}
          <span className={styles.highlightBlue}>transparent</span>, and{" "}
          <span className={styles.highlightBlue}>tech-driven</span> EV
          maintenance services, ensuring every journey is safe and worry-free.
        </p>
      </div>

      <div className={styles.aboutUsDetail}>
        <p className={styles.aboutUsDetailNumber}>5,000+</p>
        <p className={styles.aboutUsDetailDescription}>
          Electric Vehicles Serviced
        </p>
        <p className={styles.aboutUsDetailNumber}>50+</p>
        <p className={styles.aboutUsDetailDescription}>Certified Technicians</p>
        <p className={styles.aboutUsDetailNumber}>10</p>
        <p className={styles.aboutUsDetailDescription}>
          Years of Trusted Service
        </p>
      </div>
    </div>
  );
}
