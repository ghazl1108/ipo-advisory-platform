import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';
import { forwardRef } from 'react';

const Checkbox = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className="absolute h-4 w-4 opacity-0"
        {...props}
      />
      <div
        className={cn(
          "h-4 w-4 rounded border border-primary flex items-center justify-center",
          checked ? "bg-primary" : "bg-background",
          className
        )}
      >
        {checked && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };