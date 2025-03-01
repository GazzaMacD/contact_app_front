type TKeys = 400 | 401;

type TErrorMessages = {
  [key: number]: { msg: string; status: number };
};

export const ERROR_MSGS: TErrorMessages = {
  400: { msg: "Sorry that was a bad request", status: 400 },
  401: { msg: "Sorry, unauthorized access denied", status: 401 },
  403: { msg: "Sorry, unauthorized access denied", status: 403 },
  404: {
    msg: "Sorry, we can't find that resource. Please try another url.",
    status: 404,
  },
  500: {
    msg: "Sorry, there seems to be a server error. We'll try fix it",
    status: 500,
  },
};
