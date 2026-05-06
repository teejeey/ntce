import { handlePostRegistration } from "../../../lib/server/controllers/registrationController";
import { emptyWithCors } from "../../../lib/server/http/apiResponse";

/** Registration endpoint is runtime-only to enforce live validation/security checks. */
export const dynamic = "force-dynamic";

export async function OPTIONS(request) {
  return emptyWithCors(request);
}

export async function POST(request) {
  return handlePostRegistration(request);
}
