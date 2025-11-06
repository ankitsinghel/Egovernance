import React from "react";

type ContainerPropsT = {
  children?: React.ReactNode;
};

export default function MasterContainer({ children }: ContainerPropsT) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
