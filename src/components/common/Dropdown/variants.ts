import { cn } from '@/utils/cn';

export const dropdownContainer =
  'absolute z-[100] border border-border-light bg-white shadow-[0_4px_12px_var(--color-shadow-dropdown)] animate-in fade-in zoom-in-95 duration-150';

export const positionVariants = {
  bottom: 'top-full mt-4 left-1/2 -translate-x-1/2',
  top: 'bottom-full mb-4 left-1/2 -translate-x-1/2'
};
export const containerVariants = {
  default: 'py-1 rounded-[4px] ',
  iconOnly: 'rounded-[4px] px-4 py-1 flex items-center justify-center'
};



const caretBase = `
  before:content-[""] 
  before:absolute 
  before:w-4
  before:h-4
  before:bg-white
  before:rotate-45
  before:border-border-light
`;
export const caretVariants = {
  bottom: {
    default: cn(caretBase, 'before:-top-2 before:right-3 before:border-t before:border-l'),
    iconOnly: cn(caretBase, 'before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-t before:border-l')
  },
  top: {
    default: cn(caretBase, 'before:-bottom-2 before:right-3 before:border-b before:border-r'),
    iconOnly: cn(caretBase, 'before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:border-b before:border-r')
  }
};

export const itemBase =
  'flex w-full items-center leading-none transition-colors';

export const itemVariants = {
  default: 'px-3 pt-2 pb-3 w-40 justify-start gap-2.5 text-[14px] font-normal text-black',
  iconOnly: 'h-[32px] px-4 justify-center'
};
