import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ReactQuillWrapperProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  modules?: any;
  placeholder?: string;
}

export const ReactQuillWrapper = ({ value, onChange, className, modules, placeholder }: ReactQuillWrapperProps) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    // Suppress findDOMNode warning from React Quill
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('findDOMNode is deprecated')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      className={className}
      modules={modules}
      placeholder={placeholder}
    />
  );
};

