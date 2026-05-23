export type ErrorCode =
  | "event_type_exists"
  | "event_type_not_found"
  | "invalid_booking"
  | "invalid_event_type"
  | "invalid_from_date"
  | "slot_not_found"
  | "slot_taken";

const errorMessages: Record<ErrorCode, string> = {
  event_type_exists: "Event type already exists.",
  event_type_not_found: "Event type was not found.",
  invalid_booking: "Booking request is invalid.",
  invalid_event_type: "Event type request is invalid.",
  invalid_from_date: "fromDate must be a valid calendar date.",
  slot_not_found: "Requested slot was not found.",
  slot_taken: "Requested slot is already booked.",
};

const errorStatuses: Record<ErrorCode, number> = {
  event_type_exists: 409,
  event_type_not_found: 404,
  invalid_booking: 400,
  invalid_event_type: 400,
  invalid_from_date: 400,
  slot_not_found: 404,
  slot_taken: 409,
};

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(code: ErrorCode) {
    super(errorMessages[code]);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = errorStatuses[code];
  }

  toResponse() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
