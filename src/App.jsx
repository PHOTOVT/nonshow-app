import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Loader from "./components/Loader";
import ConfigurationMode from "./components/ConfigurationMode";
import SplashScreen from "./components/SplashScreen";
import PlayersScreen from "./components/PlayersScreen";
import QuestionSelectionScreen from "./components/QuestionSelectionScreen";

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

  const handleSplash = () => {
    setMode("players");
  };

  const handleSelection = () => {
    setMode("selection");
  };

  return (
    <AppProvider>
      {mode === "configuration" && <ConfigurationMode onSplash={handleStart} />}
      {mode === "loading" && <Loader loading={loading} />}
      {mode === "splash" && <SplashScreen onPlayers={handleSplash} />}
      {mode === "players" && <PlayersScreen onSelection={handleSelection}/>}
      {mode === "selection" && <QuestionSelectionScreen />}
    </AppProvider>
  );
}

export default App;
