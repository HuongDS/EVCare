import styles from "../CSS/WhyEVCare.module.css";
import pic from "../../../assets/User-check.png";
export default function WhyEVCare() {
  return (
    <div className={styles.container}>
      <h1>Why EVCare?</h1>
      <div className={styles.cardsWrapper}>
        <div className={styles.card}>
          <img className={styles.icon} src={pic} />
          <h2 className={styles.titleCard}>Expert EV Technicians</h2>
          <p>
            Certified specialists with deep knowledge of electric vehicles to
            ensure reliable repairs and maintenance.
          </p>
        </div>
        <div className={styles.card}>
          <img className={styles.icon} src={pic} />
          <h2 className={styles.titleCard}>
            Genuine Parts & Inventory Control
          </h2>
          <p>
            We use high-quality EV spare parts with optimized stock management
            to keep your car running smoothly.
          </p>
        </div>
        <div className={styles.card}>
          <img className={styles.icon} src={pic} />
          <h2 className={styles.titleCard}>Clear Pricing & Digital Payments</h2>
          <p>
            Get upfront quotes, track your expenses, and pay easily through
            secure online methods.
          </p>
        </div>
      </div>
    </div>
  );
}
