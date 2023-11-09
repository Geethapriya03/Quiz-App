import React from 'react';
import { CheckBox } from './';

function AnswerBox({ handleChange, options }) {
  return (
    <div className="mb-2">
      <div className="grid grid-cols-options grid-rows-[repeat(3,auto)] gap-2 lg:grid-flow-col lg:gap-4">
        {options.map((option, index) => (
          <CheckBox
            key={index}
            className={`answer-option ${option.checked ? 'answer-wrong' : ''}`}
            checked={option.checked} // Always provide a controlled value
            text={option.title}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
      </div>
    </div>
  );
}

export default AnswerBox;
