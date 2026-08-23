import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── BUTTON ─────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-sans uppercase tracking-widest text-xs font-semibold px-6 py-3 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-ink text-paper border border-transparent hover:bg-white hover:text-ink hover:border-ink",
      secondary: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
      ghost: "bg-transparent text-ink hover:bg-neutral-200",
      link: "bg-transparent text-ink p-0 underline-offset-4 decoration-2 decoration-news-red hover:underline h-auto"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyle, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ─── CARD ───────────────────────────────────────────────────────────────

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("border border-ink bg-paper p-6", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

// ─── BADGE ──────────────────────────────────────────────────────────────

export function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span 
      className={cn("inline-flex items-center border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest bg-neutral-100 text-ink", className)}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── ICON BOX ───────────────────────────────────────────────────────────

export function IconBox({ icon: Icon, className }: { icon: React.ElementType, className?: string }) {
  return (
    <div className={cn("h-12 w-12 border border-ink flex items-center justify-center transition-colors duration-200 hover:bg-ink hover:text-white", className)}>
      <Icon className="w-5 h-5 stroke-[1.5]" />
    </div>
  );
}

// ─── ANIMATED H3 ────────────────────────────────────────────────────────

interface AnimatedH3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function AnimatedH3({ children, className, staggerDelay = 0.05, ...props }: AnimatedH3Props) {
  if (typeof children !== 'string') {
    return (
      <h3 className={cn("text-2xl md:text-3xl lg:text-4xl tracking-tighter transition-colors duration-300 font-display font-black", className)} {...props}>
        {children}
      </h3>
    );
  }

  return (
    <h3 className={cn("text-2xl md:text-3xl lg:text-4xl tracking-tighter transition-colors duration-300 font-display font-black", className)} {...props}>
      {children.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block opacity-0 animate-letter-reveal"
          style={{ 
            animationDelay: `${index * staggerDelay}s`,
            whiteSpace: char === ' ' ? 'pre' : 'normal' 
          }}
        >
          {char}
        </span>
      ))}
    </h3>
  );
}
