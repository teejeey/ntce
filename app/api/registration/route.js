import { handlePostRegistration } from "../../../lib/server/controllers/registrationController";
import { emptyWithCors } from "../../../lib/server/http/apiResponse";

/** Must stay dynamic for form submissions at runtime. */
export const dynamic = "force-dynamic";

export async function OPTIONS(request) {
  return emptyWithCors(request);
}

export async function POST(request) {
  return handlePostRegistration(request);
}
