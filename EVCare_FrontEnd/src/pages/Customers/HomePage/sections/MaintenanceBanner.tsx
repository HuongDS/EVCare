import Button from "react-bootstrap/Button";
import styles from "../CSS/Banner.module.css";
export default function MaintenanceBanner() {
  return (
    <div className={styles.maintenanceBanner}>
      <div>
        <h1 className={styles.bannerTitle}>
          Smart Maintenance Management for EV Service Centers
        </h1>
        <Button size="lg" variant="primary" type="submit">
          Book a Service
        </Button>
      </div>
    </div>
  );
}
