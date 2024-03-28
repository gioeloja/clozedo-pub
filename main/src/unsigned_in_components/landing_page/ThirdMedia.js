import React from 'react'
import grayRect from '../assets/grayRect.png'
import styles, {layout} from '../../style.js'

const ThirdMedia = () => {
    return(
        <section className={layout.section}>
            <div className={layout.sectionImg}>
                <img src={grayRect} alt="tempImg" className='w-[60%]'/>
            </div>
            <div className={`${layout.sectionInfo} ml-6`}>
                <h2 className={` ${styles.heading2} text-[30px] sm:mt-5 max-w-[380px] leading-normal`}>Oh yea cool picture caption go here</h2>
                <p className={`${styles.paragraph} text-[18px] max-w-[400px] text-[#444444] py-4`}>
                Sample text Sample text Sample text Sample text Sample text Sample text Sample text </p>
            </div>
            
        </section>
    )
}

export default ThirdMedia