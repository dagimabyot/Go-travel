export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  post: async <T>(url: string, body: any): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
};
