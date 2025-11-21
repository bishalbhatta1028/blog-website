import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress findDOMNode warnings from third-party libraries (e.g., react-quill)
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('findDOMNode is deprecated') ||
       args[0].includes('Warning: findDOMNode'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
