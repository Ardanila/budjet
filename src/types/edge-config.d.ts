declare module '@vercel/edge-config' {
  interface EdgeConfigClient {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
  }

  export function createClient(token?: string): EdgeConfigClient;
} 