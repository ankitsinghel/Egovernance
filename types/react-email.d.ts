declare module "@react-email/components" {
  import * as React from "react";
  export const Html: React.FC<any>;
  export const Head: React.FC<any>;
  export const Preview: React.FC<any>;
  export const Section: React.FC<any>;
  export const Row: React.FC<any>;
  export const Heading: React.FC<any>;
  export const Text: React.FC<any>;
  export default {} as any;
}

declare module "@react-email/render" {
  export function render(component: any): string;
}
