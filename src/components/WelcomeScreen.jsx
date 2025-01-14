import { useEffect } from "react";
import css from "../styles/WelcomeScreen.module.css";

const WelcomeScreen = ({ onWelcome }) => {
  const handleKeyPress = (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      onWelcome();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={css.welcomeContainer}>
      <h1 className={css.welcomeTitle}>Welcome to NonShow Quiz!</h1>
      <p className={css.welcomeInstructions}>
        Press <strong>Space</strong> to start configuring your quiz
      </p>
    </div>
  );
};

export default WelcomeScreen;
