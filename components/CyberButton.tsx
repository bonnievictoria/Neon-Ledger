import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'pink';
  loading?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'cyan', 
  loading,
  className = '',
  ...props 
}) => {
  const baseColor = variant === 'cyan' ? 'cyan' : 'pink';
  const colorClass = variant === 'cyan' ? 'text-neon-cyan border-neon-cyan hover:bg-neon-cyan/10' : 'text-neon-pink border-neon-pink hover:bg-neon-pink/10';
  const shadowClass = variant === 'cyan' ? 'shadow-[0_0_10px_rgba(0,243,255,0.3)]' : 'shadow-[0_0_10px_rgba(255,0,255,0.3)]';

  return (
    <button
      className={`
        relative px-6 py-2 border font-mono uppercase tracking-widest transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed group
        ${colorClass}
        ${shadowClass}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </span>
      
      {/* Corner decorations */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${variant === 'cyan' ? 'border-neon-cyan' : 'border-neon-pink'}`}></div>
      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${variant === 'cyan' ? 'border-neon-cyan' : 'border-neon-pink'}`}></div>
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${variant === 'cyan' ? 'border-neon-cyan' : 'border-neon-pink'}`}></div>
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${variant === 'cyan' ? 'border-neon-cyan' : 'border-neon-pink'}`}></div>
    </button>
  );
};