import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Loader from "./components/Loader";
import ConfigurationMode from "./components/ConfigurationMode";
import SplashScreen from "./components/SplashScreen";
import PlayersScreen from "./components/PlayersScreen";

function App() {
  const [mode, setMode] = useState("configuration");
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setMode("loading");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMode("splash");
    }, 2000);
  };

  const handleSplashComplete = () => {
    setMode("players");
  };

  return (
    <AppProvider>
      {mode === "configuration" && <ConfigurationMode onSplash={handleStart} />}
      {mode === "loading" && <Loader loading={loading} />}
      {mode === "splash" && <SplashScreen onPlayers={handleSplashComplete} />}
      {mode === "players" && <PlayersScreen />}
    </AppProvider>
  );
}

export default App;
