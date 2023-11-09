import { useEffect, useState } from 'react';
import jsonData from '../pages/QuizzyDatabase.json';

export default function usePopularQuizzes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popularQuizzes, setPopularQuizzes] = useState([]);

  useEffect(() => {
    // Fetch popular quizzes from the JSON data
    try {
      setError(false);
      setLoading(true);

      // Assuming you have a JSON structure where each item has a 'submissionCount' property
      const sortedData = jsonData
        .filter((item) => item.submissionCount !== undefined)
        .sort((a, b) => b.submissionCount - a.submissionCount)
        .slice(0, 4);

      setPopularQuizzes(sortedData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  }, []);

  return { loading, error, popularQuizzes };
}
