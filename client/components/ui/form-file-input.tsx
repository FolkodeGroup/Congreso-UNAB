import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Upload, X } from 'lucide-react';

interface FormFileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  preview?: boolean;
}

export const FormFileInput = React.forwardRef<HTMLInputElement, FormFileInputProps>(
  ({ className, label, error, hint, preview = false, accept, ...props }, ref) => {
    const [dragActive, setDragActive] = React.useState(false);
    const [fileName, setFileName] = React.useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setFileName(file.name);
        if (props.onChange && inputRef.current) {
          const event = {
            target: { ...inputRef.current, files: e.dataTransfer.files }
          } as any;
          props.onChange(event);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName('');
      }
      props.onChange?.(e);
    };

    const clearFile = () => {
      setFileName('');
      if (inputRef.current) {
        inputRef.current.value = '';
        if (props.onChange) {
          const event = {
            target: { ...inputRef.current, files: null }
          } as any;
          props.onChange(event);
        }
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-slate-800 tracking-wide">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative group border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
            "hover:border-congress-cyan hover:bg-congress-cyan/5",
            "focus-within:border-congress-cyan focus-within:bg-congress-cyan/5 focus-within:ring-4 focus-within:ring-congress-cyan/10",
            dragActive ? "border-congress-cyan bg-congress-cyan/5" : "border-slate-300 bg-white/80",
            error && "border-red-400 hover:border-red-500 focus-within:border-red-500",
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            className="sr-only"
            ref={inputRef}
            accept={accept}
            onChange={handleChange}
            {...props}
          />
          
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
            {fileName ? (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-900 mb-1">{fileName}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="inline-flex items-center text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remover archivo
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3 group-hover:bg-congress-cyan/10 transition-colors duration-200">
                  <Upload className="h-6 w-6 text-slate-500 group-hover:text-congress-cyan transition-colors duration-200" />
                </div>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Haz clic o arrastra un archivo aquí
                </p>
                <p className="text-xs text-slate-500">
                  {accept ? `Archivos soportados: ${accept}` : 'Cualquier tipo de archivo'}
                </p>
              </>
            )}
          </div>
        </div>
        
        {hint && !error && (
          <p className="text-xs text-slate-600 mt-1">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-600 font-medium mt-1 animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormFileInput.displayName = "FormFileInput";
