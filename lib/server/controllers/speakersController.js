import { gasReadSuccessCacheHeaders } from "../config/gasReadCache";
import { apiFailure, apiSuccess } from "../http/apiEnvelope";
import { jsonWithCors } from "../http/apiResponse";
import { gasErrorHttpStatus, sanitizeUpstreamError } from "../http/upstreamStatus";
import { getSpeakers } from "../services/speakersService";

export async function handleGetSpeakers(request) {
  try {
    const result = await getSpeakers();
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
