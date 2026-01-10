import React from 'react';

export const Watermark = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05] z-0 flex flex-wrap justify-around items-center">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="text-5xl font-black -rotate-12 whitespace-nowrap p-20 text-white">
        MOFO SALES
      </div>
    ))}
  </div>
);