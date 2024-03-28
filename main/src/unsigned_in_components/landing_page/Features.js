import React from 'react'
import Feature from './Feature.js'
import styles from '../../style.js'
import graph from '../assets/graph.png'
import refresh from '../assets/refresh.png'
import crosslister from '../assets/crosslister.png'


const Features = () => {
    return(
<section id="features">
  <div class={`bg-gray-50 gap-5 sm:gap-20 ${styles.paddingY} flex ${styles.flexStyle} flex-col items-center sm:items-start sm:flex-row justify-center`}>
    <Feature title={"Analytics"} description={"View detailed insights on your sales trends!"} image={graph} />
    <Feature title={"Automation"} description={"Automate sharing and offering to boost your closet!"} image={refresh} />
    <Feature title={"Cross Listing"} description={"Coming soon!"} image={crosslister} />
  </div>
</section>

        

    )
}

export default Features