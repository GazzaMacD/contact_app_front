const BASE_URL = process.env.VITE_BASE_URL || "";
const BASE_API_URL = process.env.VITE_BASE_API_URL || "";

export const base = {
  url: BASE_URL,
  api_url: BASE_API_URL,
};

export async function fetchData<T, E>(
  fullUrl: string | null,
  path: string | null,
  options = {}
): Promise<
  | {
      success: true;
      status: number;
      data: T;
      error: null;
    }
  | {
      success: false;
      status: number;
      data: E | null;
      error: Error | unknown | null;
    }
> {
  const url = fullUrl ? fullUrl : `${BASE_API_URL}${path}`;

  try {
    const response = await fetch(url, options);
    const isJson = (response.headers.get("content-type") || "").includes(
      "application/json"
    );
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data: data,
        error: null,
      };
    }

    return {
      success: true,
      status: response.status,
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: null,
      error: error,
    };
  }
}
