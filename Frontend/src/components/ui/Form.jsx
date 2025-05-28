import { createContext, forwardRef, useContext, useId } from 'react';
import { cn } from '../../utils/cn';

const FormContext = createContext({});

export function Form({ className, onSubmit, children, ...props }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }}
      className={cn("space-y-6", className)}
      {...props}
    >
      {children}
    </form>
  );
}

export function FormField({ name, control, render, ...props }) {
  const fieldId = useId();
  
  return (
    <FormContext.Provider value={{ name, id: fieldId, control }}>
      {render({ field: { name, id: fieldId, ...props } })}
    </FormContext.Provider>
  );
}

export function FormItem({ className, ...props }) {
  return (
    <div className={cn("space-y-2", className)} {...props} />
  );
}

export function FormLabel({ className, ...props }) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  );
}

export function FormControl({ className, ...props }) {
  return (
    <div className={cn("mt-2", className)} {...props} />
  );
}

export function FormMessage({ className, children, ...props }) {
  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  );
}