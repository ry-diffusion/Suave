"use client"


import { Providers, Institution } from "@/Support/Institutions";
import { Button, Select, Spinner, Text, TextField } from "@radix-ui/themes";
import { LockIcon, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth/client"
import { outfit } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { useTransitionRouter } from "next-view-transitions";



type FormData = {
    username: string,
    institution: Institution,
    password: string
};


export default function StartSession() {
    const { register, handleSubmit, setValue, formState: { errors, isDirty, isLoading, isValid } } = useForm<FormData>({
        defaultValues: {
            institution: Object.keys(Providers)[0],
        }
    })

    const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)
    const { push } = useTransitionRouter()

    const { login } = useSession()

    async function submit(data: FormData) {
        try {
            await login(data)
            push("/")
        } catch (e) {
            if (e instanceof Error)
                setErrorMessage(e.message)
        }
    }


    return <div className="flex flex-col justify-center items-center">
        <motion.h1
            className={cn(
                outfit.className,
                "text-3xl uppercase md:tracking-wide text-transparent text-center x-outline bg-clip-text bg-linear-90 from-blue-400/50 to-blue-500/50"
            )}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            {errorMessage ? "Ops... Vamos tentar novamente?" : "Vamos lá"}
        </motion.h1>

        {errorMessage && <Text size="4" color="red" className="text-center">
            {errorMessage}
        </Text>}



        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4  p-8 rounded-md">
            <label htmlFor="institution">
                <Text size="8">
                    De qual instituto você é?
                </Text>
            </label>

            <Select.Root defaultValue={Object.keys(Providers)[0]} {...register("institution")} onValueChange={x => setValue("institution", x)}>
                <Select.Trigger />
                <Select.Content>
                    {Object.keys(Providers).map((provider) => <Select.Item key={provider} value={provider}>{provider}</Select.Item>)}
                </Select.Content>
            </Select.Root>

            <label htmlFor="username" className="flex flex-col">
                <Text size="8">
                    Insira sua mátricula
                </Text>

                {errors.username && <Text size="6" color="red">
                    {errors.username.message}
                </Text>}
            </label>


            <TextField.Root className="bg-blue-200/20 rounded-md p-4" {...register("username")}>
                <TextField.Slot>
                    <User height="16" width="16" />
                </TextField.Slot>
            </TextField.Root>

            <label htmlFor="password">
                <Text size="8">
                    Insira sua senha
                </Text>

                {errors.password && <Text size="6" color="red">
                    {errors.password.message}
                </Text>}

            </label>

            <TextField.Root type="password" className="bg-blue-200/20 rounded-md p-4" {...register("password", { required: true })}>
                <TextField.Slot>
                    <LockIcon height="16" width="16" />
                </TextField.Slot>
            </TextField.Root>


            <Button type="submit" className="bg-green-200 text-black rounded-md px-8 py-2" disabled={isLoading || !isDirty || !isValid}>
                {isLoading && <Spinner loading />}
                Login
            </Button>
        </form>
    </div>
}