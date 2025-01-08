import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/QuestionScreen.module.css";

function QuestionScreen({ onQuestion }) {
  const { questions, setQuestions, players, setPlayers } =
    useContext(AppContext);

  const unansweredQuestions = questions.filter(
    (question) =>
      question.time &&
      question.name &&
      question.answer &&
      question.points &&
      !question.used
  );

  const currentQuestion = unansweredQuestions[0] || null;

  const [timeRemaining, setTimeRemaining] = useState(
    currentQuestion?.time || 30
  );
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
    return <p>No unanswered questions available.</p>;
  }

  return (
    <div className={css.container}>
      <h2>Question</h2>
      <p className={css.question}>{currentQuestion.name}</p>
      <div className={css.timer}>
        {showAnswer ? (
          <p className={css.answer}>Answer: {currentQuestion.answer}</p>
        ) : (
          <p>Time Remaining: {timeRemaining}s</p>
        )}
      </div>
      {showAnswer && (
        <div className={css.actions}>
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
