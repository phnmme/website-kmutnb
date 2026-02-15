import { getProfile } from "@/action/profileAction";
import { MainProfile } from "@/components/profile";
import authGuard from "@/lib/authGuard";

export default async function page() {
  await authGuard("user");
  const data = await getProfile();
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
      <MainProfile user={data.data.user} />
    </div>
  );
}
