import React from 'react'
import styles from "../../style.js";

const Pitch = () => {
    return(
        <div>
            <h1 className={`flex-1 font-bold flex md:flex-row flex-col justify-center text-center ss:text-text[72px] text-[30px] sm:text-[55px] ss:leading-[100px] leading-[60px] sm:leading-[75px] py-6 ${styles.heading1}`}>
            Revolutionize your reselling business <br className='sm:block hidden'></br> with Clozedo
            </h1>
            <p className={`${styles.paragraph} text-center text-[#444444] text-[24px] `}> An app designed to maximize your revenue and<br className='sm:block hidden'></br> make reselling a breeze.</p>
            <div class="flex justify-center items-center py-6">
            <button class="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 content-center">Try 7 days free</button>
            </div>
        </div>

    )
}

export default Pitch