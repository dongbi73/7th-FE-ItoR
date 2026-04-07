export const toastBase = `
  fixed top-16 left-1/2 -translate-x-1/2 z-[9999]
  flex items-center 
  h-[40px] 
  px-[12px] 
  py-[8px] 
  gap-[4px] 
  rounded-[25px] 
  border-[1px] 
  backdrop-blur-md 
  bg-white/90 
  text-[14px] 
  font-medium 
  shadow-sm 
  animate-in fade-in slide-in-from-bottom-2 duration-300
`;

export const toastVariants = {
  error: 'border-[#FF3F3F] text-[#FF3F3F]',
  success: 'border-[#15DC5E] text-[#15DC5E]',
};