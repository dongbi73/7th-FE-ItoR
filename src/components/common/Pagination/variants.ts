export const pageButtonBase = `
  flex items-center justify-center 
  w-[32px] h-[32px] 
  text-[14px] font-semibold 
  bg-white border transition-all duration-200 rounded-[1px]
  disabled:opacity-30 disabled:cursor-not-allowed
`;

export const pageButtonVariants = {
  default: 'border-slate-200 text-slate-700 hover:bg-slate-50',
  active: 'border-[#1890FF] text-[#1890FF] z-10',
};