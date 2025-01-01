import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);

  return (
    <AppContext.Provider
      value={{ players, setPlayers, questions, setQuestions }}
    >
      {children}
    </AppContext.Provider>
  );
};
