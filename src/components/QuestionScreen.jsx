import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/QuestionScreen.module.css";

function QuestionScreen({ onQuestion }) {
  const { questions, setQuestions, players, setPlayers } = useContext(AppContext);

  const unansweredQuestions = questions.filter((question) => !question.used);

  const currentQuestion = unansweredQuestions[0] || null;

  const [timeRemaining, setTimeRemaining] = useState(currentQuestion?.time || 30);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAnswer(true);
    }
  }, [timeRemaining]);

  const handleRewardPoints = (points) => {
    const updatedPlayers = players.map((player) =>
      player.isActive ? { ...player, points: player.points + points } : player
    );
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    if (currentQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === currentQuestion.id ? { ...q, used: true } : q
      );
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    }

    onQuestion();
  };

  const handleSkip = () => {
    if (currentQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === currentQuestion.id ? { ...q, used: true } : q
      );
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    }

    onQuestion();
  };

  if (!currentQuestion) {
    return <h3>No unanswered questions available</h3>;
  }

  return (
    <div className={css.container}>
      <h2>{currentQuestion.name}</h2>
      <div className={css.timedOutAnswer}>
        {showAnswer ? (
          <h3 className={css.answer}>Answer: {currentQuestion.answer}</h3>
        ) : (
          <h3 className={css.timer}>Time Remaining: {timeRemaining}s</h3>
        )}
      </div>
      {showAnswer && (
        <div className={css.decisionContainer}>
          <button onClick={() => handleRewardPoints(currentQuestion.points)}>
            Reward Points
          </button>
          <button onClick={handleSkip}>Skip</button>
        </div>
      )}
    </div>
  );
}

export default QuestionScreen;
