declare module "@react-email/components" {
  import * as React from "react";
  export type ComponentPropsT = Record<string, unknown>;
  export const Html: React.FC<ComponentPropsT>;
  export const Head: React.FC<ComponentPropsT>;
  export const Preview: React.FC<ComponentPropsT>;
  export const Section: React.FC<ComponentPropsT>;
  export const Row: React.FC<ComponentPropsT>;
  export const Heading: React.FC<ComponentPropsT>;
  export const Text: React.FC<ComponentPropsT>;
  const _default: unknown;
  export default _default;
}

declare module "@react-email/render" {
  import * as React from "react";
  export function render(
    component: React.ReactElement | React.ComponentType<Record<string, unknown>>
  ): string;
}
