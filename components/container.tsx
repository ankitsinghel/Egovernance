import React from "react";

type ContainerPropsT = {
  children?: React.ReactNode;
};

export default function Container({ children }: ContainerPropsT) {
  return <div className="max-w-5xl mx-auto px-4">{children}</div>;
}
