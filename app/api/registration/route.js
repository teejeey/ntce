import { handlePostRegistration } from "../../../lib/server/controllers/registrationController";
import { emptyWithCors } from "../../../lib/server/http/apiResponse";

/** POST must be dynamic; `force-static` breaks registration locally and can cause 500s. */
export const dynamic = "force-dynamic";

export async function OPTIONS(request) {
  return emptyWithCors(request);
}

export async function POST(request) {
  return handlePostRegistration(request);
}
