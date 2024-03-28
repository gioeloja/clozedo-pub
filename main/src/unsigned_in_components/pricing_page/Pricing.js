import React from 'react';
import styles from "../../style.js";
import {Navbar, Footer, Display} from './index.js';
//import './index.css';

function Pricing () {
  return (
    <div className="bg-primary w-full overflow-hidden ">
      <div className={`${styles.paddingX}} ${styles.flexCenter} shadow-md` }>
        <div className = {`${styles.boxWidth} `}>
        <Navbar/>
        </div>  
      </div>

      <div>
        <div className="">
          <div className = {`bg-primary ${styles.paddingX}  my-10 ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
              <Display/>
            </div>
          </div>
          <div className="mt-20">
            <Footer />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Pricing ;
