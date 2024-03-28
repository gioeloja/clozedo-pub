import React from 'react';
import grayRect from '../assets/cloz_share.jpg';
import styles, { layout } from '../../style.js';

const SecondMedia = () => {
  return (
    
    <section className={layout.sectionReverse}>
      <div className={`${layout.sectionInfo} sm:ml-6 min-w-[250px] `}>
        <h2 className={` ${styles.heading2} max-w-[700px] leading-normal font-bold items-start`}>
            Less effort, greater results
          </h2>
          <p className={`${styles.paragraph} max-w-[700px] text-[#444444] py-4`}>
            Say goodbye to tedious tasks. Streamline your workflow with our automated sharing and offer sending. Let our technology work for you, leaving you free to focus on what truly matters - growing your business!
          </p>
          <button className="px-4 py-2 font-semibold bg-indigo-600 text-white bg-[#6069a8] rounded-md hover:bg-indigo-500 content-center">Get started</button>
      </div>
      <div className="flex flex-row-reverse flex-col-sm md:ml-10 ml-0 md:mt-0 mt-10 relative justify-center items-center">
        <div
          className="rounded-xl"
          style={{
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.3)', // Stronger shadow effect with multiple box shadows
            width: '80%',
            overflow: 'hidden', // Ensure the shadow does not overflow outside the container
          }}
        >
          <img
            src={grayRect}
            alt="tempImg"
            className="rounded-xl"
            style={{
              width: '100%',
              display: 'block',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SecondMedia;
