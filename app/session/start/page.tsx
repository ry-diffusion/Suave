"use client";

import { Providers, Institution } from "@/Support/Institutions";
import { Button, Flex, Select, Text, TextField } from "@radix-ui/themes";
import { LockIcon, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth/client";
import React from "react";
import { useTransitionRouter } from "next-view-transitions";

type FormData = {
  username: string;
  institution: Institution;
  password: string;
};

export default function StartSession() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      institution: Object.keys(Providers)[0],
    },
  });

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const { push } = useTransitionRouter();

  const { login } = useSession();

  async function submit(data: FormData) {
    try {
      await login(data);
      push("/");
    } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message);
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      direction={"column"}
      className="min-w-1/4"
    >
      {errorMessage && (
        <Text size="4" color="red" className="text-center">
          {errorMessage}
        </Text>
      )}

      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 p-8">
        <label htmlFor="institution">
          <Text size="4">De qual instituto você é?</Text>
        </label>

        <Select.Root
          defaultValue={Object.keys(Providers)[0]}
          {...register("institution")}
          onValueChange={(x) => setValue("institution", x)}
        >
          <Select.Trigger />
          <Select.Content>
            {Object.keys(Providers).map((provider) => (
              <Select.Item key={provider} value={provider}>
                {provider}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <label htmlFor="username" className="flex flex-col">
          <Text size="4">Mátricula</Text>

          {errors.username && (
            <Text size="6" color="red">
              {errors.username.message}
            </Text>
          )}
        </label>

        <TextField.Root
          className="bg-blue-200/20 rounded-md p-4"
          {...register("username")}
        >
          <TextField.Slot>
            <User height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        <label htmlFor="password">
          <Text size="4">Senha</Text>

          {errors.password && (
            <Text size="6" color="red">
              {errors.password.message}
            </Text>
          )}
        </label>

        <TextField.Root
          type="password"
          className="bg-blue-200/20 rounded-md p-4"
          {...register("password", { required: true })}
        >
          <TextField.Slot>
            <LockIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        <Button
          type="submit"
          className="bg-green-200 text-black rounded-md px-8 py-2"
          disabled={isSubmitting || !isDirty || !isValid}
          loading={isSubmitting}
        >
          Login
        </Button>
      </form>
    </Flex>
  );
}
