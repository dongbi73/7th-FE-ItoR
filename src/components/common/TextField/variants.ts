export const inputBase =
  'w-full border bg-white outline-none transition-colors duration-150 placeholder:text-gray-78';

export const inputSizes = {
  large: 'h-[62px] rounded-[4px] px-4 py-3 text-[32px] font-medium leading-none',
  default: 'h-[46px] rounded-[4px] px-4 py-3 text-[14px] font-light leading-none',
} as const;

export const textFieldSizes = {
  large: {
    wrapper: 'gap-1 px-4 py-3',
    label: 'px-1.5 text-[14px] text-gray-56 font-medium leading-none ',
    labelInputWrapper: 'flex flex-col gap-3',
    helpText: 'text-[12px] font-light px-1.5 leading-none text-gray-78',
  },
  default: {
    wrapper: 'gap-1 px-4 py-3 ',
    label: ' px-1.5 text-[14px] font-light leading-none text-gray-56',
    labelInputWrapper: 'flex flex-col gap-3',
    helpText: 'text-[12px] font-light px-1.5 leading-none text-gray-78',
  },
} as const;

export const inputStates = {
  muted: 'border-gray-90 text-gray-56',
  default: 'border-gray-90 text-gray-0',
  active: 'border-gray-33 text-gray-0',
  disabled: 'border-gray-90 text-gray-78 cursor-not-allowed',
} as const;
