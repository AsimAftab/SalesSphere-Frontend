// Allow importing plain .jsx files without TS errors
declare module '*.jsx' {
  const value: any;
  export default value;
}

// Also allow imports of specific JS/JSX pages without types
declare module '*Page' {
  const value: any;
  export default value;
}
