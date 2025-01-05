import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function QuestionSelectionScreen({ onQuestionSelected }) {
  const { questions, setQuestions } = useContext(AppContext);

  const handleSelectQuestion = (questionId) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? { ...question, used: true } 
        : question
    );
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions)); 
    onQuestionSelected(questionId); 
  };

  return (
    <div>
      <h2>Select a Question</h2>
      <ul>
        {questions
          .filter((question) => !question.used) 
          .map((question) => (
            <li key={question.id}>
              <p>{question.name}</p>
              <button onClick={() => handleSelectQuestion(question.id)}>Select</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default QuestionSelectionScreen;
