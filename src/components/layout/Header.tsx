import { getProfile } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const profile = await getProfile();
  return <HeaderClient profile={profile} />;
}
