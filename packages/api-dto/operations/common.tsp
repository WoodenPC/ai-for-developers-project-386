using TypeSpec.Http;

namespace CallsCalendar;

model ErrorResponse {
  code: string;
  message: string;
}

model BadRequestResponse {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
}

model NotFoundResponse {
  @statusCode statusCode: 404;
  @body error: ErrorResponse;
}

model ConflictResponse {
  @statusCode statusCode: 409;
  @body error: ErrorResponse;
}
