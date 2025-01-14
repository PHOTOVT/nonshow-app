import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/QuestionScreen.module.css";

function QuestionScreen({ onQuestion }) {
  const { questions, setQuestions, players, setPlayers } =
    useContext(AppContext);

  const unansweredQuestions = questions.filter((question) => !question.used);
  const currentQuestion = unansweredQuestions[0] || null;

  const [timeRemaining, setTimeRemaining] = useState(
    currentQuestion?.time || 30
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState([]);

  useEffect(() => {
    if (timeRemaining > 0 && !showAnswer) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showAnswer) {
      setShowAnswer(true);
    }
  }, [timeRemaining, showAnswer]);

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

  const handleReturnToPlayers = () => {
    if (currentQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === currentQuestion.id ? { ...q, used: true } : q
      );
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    }

    onQuestion();
  };

  const handleGuessLetter = (letter) => {
    if (!letter || revealedLetters.includes(letter)) return;

    if (currentQuestion.hiddenWord.includes(letter)) {
      setRevealedLetters([...revealedLetters, letter]);
    }
  };

  const handleQAAnswer = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === currentQuestion.answer) {
        handleRewardPoints(currentQuestion.points);
      } else {
        setShowAnswer(true);
      }
    }
  };

  const renderQuestionContent = () => {
    if (currentQuestion.type === "QA") {
      return (
        <div>
          <input
            type="text"
            placeholder="Your answer"
            onKeyDown={handleQAAnswer}
          />
        </div>
      );
    }

    if (currentQuestion.type === "MCQ") {
      return (
        <div>
          <div className={css.mcqOptionsContainer}>
            {currentQuestion.options &&
            Array.isArray(currentQuestion.options) &&
            currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, index) => (
                <button
                  className={css.mcqOption}
                  key={index}
                  onClick={() =>
                    handleRewardPoints(
                      option === currentQuestion.answer
                        ? currentQuestion.points
                        : 0
                    )
                  }
                >
                  {option}
                </button>
              ))
            ) : (
              <p>No options available</p>
            )}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === "GuessLetters") {
      if (!currentQuestion.hiddenWord) {
        return <p>No word available for guessing</p>;
      }

      const revealedWord = currentQuestion.hiddenWord
        .split("")
        .map((letter) => (revealedLetters.includes(letter) ? letter : "_"))
        .join(" ");

      return (
        <div className={css.guessLettersContainer}>
          <h3 className={css.revealedWord}>{revealedWord}</h3>
          <div className={css.inputContainer}>
            <input
              type="text"
              maxLength={1}
              placeholder="Guess a letter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const guessedLetter = e.target.value.toLowerCase();
                  if (!revealedLetters.includes(guessedLetter)) {
                    handleGuessLetter(guessedLetter);
                    e.target.value = "";
                  }
                }
              }}
            />
          </div>
          {showAnswer && (
            <h3 className={css.correctAnswer}>
              Answer: {currentQuestion.hiddenWord}
            </h3>
          )}
        </div>
      );
    }

    return <p>Unknown question type</p>;
  };

  if (!currentQuestion) {
    return <h3>No unanswered questions available</h3>;
  }

  return (
    <div className={css.container}>
      <h2>{currentQuestion.name}</h2>
      <div className={css.timedOutAnswer}>
        {showAnswer ? (
          <h3 className={css.answer}>
            Answer: {currentQuestion.hiddenWord || currentQuestion.answer}
          </h3>
        ) : (
          <h3 className={css.timer}>Time Remaining: {timeRemaining}s</h3>
        )}
      </div>
      {renderQuestionContent()}
      {showAnswer && (
        <div className={css.decisionContainer}>
          <button onClick={() => handleRewardPoints(currentQuestion.points)}>
            Reward Points
          </button>
          <button onClick={handleReturnToPlayers}>
            Back to players screen
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionScreen;
