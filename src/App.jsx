import React from "react";
import { AppProvider } from "./context/AppContext";
import ConfigurationMode from "./components/ConfigurationMode";

function App() {
  return (
    <AppProvider>
      <ConfigurationMode />
    </AppProvider>
  );
}

export default App;
