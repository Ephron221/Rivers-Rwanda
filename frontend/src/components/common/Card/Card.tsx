import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-md hover:border-accent-orange/30",
        className
      )} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
