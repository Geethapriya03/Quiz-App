import { useEffect, useState } from 'react';
import jsonData from '../pages/QuizzyDatabase.json';

export default function useQuiz(topicID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState(null);
  // console.log(jsonData);
  useEffect(() => {
    async function fetchQuizData() {
      try {
        setError(false);
        setLoading(true);

        // Filter the data based on the topicID
        const filteredData = jsonData.quizzes[topicID]; // Assuming 'topics' is an object
        // console.log(filteredData);
        if (filteredData) {
          // Use the filtered data as your quiz
          setQuiz(filteredData.questions);
          setLoading(false);
        } else {
          // Handle the case where the topicID doesn't exist
          setLoading(false);
          setError(true);
        }
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    }

    fetchQuizData();
  }, [topicID]);

  return { loading, error, quiz };
}
