export const buttonBase = `
  flex items-center justify-center gap-1
  w-fit  h-[40px]          
  px-3 py-2
  text-[14px] font-medium          
  rounded-full                        
  transition-all duration-150
  active:scale-[0.98]                 
  disabled:cursor-not-allowed
  flex-shrink-0
`;

export const buttonVariants = {
  primaryOutline: `
    bg-white border-2 border-btn-primary text-btn-primary
    hover:bg-btn-primary/5
    disabled:border-btn-disabled-bg disabled:text-btn-disabled-text
  `,
  
  grayOutline: `
    bg-white border-2 border-btn-gray-border text-btn-gray-text
    hover:bg-btn-gray-bg
    disabled:bg-btn-disabled-bg disabled:border-btn-disabled-bg disabled:text-btn-disabled-text
  `,

  grayFilled: `
    bg-btn-gray-bg text-btn-gray-text
    hover:bg-btn-gray-border-2
    disabled:bg-btn-disabled-bg disabled:text-btn-disabled-text
  `,

  blackFilled: `
    bg-btn-black-bg text-white
    hover:bg-black
    disabled:bg-btn-disabled-bg disabled:text-btn-disabled-text
  `,

  ghost: `
    bg-transparent text-btn-gray-text
    hover:bg-btn-gray-bg
    disabled:text-btn-disabled-text hover:disabled:bg-transparent
  `,
};