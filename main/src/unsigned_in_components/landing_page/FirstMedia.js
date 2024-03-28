import React from 'react';
import firstMedia from '../assets/cloz_firstmedia.png';
import styles, { layout } from '../../style.js';

const FirstMedia = () => {
  return (
    <section className={layout.section}>
      <div className="md:w-full lg:w-[500px] xl:w-[600px]  3xl:w-[650px]">
        <img src={firstMedia} alt="tempImg" style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className={`${layout.sectionInfo} sm:ml-6`}>
        <h2 className={` ${styles.heading2} max-w-[700px] leading-normal font-bold items-start`}>
          Visualize your closet trends
        </h2>
        <p className={`${styles.paragraph} max-w-[700px] text-[#444444] py-4`}>
          Empower your store's success with our innovative dashboard! Utilize our advanced analytics and interactive charts to gain invaluable insights into your sales performance. Make data-driven decisions and achieve sales outcomes that perfectly align with your vision.
        </p>
        <button class="px-4 py-2 font-semibold bg-indigo-600 text-white bg-[#6069a8] rounded-md hover:bg-indigo-500 content-center">Get started</button>
      </div>
    </section>
  );
};

export default FirstMedia;
