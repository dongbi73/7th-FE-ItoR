export const buttonBase = `
  inline-flex items-center justify-center gap-1
  text-[14px] font-normal leading-none
  rounded-[25px]
  transition-colors duration-150
  disabled:cursor-not-allowed
  flex-shrink-0
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-btn-primary
`;

export const buttonVariants = {
  primaryOutline: `
    border border-btn-primary bg-white text-btn-primary
    disabled:border-gray-85 disabled:bg-white disabled:text-gray-75
  `,
  
  grayOutline: `
    border border-gray-56 bg-white text-gray-56 
    disabled:border-gray-85 disabled:bg-white disabled:text-gray-75
  `,

  grayFilled: `
    border border-transparent bg-gray-90 text-gray-62
    hover:bg-gray-87
    disabled:bg-gray-93 disabled:text-gray-76
  `,

  blackFilled: `
    border bg-gray-7 text-white
    hover:bg-gray-7 hover:border-gray-7
    disabled:border-gray-12 disabled:bg-gray-12 disabled:text-gray-48
  `,

  modalOutline: `
    h-[48px] rounded-[2px] border border-gray-92 bg-white px-6 text-[14px] font-medium text-gray-13
    hover:bg-gray-98
    disabled:border-gray-92 disabled:bg-gray-97 disabled:text-gray-75
  `,

  modalDanger: `
    h-[48px] rounded-[2px] border border-danger-45 bg-danger-45 px-6 text-[14px] font-medium text-white
    hover:border-danger-44 hover:bg-danger-44
    disabled:border-danger-88 disabled:bg-danger-88 disabled:text-white
  `,

  ghost: `
    border border-transparent bg-transparent text-gray-56
    rounded-[2px]
    hover:bg-gray-90
    disabled:bg-gray-90 disabled:text-gray-56
    text-[12px]
  `,
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
