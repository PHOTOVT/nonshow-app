import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import ConfigurationMode from "./components/ConfigurationMode";
import SplashScreen from "./components/SplashScreen";
import Loader from "./components/Loader";

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

  // const handleContinue = () => {
  //   setMode("loading");
  //   setLoading(true);

  //   setTimeout(() => {
  //     setLoading(false);
  //     setMode("show");
  //   }, 3000);
  // };

  return (
    <AppProvider>
      {mode === "configuration" && <ConfigurationMode onStart={handleStart} />}
      {mode === "loading" && <Loader loading={loading} />}
      {mode === "splash" && <SplashScreen />}
      {/* {mode === "show" && <div>Show Mode Screen</div>} */}
    </AppProvider>
  );
}

export default App;
