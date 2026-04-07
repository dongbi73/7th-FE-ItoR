export const inputBase = `
  w-full 
  h-[48px]                
  px-4                    
  text-[16px]            
  bg-field-bg 
  border border-field-border 
  rounded-[4px]          
  transition-all duration-150
  outline-none            
  placeholder:text-text-placeholder
`;

export const inputStates = {
  default: `
    hover:bg-field-hover-bg
    focus:border-field-focus-border 
    focus:ring-2 focus:ring-field-focus-ring
  `,
  error: `
    border-field-error-border 
    focus:ring-2 focus:ring-field-error-border/30
  `,
  disabled: `
    bg-field-disabled-bg 
    text-field-disabled-text 
    cursor-not-allowed 
    hover:bg-field-disabled-bg
  `,
};