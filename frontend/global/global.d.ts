// types/global.d.ts
declare global {
    namespace NodeJS {
      interface Global {
        mongoose: {
          conn: typeof import('mongoose') | null;
          promise: Promise<typeof import('mongoose')> | null;
        };
      }
    }
  }
  
  // Prevent TypeScript from treating the file as a script and thus transpiling it.
  export {};