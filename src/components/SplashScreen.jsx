import { useEffect } from "react";
import appSettings from "../appsettings";

function SplashScreen({ onPlayers }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onPlayers();
    }, parseInt(appSettings.splashScreenTime, 10));
    return () => clearTimeout(timer);
  }, [onPlayers]);

  return (
    <div>
      <h1>Welcome to the Game!</h1>
      <p>Get ready, the game is about to start...</p>
    </div>
  );
}

export default SplashScreen;
