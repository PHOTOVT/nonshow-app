import { useEffect } from "react";
import appSettings from "../appsettings";
import styles from "../styles/SplashScreen.module.css";

function SplashScreen({ onSplash }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplash();
    }, parseInt(appSettings.splashScreenTime, 10) * 1000);
    return () => clearTimeout(timer);
  }, [onSplash]);

  return (
    <div className={styles.container}>
      <h2 className={styles.text}>
        <span className={`${styles.letter} ${styles.letter1}`}>Non</span>
        <span className={`${styles.letter} ${styles.letter2}`}>Show</span>
        <span className={`${styles.letter} ${styles.letter3}`}>Quiz</span>
      </h2>
    </div>
  );
}

export default SplashScreen;
