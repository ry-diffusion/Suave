import { useClientFetch } from "~~/app/composables/useClientFetch";
import type { UserData } from "~~/shared/datatypes";

export const useMyData = () => {
  const { clientFetch } = useClientFetch();
  const {
    data: userData,
    pending,
    error,
    refresh,
  } = useAsyncData<UserData | null>(
    () => clientFetch<UserData>("/api/my-data"),
    {
      default: () => null,
    }
  );

  return {
    userData: readonly(userData) as Ref<UserData | null>,
    pending: readonly(pending),
    error: readonly(error),
    refresh,
  };
};
