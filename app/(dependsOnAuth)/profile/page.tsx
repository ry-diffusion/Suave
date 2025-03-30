import Logout from "@/app/(dependsOnAuth)/profile/logout";
import { getSession } from "@/lib/auth/server";
import { Flex, Text } from "@radix-ui/themes";
import { redirect } from "next/navigation";

export default async function Page() {
  const { passport, isLoggedIn } = await getSession();

  if (!isLoggedIn) {
    return redirect("/");
  }

  return (
    <Flex direction="column" gap="4" p="4" align="center">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <Text size="4">Este é você.</Text>

      <Text>Nome: {passport?.knownInfo?.fullName}!</Text>
      <Text>Instituição: {passport?.institution}!</Text>

      {/* logout */}
      <Logout />
    </Flex>
  );
}
