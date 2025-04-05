"use client";
import { useSession } from "@/lib/auth/client";
import { Button } from "@radix-ui/themes";

export default function Logout() {
  const { logout } = useSession();

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  return (
    <Button color="red" className="mt-4" onClick={handleLogout}>
      Logout
    </Button>
  );
}
