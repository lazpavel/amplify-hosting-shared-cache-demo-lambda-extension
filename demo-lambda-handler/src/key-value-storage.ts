type Framework = 'next' | 'nuxt';

export type KeyValueStorageOptions = {
  framework?: Framework;
};

export default class KeyValueStorage {
  private baseUrl: string;
  private opts: KeyValueStorageOptions;

  constructor(opts: KeyValueStorageOptions) {
    this.baseUrl = 'http://127.0.0.1:8888';
    this.opts = opts;
  }

  async set(key: string, value: NonNullable<unknown> | null): Promise<void> {
    const start = Date.now();
    const data = this.wrapData(value);

    console.log(`[key-value-storage] set ${key}`);
    await fetch(`${this.baseUrl}/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key, 
        data
      })
    });

    console.log(`latency L5 (set): ${Date.now() - start}ms`);
  }

  async get(key: string): Promise<NonNullable<unknown> | null> {
    const start = Date.now();
    console.log(`[key-value-storage] get ${key}`);
    
    let response = await fetch(`${this.baseUrl}/get/${key}`);
    let data = await response.json();

    console.log(data);
    fetch(`${this.baseUrl}/unblock`);
    console.log(`latency L5 (get): ${Date.now() - start}ms`);
    return data;
  }

  private wrapData(data: unknown): unknown {
    return this.opts.framework === 'next' ? JSON.stringify({
      lastModified: Date.now(),
      value: data,
    }) : data;
  }
}