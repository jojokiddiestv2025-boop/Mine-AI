
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

declare global {
  // Define AIStudio interface to ensure property declarations on window.aistudio match across different declarations.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

export {};
