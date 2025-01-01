import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { appSettings } from "../appsettings";

function ConfigurationMode() {
  const {setPlayers, setQuestions} = useContext(AppContext);

const [numPlayers, setNumPlayers] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [questionAnswerText, setQuestionAnswerText] = useState("");
  const [importJSON, setImportJSON] = useState("");
  const [error, setError] = useState("");

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
    setQuestions((prev) => [...prev, { text: questionText, points: 10 }]);
    setQuestionText("");
  };

  return (
    <div>
      <h2>Configuration Mode</h2>
      <label>Players:</label>
      <input
        type="number"
        value={numPlayers}
        onChange={(event) => {
          const num = +event.target.value;
          setNumPlayers(num);
          const playersArray = [];
          for (let i = 0; i < num; i++) {
            playersArray.push({
              id: i + 1,
              name: `Player ${i + 1}`,
              points: 0,
            });
          }
          setPlayers(playersArray);
        }}
      />

      <label>Questions:</label>
      <input
        type="text"
        value={questionText}
        onChange={(event) => setQuestionText(event.target.value)}
      />
      <button onClick={handleAddQuestion}>Add Question</button>
    </div>
  );
}

export default ConfigurationMode;
