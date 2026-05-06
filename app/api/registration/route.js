import { handlePostRegistration } from "../../../lib/server/controllers/registrationController";
import { emptyWithCors } from "../../../lib/server/http/apiResponse";

/** Export-safe for cPanel static build. */
export const dynamic = "force-static";

export async function OPTIONS(request) {
  return emptyWithCors(request);
}

export async function POST(request) {
  return handlePostRegistration(request);
}
