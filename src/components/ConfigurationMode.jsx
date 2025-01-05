import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { v4 as uuidv4 } from "uuid";

import appSettings from "../appsettings";
import Loader from "./Loader";

import css from "../styles/ConfigurationMode.module.css";

function ConfigurationMode({ onSplash }) {
  const { setPlayers, questions, setQuestions } = useContext(AppContext);

  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [importJSON, setImportJSON] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    if (savedQuestions) {
      setQuestions(savedQuestions);
    }

    const savedPlayers = JSON.parse(localStorage.getItem("players"));
    if (savedPlayers) {
      setPlayers(savedPlayers);
    }
  }, [setQuestions, setPlayers]);

  const handleAddQuestion = () => {
    if (questionText && answerText) {
      const newQuestion = {
        name: questionText,
        answer: answerText,
        points: appSettings.pointsPerQuestion,
        used: false,
        id: uuidv4(),
      };

      setQuestions((prev) => [...prev, newQuestion]);
      localStorage.setItem(
        "questions",
        JSON.stringify([...questions, newQuestion])
      );

      setQuestionText("");
      setAnswerText("");
    }
  };

  const handleBulkImport = () => {
    try {
      const importedQuestions = JSON.parse(importJSON).map((question) => ({
        ...question,
        id: question.id || uuidv4(),
        used: question.used || false,
      }));
      setQuestions(importedQuestions);
      localStorage.setItem("questions", JSON.stringify(importedQuestions));
      setImportJSON("");
    } catch (error) {
      setError("Invalid JSON format!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      setLoading(true);
      const data = JSON.stringify({
        questions: JSON.parse(localStorage.getItem("questions")) || [],
        players: JSON.parse(localStorage.getItem("players")) || [],
      });
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "questions_and_players.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      localStorage.clear();
      setPlayers([]);
      setQuestions([]);
    }
  };

  return (
    <div>
      <h2>Configuration Mode</h2>
      <label>Players:</label>
      <input
        type="number"
        value={numberOfPlayers}
        onChange={(event) => {
          const number = event.target.value ? +event.target.value : 0;
          setNumberOfPlayers(event.target.value);

          const playersArray = [];
          for (let i = 0; i < number; i++) {
            playersArray.push({
              id: uuidv4(),
              name: `Player ${i + 1}`,
              points: 0,
              isActive: i === 0,
            });
          }
          setPlayers(playersArray);
          localStorage.setItem("players", JSON.stringify(playersArray));
        }}
      />

      <div>
        <h3>App Settings:</h3>
        <p>Points per question: {appSettings.pointsPerQuestion}</p>
        <p>Time per question: {appSettings.defaultTimePerQuestion} seconds</p>
        <p>Splash screen duration: {appSettings.splashScreenTime} seconds</p>
      </div>

      <label>Question:</label>
      <input
        type="text"
        value={questionText}
        onChange={(event) => setQuestionText(event.target.value)}
      />

      <label>Answer:</label>
      <input
        type="text"
        value={answerText}
        onChange={(event) => setAnswerText(event.target.value)}
      />

      {loading && <Loader />}
      <button onClick={handleAddQuestion}>Add Question & Answer</button>

      <div>
        <label>Bulk Import (JSON format):</label>
        <textarea
          className={css.importDataTextarea}
          value={importJSON}
          onChange={(event) => setImportJSON(event.target.value)}
          rows={10}
          cols={40}
        />
        <button onClick={handleBulkImport}>Import Questions</button>
      </div>

      <button onClick={handleExport}>Export</button>
      <button onClick={handleReset}>Reset All Data</button>
      <button onClick={onSplash}>Start</button>
    </div>
  );
}

export default ConfigurationMode;
