const BASE_API_URL = process.env.VITE_BASE_API_URL;

export async function fetchData<T>(
  fullUrl: string | null,
  path: string | null,
  options = {}
): Promise<
  | {
      status: "success";
      data: T;
      error: null;
    }
  | {
      status: "error";
      data: null;
      error: Error | unknown;
    }
> {
  const url = fullUrl ? fullUrl : `${BASE_API_URL}${path}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `Fetch failed. ${response.status} ${response.statusText}`
      );
    }

    const isJson = (response.headers.get("content-type") || "").includes(
      "application/json"
    );
    const data = isJson ? await response.json() : await response.text();

    return {
      status: "success",
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      status: "error",
      data: null,
      error: error,
    };
  }
}
