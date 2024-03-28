const styles = {
    boxWidth: "xl:max-w-[1280px] w-full",
  
    heading1: "font-poppins font-bold xs:text-[48px] text-[40px] text-slate-900 xs:leading-[76.8px] leading-[66.8px] w-full",
    heading2: "font-poppins font-bold xs:text-[48px] text-[35px] text-slate-800 xs:leading-[76.8px] leading-[66.8px] w-full",
    paragraph: "font-poppins font-normal text-[#7b7a76] text-[18px] leading-[30.8px]",
    paragraph2: "font-poppins font-normal text-gray-500 text-[18px] leading-[30.8px]",
  
    flexCenter: "flex justify-center items-center",
    flexStart: "sm:flex justify-center items-start",
  
    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-16 py-6",
    padding: "sm:px-16 px-6 sm:py-12 py-4",
  
    marginX: "sm:mx-16 mx-6",
    marginY: "sm:my-16 my-6",
  };
  
  export const layout = {
    section: `flex lg:flex-row flex-col ${styles.paddingY} gap-20`,
    sectionReverse: `flex lg:flex-row flex-col-reverse ${styles.paddingY} gap-20`,
  
    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex  ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  
    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
  };
  
  export default styles;