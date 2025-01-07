import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

function QuestionScreen({ question, onNextQuestion, onQuestion }) {
  const { questions, setQuestions } = useContext(AppContext);

  const [timeLeft, setTimeLeft] = useState(question?.time);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!question) return;

    if (timeLeft > 0 && !showAnswer) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
      if (onQuestion) {
        onQuestion();
      }
    }
  }, [timeLeft, showAnswer, onQuestion, question]);

  const handleRewardPoints = (points) => {
    if (!question) return;

    const updatedQuestions = questions.map((q) =>
      q.id === question.id ? { ...q, rewarded: points } : q
    );

    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    onNextQuestion();
  };

  return (
    <div>
      <h2>Question Screen</h2>
      <div>
        {showAnswer ? (
          <div>
            <p>
              <strong>Answer:</strong> {question.answer}
            </p>
            <div>
              <button onClick={() => handleRewardPoints(question.points)}>
                Reward Points
              </button>
              <button onClick={() => handleRewardPoints(0)}>Skip Points</button>
            </div>
          </div>
        ) : (
          <div>
            <p>
              <strong>Question:</strong> {question?.name || "No question name"}
            </p>
            <p>Time Left: {timeLeft} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionScreen;
