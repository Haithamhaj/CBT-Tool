import { buildHandlers } from "../api/handlers";
import type { Repository } from "../db/repository";

export async function stepSubmitRoute(request: Request, repository: Repository) {
  const payload = await request.json();
  const result = await buildHandlers(repository).stepSubmit(payload);
  return Response.json(result.body, { status: result.status });
}
