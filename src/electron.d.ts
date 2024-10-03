export {};

declare global {
  interface Window {
    electron: {
      openNewWindow: (url: string) => void;
    };
  }
}
