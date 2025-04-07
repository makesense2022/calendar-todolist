declare namespace chrome {
  export namespace tabs {
    export function create(options: { url: string }): void;
  }
  export namespace storage {
    export const local: {
      get: (keys: string[], callback: (result: any) => void) => void;
      set: (items: object, callback?: () => void) => void;
    };
  }
} 