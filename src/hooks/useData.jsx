import { useEffect, useState } from 'react';
// Import your JSON data directly
import jsonData from '../pages/QuizzyDatabase.json';

export default function useData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from the JSON file
    try {
      setError(false);
      setLoading(true);

      // Use your JSON data directly
      const dataValues = jsonData; // Use the data from your JSON file

      setData(dataValues);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
      setError(true);
    }
  }, []); // No dependencies needed since we're using static JSON data

  return { loading, error, data };
}
