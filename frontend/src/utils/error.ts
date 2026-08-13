import axios from "axios";

export const getErrorMessage = (
  err: any,
  defaultMessage: string = "An unexpected error occurred"
) => {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return defaultMessage;
};
