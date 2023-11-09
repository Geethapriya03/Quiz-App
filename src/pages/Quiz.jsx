import { child, get, getDatabase, push, ref, update } from 'firebase/database';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageNotFound } from './';
import { AnswerBox, ProgressBar, Rules } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../hooks';

const initialState = { qnaSet: [], currentQuestion: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'quiz':
      return { ...state, qnaSet: action.value, currentQuestion: 0 };
    case 'answer':
      const qnaSet = [...state.qnaSet];
      qnaSet[state.currentQuestion].options[action.optionIndex].checked = action.value;
      return { ...state, qnaSet };
    case 'next':
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case 'prev':
      return { ...state, currentQuestion: state.currentQuestion - 1 };
    default:
      return state;
  }
};

function Quiz() {
  const { id } = useParams();
  const { loading, error, quiz } = useQuiz(id);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const date = useMemo(() => new Date(), []);

  useEffect(() => {
    if (quiz) {
      dispatch({
        type: 'quiz',
        value: quiz,
      });
    }
  }, [quiz]);

  const handleAnswerChange = useCallback(
    (e, optionIndex) => {
      dispatch({
        type: 'answer',
        optionIndex,
        value: e.target.checked,
      });
    },
    [dispatch]
  );

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'next' });
  }, [dispatch]);

  const previousQuestion = useCallback(() => {
    dispatch({ type: 'prev' });
  }, [dispatch]);


  const progressPercentage =
    state.qnaSet.length > 0 ? ((state.currentQuestion + 1) * 100) / state.qnaSet.length : 0;

  const submitQuiz = async () => {
    function getMarkSheet() {
      let correctAnswersCount = 0;
      let incorrectAnswersCount = 0;
      let unattemptedCount = 0;

      state.qnaSet.forEach((question) => {
        const correctIndexes = [];
        const checkedIndexes = [];

        question.options.forEach((option, index) => {
          if (option.correct) correctIndexes.push(index);
          if (option.checked) checkedIndexes.push(index);
        });

        if (checkedIndexes.length === 0) unattemptedCount += 1;
        else if (_.isEqual(correctIndexes, checkedIndexes)) correctAnswersCount += 1;
        else incorrectAnswersCount += 1;
      });

      const noq = state.qnaSet.length;
      const obtainedPoints = correctAnswersCount * 10 - incorrectAnswersCount * 2;
      const obtainedPercentage = (obtainedPoints / (noq * 10)) * 100;

      return {
        noq,
        correctAnswersCount,
        incorrectAnswersCount,
        unattemptedCount,
        obtainedPoints,
        obtainedPercentage,
      };
    }

    const markSheet = getMarkSheet();

    // Define the data you want to save in the database
    const submissionData = {
      topicId: id,
      date: date.toLocaleDateString('en-IN'),
      time: `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() < 12 ? 'AM' : 'PM'
        }`,
      ...markSheet,
      qnaSet: state.qnaSet, // Include the question and answer set
    };

    const { uid } = currentUser;
    const db = getDatabase();
    const submissionsKey = push(child(ref(db), `submissions/${uid}`)).key;
    const submissionsData = {};

    submissionsData[`submissions/${uid}/${submissionsKey}`] = submissionData;

    try {
      // Update submission data in the database
      await update(ref(db), submissionsData);

      // Manually increase submission count
      const submissionCountRef = ref(db, 'submissionCount');
      const snapshot = await get(submissionCountRef);
      if (snapshot.exists()) {
        const currentSubmissionCount = snapshot.val()[id] || 0;
        const updatedSubmissionCount = currentSubmissionCount + 1;

        await update(submissionCountRef, {
          [id]: updatedSubmissionCount,
        });
        console.log('updatedSubmissionCount ', updatedSubmissionCount);
      }
      // Navigate to the result page
      navigate(`/result/${id}`, { state: { markSheet, qnaSet: state.qnaSet } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };



  return (
    <>
      {loading && <p className="page-heading text-lg">Loading ...</p>}
      {error && <PageNotFound />}
      {!loading && !error && state.qnaSet && state.qnaSet.length === 0 && <PageNotFound />}
      {!loading && !error && state.qnaSet && state.qnaSet.length > 0 && (
        <div className="mx-auto w-[85%] animate-reveal">
          <h1 className="page-heading">{id.split('-').join(' ')} Quiz!</h1>
          <Rules />
          <div className="card mb-40 flex flex-col justify-center rounded-md p-3">
            <div className="flex flex-col items-center justify-center text-xl font-bold text-black dark:text-white sm:text-3xl">
              Q. {state.qnaSet[state.currentQuestion].title}
            </div>

            <hr className="mb-8 mt-3 h-px border-0 bg-primary" />

            <AnswerBox
              input
              handleChange={handleAnswerChange}
              options={state.qnaSet[state.currentQuestion].options}
            />

          </div>

          <ProgressBar
            nextQ={nextQuestion}
            prevQ={previousQuestion}
            progress={progressPercentage}
            submit={submitQuiz}
          />
        </div>
      )}
    </>
  );
}

export default Quiz;
