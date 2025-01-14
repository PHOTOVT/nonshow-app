import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/QuestionSelectionScreen.module.css";

function QuestionSelectionScreen({ onSelection }) {
  const { questions, setQuestions } = useContext(AppContext);
  const [localQuestions, setLocalQuestions] = useState(questions);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions");
    if (savedQuestions) {
      setLocalQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(localQuestions));
  }, [localQuestions]);

  const handleSelectQuestion = (questionId) => {
    const updatedQuestions = localQuestions.map((question) => {
      if (question.id === questionId) {
        return { ...question, used: true };
      }
      return question;
    });

    setLocalQuestions(updatedQuestions);

    onSelection();
  };

  const unusedQuestions = localQuestions.filter((question) => !question.used);

  return (
    <div className={css.container}>
      <h2>Select a Question</h2>
      {unusedQuestions.length > 0 ? (
        <ul className={css.questionList}>
          {unusedQuestions.map((question) => (
            <li key={question.id} className={css.questionItem}>
              <h3>{question.name}</h3>
              <button
                onClick={() => handleSelectQuestion(question.id)}
                aria-label={`Select question: ${question.name}`}
                className={css.selectButton}
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <h3 className={css.noQuestions}>
          No questions available for selection
        </h3>
      )}
    </div>
  );
}

export default QuestionSelectionScreen;
