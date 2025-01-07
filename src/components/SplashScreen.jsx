import { useEffect } from "react";
import appSettings from "../appsettings";

function SplashScreen({ onSplash }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplash();
    }, parseInt(appSettings.splashScreenTime, 10));
    return () => clearTimeout(timer);
  }, [onSplash]);

  return (
    <div>
      <h1>Welcome to the Game!</h1>
      <p>Get ready, the game is about to start...</p>
    </div>
  );
}

export default SplashScreen;
