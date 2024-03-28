import React, {useState} from 'react'
import styles from '../../style.js'

const Question = (props) => {
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

    function toggleAnswer() {
        setIsAnswerVisible(!isAnswerVisible);
    }

    return(
        
        <div className="pt-6 pb-6">
      <dt className="text-lg">
        <button className="text-left w-full flex justify-between items-start text-gray-400" type="button" aria-expanded={isAnswerVisible} onClick={toggleAnswer}>
          <span className={`font-medium text-gray-900`}>{props.question}</span>
          <span className="ml-6 h-7 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className={`rotate-${isAnswerVisible ? '180' : '0'} h-6 w-6 transform`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
            </svg>
          </span>
        </button>
      </dt>
      {isAnswerVisible && <dd className={`${styles.paragraph} mt-2 pr-12 text-gray-500`}>{props.answer}</dd>}
    </div>
  );
}

export default Question