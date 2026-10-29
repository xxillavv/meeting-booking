import { isAxiosError } from "axios";

type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

const NETWORK_ERROR_MESSAGE = "Не вдалося з'єднатися з сервером";
const UNKNOWN_ERROR_MESSAGE = "Щось пішло не так";

export const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return UNKNOWN_ERROR_MESSAGE;
  }

  if (!error.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  const message = error.response.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message ?? UNKNOWN_ERROR_MESSAGE;
};

export const getErrorStatus = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined;
