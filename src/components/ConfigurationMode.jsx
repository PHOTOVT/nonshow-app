import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/ConfigurationMode.module.css";
import appSettings from "../appsettings";
import Loader from "./Loader";


function ConfigurationMode({onStart}) {
  const { setPlayers, questions, setQuestions } = useContext(AppContext);

  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionAnswerText, setQuestionAnswerText] = useState("");
  const [importJSON, setImportJSON] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    const savedPlayers = JSON.parse(localStorage.getItem("players"));

    if (savedQuestions) {
      setQuestions(savedQuestions);
    }
    if (savedPlayers) {
      setPlayers(savedPlayers);
    }
  }, [setPlayers, setQuestions]);

  const handleAddQuestion = () => {
    if (questionText && questionAnswerText) {
      setQuestions((prev) => [
        ...prev,
        {
          question: questionText,
          answer: questionAnswerText,
          points: appSettings.pointsPerQuestion,
        },
      ]);

      const trimmedQuestion = questionText.trim();
      const trimmedAnswer = questionAnswerText.trim();

      setQuestionText("");
      setQuestionAnswerText("");
      const updatedQuestions = [
        ...questions,
        { question: trimmedQuestion, answer: trimmedAnswer },
      ];
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    }
  };

  const handleBulkImport = () => {
    try {
      setLoading(true);
      const importedQuestions = JSON.parse(importJSON);
      setQuestions(importedQuestions);
      localStorage.setItem("questions", JSON.stringify(importedQuestions));
      setImportJSON("");
      setError("");
    } catch (err) {
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
              id: i + 1,
              name: `Player ${i + 1}`,
              points: 0,
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
        <p>
          Splash screen duration: {appSettings.splashScreenTime} seconds
        </p>
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
        value={questionAnswerText}
        onChange={(event) => setQuestionAnswerText(event.target.value)}
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
      <button onClick={onStart}>Start</button>
    </div>
  );
}

export default ConfigurationMode;
