import { gasReadSuccessCacheHeaders } from "../config/gasReadCache";
import { apiFailure, apiSuccess } from "../http/apiEnvelope";
import { jsonWithCors } from "../http/apiResponse";
import { gasErrorHttpStatus, sanitizeUpstreamError } from "../http/upstreamStatus";
import { getEvents } from "../services/eventsService";

export async function handleGetEvents(request) {
  try {
    const result = await getEvents();
    if (result.success) {
      return jsonWithCors(
        apiSuccess(result.data),
        { status: 200, headers: gasReadSuccessCacheHeaders() },
        request
      );
    }
    return jsonWithCors(
      apiFailure(sanitizeUpstreamError(result.error)),
      { status: gasErrorHttpStatus(result.error) },
      request
    );
  } catch (err) {
    return jsonWithCors(apiFailure("Service is temporarily unavailable."), { status: 500 }, request);
  }
}
