import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Loader from "./components/Loader";
import ConfigurationMode from "./components/ConfigurationMode";
import SplashScreen from "./components/SplashScreen";
import PlayersScreen from "./components/PlayersScreen";
import QuestionSelectionScreen from "./components/QuestionSelectionScreen";
import QuestionScreen from "./components/QuestionScreen";
import WelcomeScreen from "./components/WelcomeScreen";

function App() {
  const [mode, setMode] = useState("welcome");
  const [loading, setLoading] = useState(false);

  const handleWelcome = () => {
    setMode("configuration");
  };

  const handleConfiguration = () => {
    setMode("loading");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMode("splash");
    }, 3000);
  };

  const handleSplash = () => {
    setMode("players");
  };

  const handlePlayers = () => {
    setMode("selection");
  };

  const handleSelection = () => {
    setMode("question");
  };

  const handleQuestion = () => {
    setMode("players");
  };

  return (
    <AppProvider>
      <div className="App">
        {mode === "welcome" && <WelcomeScreen onWelcome={handleWelcome} />}
        {mode === "configuration" && (
          <ConfigurationMode onConfiguration={handleConfiguration} />
        )}
        {mode === "loading" && <Loader loading={loading} />}
        {mode === "splash" && <SplashScreen onSplash={handleSplash} />}
        {mode === "players" && <PlayersScreen onPlayers={handlePlayers} />}
        {mode === "selection" && (
          <QuestionSelectionScreen onSelection={handleSelection} />
        )}
        {mode === "question" && <QuestionScreen onQuestion={handleQuestion} />}
      </div>
    </AppProvider>
  );
}

export default App;
