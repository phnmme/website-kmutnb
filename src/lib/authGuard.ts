import { verify } from "@/action/authAction";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function authGuard(page: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const isAuthorized = await verify(page);

  if (!isAuthorized) {
    redirect("/login");
  }
}
