import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, ...props }) => {
  return (
    <button
      {...props}
      className="flex items-center justify-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export { IconButton};
