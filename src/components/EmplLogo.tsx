
import React from 'react';

export const EmplLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-employIn-blue rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 12h-3a2 2 0 0 0-2 2v2H7V8h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2" />
        </svg>
      </div>
      <span className="font-bold text-xl text-white">EmployIn</span>
    </div>
  );
};
