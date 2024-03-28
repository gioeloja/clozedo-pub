import React from 'react'
import styles from '../../style.js'
import logo from '../assets/gray_purple_logo.png'


const footerLinks = [
    {
      title: "Features",
      links: [
        {
          name: "Analytics",
          link: "",
        },
        {
          name: "Refresher",
          link: "",
        },
        {
          name: "Crosslister",
          link: "",
        },
      ],
    },
    {
      title: "Contact",
      links: [
        {
          name: "Contact Us",
          link: "",
        },
      ],
    },
    { title: "Legal",
    links: [
      {
        name: "Privacy",
        link: "",
      },
      {
        name: "Terms",
        link: "",
      },
    ],
  },
]

const socialMedia = [
    {
      id: "social-media-1",
      link: "https://www.instagram.com/",
    },
    {
      id: "social-media-2",
      link: "https://www.facebook.com/",
    },
    {
      id: "social-media-3",
      link: "https://www.twitter.com/",
    },
    {
      id: "social-media-4",
      link: "https://www.linkedin.com/",
    },
  ];

const Footer = () => {
    return(
        
        <section className={`${styles.flexCenter} ${styles.paddingY} px-8 md:px-16 lg:px-32 flex-col `}>
            {/* <div>
                <img src={logo} alt="logo" className=' mb-6'/>
            </div>
            <div className={`${styles.flexStart} md:flex-row flex-col mb-8`}>
                <div className='flex-[1.5] w-full flex flex-row flex-wrap md:mt-0 mt-10'>
                    {footerLinks.map((footerLink) => (
                        <div key={footerLink.key} className="flex flex-col ss:my-0 my-4 min-w-[150p] mx-24">
                        <h4 className='font-poppins font-medium text-[18px] leading-[27px]'>
                            {footerLink.title} 
                        </h4>
                        <ul className='list-none mt-4'>
                            {footerLink.links.map((link, index) => (
                            <li key={link.name}
                                className={`font-poppins font-normal text-[16px] leading-[24px] cursor-pointer ${index !== footerLink.links.length-1 ? 'mb-4' : 'mb-0'}`}>
                                {link.name}
                            </li>
                            ))}
                        </ul>
                        </div>
                    ))}
                    </div>

            </div> */}

            <div className='w-1/2 md:flex-row flex-col pt-6 border-t-[1px] border-t-gray-500'>
                <p className='font-poppins font-normal text-center text-md text-gray-500 leading-[27px]'>
                    2023 Clozedo. All Rights Reserved.
                </p>
            </div>
                            

        </section>
    )
}

export default Footer