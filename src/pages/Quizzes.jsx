import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer, Thumbnail } from '../components';

// Import your JSON data without specifying the relative path
import topicsData from './QuizzyDatabase.json';

function Quizzes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate a loading delay (you can remove this in your final code)
    setLoading(true);
    // Simulated delay for loading
    // setTimeout(() => {
    setData(topicsData.topics);
    //console.log('Data:', topicsData.topics);
    // Set your data from the JSON file
    setLoading(false);
    // You can add error handling logic if needed
    // setError(true);
    // }, 1000);
  }, []);

  return (
    <>
      <div className="mx-auto mb-32 flex min-h-screen w-[90%] animate-reveal flex-col items-center">
        <h1 className="page-heading">Attempt Quizzes</h1>
        {data && Object.keys(data).length > 0 ? (
          <div className="mx-auto grid h-full w-full grid-cols-quizzes justify-items-center gap-7">
            {Object.keys(data).map((topicID) => {
              const topic = data[topicID];
              //console.log(topic);
              if (topic.noq > 0) {
                return (
                  <Link key={topicID} to={`/quiz/${topic.topicID}`}>
                    <Thumbnail id={topic.topicID} noq={topic.noq} title={topic.title} type="quiz" />
                  </Link>
                );
              } else {
                return (
                  <div key={topicID} className="w-full">
                    <Thumbnail id={topic.topicID} noq={topic.noq} title={topic.title} type="quiz" />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center text-center text-xl">
            {!loading && <p>No data found!</p>}
            {error && <p>There was an error!</p>}
            {loading && <p>Loading ...</p>}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Quizzes;
