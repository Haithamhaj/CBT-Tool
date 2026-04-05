import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "../src/lib/app/runtime-auth";

export default async function HomePage() {
  const user = await getCurrentSessionUser();
  redirect(user ? "/reference" : "/login");
}
