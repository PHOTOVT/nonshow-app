import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { v4 as uuidv4 } from "uuid";

import appSettings from "../appsettings";
import Loader from "./Loader";

import css from "../styles/ConfigurationMode.module.css";

function ConfigurationMode({ onConfiguration }) {
  const { setPlayers, setQuestions } = useContext(AppContext);

  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [importJSON, setImportJSON] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const maxQuestions = 64;

  const [playerLimit, setPlayerLimit] = useState(appSettings.defaultNumPlayers);
  const [timeLimitPerQuestion, setTimeLimitPerQuestion] = useState(
    appSettings.defaultTimePerQuestion
  );
  const [questionPoints, setQuestionPoints] = useState(
    appSettings.pointsPerQuestion
  );
  const [splashDuration, setSplashDuration] = useState(
    appSettings.splashScreenTime
  );
  const [questionType, setQuestionType] = useState("QA");
  const [answerOptions, setAnswerOptions] = useState(["", "", ""]);
  const [hiddenWord, setHiddenWord] = useState("");

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    if (savedQuestions) setQuestions(savedQuestions);

    const savedPlayers = JSON.parse(localStorage.getItem("players"));
    if (savedPlayers) setPlayers(savedPlayers);

    const savedSettings = JSON.parse(localStorage.getItem("appSettings"));
    if (savedSettings) {
      setPlayerLimit(savedSettings.defaultNumPlayers);
      setTimeLimitPerQuestion(savedSettings.defaultTimePerQuestion);
      setQuestionPoints(savedSettings.pointsPerQuestion);
      setSplashDuration(savedSettings.splashScreenTime);
    }
  }, [setQuestions, setPlayers]);

  const handleAddQuestion = () => {
    if (questionText && answerText) {
      if (questionText.length > 64) {
        alert("Question text cannot be more than 64 characters.");
        return;
      }
      if (answerText.length > 64) {
        alert("Answer text cannot be more than 64 characters.");
        return;
      }

      if (
        questionType === "MCQ" &&
        answerOptions.some((opt) => opt.length === 0)
      ) {
        alert("Please fill in all the answer options for Multiple Choice.");
        return;
      }

      const savedQuestions =
        JSON.parse(localStorage.getItem("questions")) || [];
      if (savedQuestions.length >= maxQuestions) {
        alert(`You can only add a maximum of ${maxQuestions} questions.`);
        return;
      }

      const newQuestion = {
        name: questionText,
        answer: answerText,
        points: questionPoints,
        used: false,
        id: uuidv4(),
        time: timeLimitPerQuestion,
        type: questionType,
        options: questionType === "MCQ" ? answerOptions : undefined,
        hiddenWord: questionType === "GuessLetters" ? hiddenWord : undefined,
      };

      setQuestions((prev) => [...prev, newQuestion]);
      localStorage.setItem(
        "questions",
        JSON.stringify([...savedQuestions, newQuestion])
      );

      setQuestionText("");
      setAnswerText("");
      setAnswerOptions(["", "", ""]);
      setHiddenWord("");
    }
  };

  const handleNumberOfPlayersChange = (event) => {
    let number = parseInt(event.target.value, 10);

    if (number > 8) {
      alert("The maximum number of players is 8.");
      number = 8;
    }

    if (number < 0 || isNaN(number)) {
      number = 0;
    }

    setNumberOfPlayers(number);

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
  };

  const saveSettings = () => {
    const updatedSettings = {
      defaultNumPlayers: playerLimit,
      defaultTimePerQuestion: timeLimitPerQuestion,
      pointsPerQuestion: questionPoints,
      splashScreenTime: splashDuration,
    };

    localStorage.setItem("appSettings", JSON.stringify(updatedSettings));
    alert("Settings saved!");
  };

  const handleBulkImport = () => {
    try {
      const parsedData = JSON.parse(importJSON);
      if (Array.isArray(parsedData.questions)) {
        const importedQuestions = parsedData.questions.map((question) => ({
          name: question.name || "Unnamed Question",
          answer: question.answer || "No Answer",
          points: question.points || 0,
          used: question.used || false,
          id: question.id || uuidv4(),
          time: question.time || 0,
          type: question.type || "QA",
        }));

        setQuestions(importedQuestions);
        localStorage.setItem("questions", JSON.stringify(importedQuestions));
        setImportJSON("");
      } else {
        setError("Invalid JSON format: No questions array found!");
      }
    } catch (error) {
      console.error("Error importing JSON:", error);
      setError("Invalid JSON format!");
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
      setPlayerLimit(appSettings.defaultNumPlayers);
      setTimeLimitPerQuestion(appSettings.defaultTimePerQuestion);
      setQuestionPoints(appSettings.pointsPerQuestion);
      setSplashDuration(appSettings.splashScreenTime);
    }
  };

  return (
    <div className={css.container}>
      <div className={css.inputGroup}>
        <h2>Quiz Settings</h2>
        <label className={css.inputLabel}>
          Number of players (max 8)
          <input
            className={css.input}
            type="number"
            value={numberOfPlayers}
            onChange={handleNumberOfPlayersChange}
          />
        </label>
      </div>

      <div className={css.settingsContainer}>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>
            Time per question
            <input
              className={css.input}
              type="number"
              value={timeLimitPerQuestion}
              onChange={(e) =>
                setTimeLimitPerQuestion(Math.max(0, +e.target.value || 0))
              }
            />
          </label>
        </div>

        <div className={css.inputGroup}>
          <label className={css.inputLabel}>
            Points per question
            <input
              className={css.input}
              type="number"
              value={questionPoints}
              onChange={(e) =>
                setQuestionPoints(Math.max(0, +e.target.value || 0))
              }
            />
          </label>
        </div>

        <div className={css.inputGroup}>
          <label className={css.inputLabel}>
            Splash screen duration
            <input
              className={css.input}
              type="number"
              value={splashDuration}
              onChange={(e) =>
                setSplashDuration(Math.max(0, +e.target.value || 0))
              }
            />
          </label>
        </div>
        <button className={css.saveSettings} onClick={saveSettings}>
          Save settings
        </button>
      </div>

      <div>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>
            Select question type
            <select
              className={css.inputSelect}
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="QA">Question and answer</option>
              <option value="MCQ">Multiple choice</option>
              <option value="GuessLetters">Guess the letters</option>
            </select>
          </label>
        </div>

        <div className={css.inputGroup}>
          <label className={css.inputLabel}>
            Question
            <input
              className={css.input}
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </label>
        </div>

        {questionType === "MCQ" && (
          <div className={css.inputGroup}>
            <label className={css.inputLabel}>Answer options</label>
            {answerOptions.map((option, index) => (
              <input
                className={css.input}
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const updated = [...answerOptions];
                  updated[index] = e.target.value;
                  setAnswerOptions(updated);
                }}
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>
        )}

        {questionType === "GuessLetters" && (
          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Answer (Hidden word)
              <input
                className={css.input}
                type="text"
                value={hiddenWord}
                onChange={(e) => setHiddenWord(e.target.value)}
              />
            </label>
          </div>
        )}

        <div className={css.inputGroup}>
          <label className={css.inputLabel}>
            Answer
            <input
              className={css.input}
              type="text"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
          </label>
        </div>

        <button
          className={css.addQAndA}
          onClick={handleAddQuestion}
          disabled={
            JSON.parse(localStorage.getItem("questions"))?.length >=
            maxQuestions
          }
        >
          Add Q&A
        </button>

        <div className={css.bulkImport}>
          <label className={css.inputLabel}>Bulk import (JSON format)</label>
          <textarea
            className={css.importDataTextarea}
            value={importJSON}
            onChange={(event) => setImportJSON(event.target.value)}
            rows={10}
            cols={50}
          />
          {error && <p className={css.errorText}>{error}</p>}
          <button onClick={handleBulkImport}>Import questions</button>
        </div>
      </div>

      <div className={css.configurationButtons}>
        <button onClick={handleExport}>Export questions</button>
        <button onClick={handleReset}>Reset all data</button>
        <button onClick={onConfiguration} disabled={!numberOfPlayers}>
          Start quiz!
        </button>
      </div>
    </div>
  );
}

export default ConfigurationMode;
