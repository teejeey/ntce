import { handleGetSchedule } from "../../../lib/server/controllers/scheduleController";
import { emptyWithCors } from "../../../lib/server/http/apiResponse";

export const dynamic = "force-dynamic";

export async function OPTIONS(request) {
  return emptyWithCors(request);
}

export async function GET(request) {
  return handleGetSchedule(request);
}
