import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string; 
}

// forwardRef를 사용하여 부모(React Hook Form 등)에서 input 요소에 직접 접근
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const isError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* 라벨 영역 (접근성을 위해 htmlFor와 id 연결) */}
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-medium text-gray-700 ml-1"
          >
            {label}
          </label>
        )}

        {/* 입력창 영역 */}
        <input
          ref={ref}
          id={id}
          className={cn(
            // 기본 스타일
            "w-full px-4 py-2.5 rounded-lg border bg-white transition-all outline-none text-sm",
            "placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500",
            
            // 상태별 스타일 분기 (cn 활용)
            isError 
              ? "border-red-500 focus:ring-2 focus:ring-red-100" // 에러 발생 시
              : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100", // 정상 시
            
            className // 외부 커스텀 스타일
          )}
          {...props}
        />

        {/* 에러 메시지 영역 (상태에 따른 UI 피드백 요구사항) */}
        {isError && (
          <p className="text-xs text-red-500 ml-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; // forwardRef 사용 시 디버깅을 위해 이름