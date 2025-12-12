import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <p className="font-semibold text-gray-700 flex items-center gap-2">
          Crafty Note <span className="text-gray-400">by</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary font-black text-lg">
            Crafter Studio
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Supercharged note taking experience</p>
      </div>
    </footer>
  );
};

export default Footer;
