import React from 'react';

export default function ProgressDots({ rolls = 0 }: { rolls?: number }) {
  return (
    <div className="flex gap-2 mb-2">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`w-4 h-4 rounded-full inline-block ${i < rolls ? 'bg-green-400' : 'bg-gray-400'}`}></span>
      ))}
    </div>
  );
}
