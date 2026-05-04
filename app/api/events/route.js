import { handleGetEvents } from "../../../lib/server/controllers/eventsController";
import { emptyWithCors } from "../../../lib/server/http/apiResponse";

export const dynamic = "force-static";

export async function OPTIONS(request) {
  return emptyWithCors(request);
}

export async function GET(request) {
  return handleGetEvents(request);
}
