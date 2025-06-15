// src/components/globalComponents/TableContainer.tsx
import React from "react";

interface TableContainerProps {
  title: string;
  children: React.ReactNode;
}

const TableContainer = ({ title, children }: TableContainerProps) => (
  <div className=" p-6 bg-white rounded-lg shadow-sm">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
      {title}
    </h1>
    {children}
  </div>
);

export default TableContainer;