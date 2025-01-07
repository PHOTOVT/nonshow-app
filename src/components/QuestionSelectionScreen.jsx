import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/QuestionSelectionScreen.module.css";

function QuestionSelectionScreen({ onSelection }) {
  const { questions, setQuestions } = useContext(AppContext);

  const handleSelectQuestion = (questionId) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId ? { ...question, used: true } : question
    );
    setQuestions(updatedQuestions);
    try {
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    onSelection();
  };

  const unusedQuestions = questions.filter((question) => !question.used);

  return (
    <div className={css.container}>
      <h2>Select a Question</h2>
      {unusedQuestions.length > 0 ? (
        <ul className={css.questionList}>
          {unusedQuestions.map((question) => (
            <li key={question.id} className={css.questionItem}>
              <p>{question.name}</p>
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
        <p className={css.noQuestions}>No questions available for selection.</p>
      )}
    </div>
  );
}

export default QuestionSelectionScreen;
