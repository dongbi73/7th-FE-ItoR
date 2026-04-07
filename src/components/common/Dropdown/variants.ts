export const dropdownContainer = 'absolute z-[100] bg-white rounded shadow-xl border border-slate-100 mt-2.5 animate-in fade-in zoom-in-95 duration-150';
import { cn } from '@/utils/cn';

export const containerVariants = {
  default: 'w-[160px] py-1', 
  iconOnly: 'w-[72px] py-1 flex items-center justify-center' 
};
const caretBase = `
  before:content-[""] 
  before:absolute 
  before:-top-2 
  before:w-0 
  before:h-0 
  before:border-l-[8px] before:border-l-transparent 
  before:border-r-[8px] before:border-r-transparent 
  before:border-b-[8px] before:border-b-white
  before:drop-shadow-[0_-2px_2px_rgba(0,0,0,0.05)]
`;

export const caretVariants = {
  default: cn(caretBase, 'before:right-6'),
  iconOnly: cn(caretBase, 'before:left-1/2 before:-translate-x-1/2')
};

export const itemBase = 'w-full flex items-center transition-colors hover:bg-[#E6E6E6] leading-none rounded-none';

export const itemVariants = {
  default: 'w-[160px] h-[42px] px-4 justify-start text-[14px] font-medium text-slate-700',
  iconOnly: 'w-[72px] h-[40px] px-4 justify-center'
};