import { gasReadSuccessCacheHeaders } from "../config/gasReadCache";
import { apiFailure, apiSuccess } from "../http/apiEnvelope";
import { jsonWithCors } from "../http/apiResponse";
import { gasErrorHttpStatus } from "../http/upstreamStatus";
import { getSpeakers } from "../services/speakersService";

export async function handleGetSpeakers(request) {
  try {
    const result = await getSpeakers({ signal: request.signal });
    if (result.success) {
      return jsonWithCors(
        apiSuccess(result.data),
        { status: 200, headers: gasReadSuccessCacheHeaders() },
        request
      );
    }
    return jsonWithCors(
      apiFailure(result.error),
      { status: gasErrorHttpStatus(result.error) },
      request
    );
  } catch (err) {
    const message = err?.message || "Unexpected error.";
    return jsonWithCors(apiFailure(message), { status: 500 }, request);
  }
}
