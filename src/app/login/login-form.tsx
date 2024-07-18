"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/login/actions";
import { loginSchema } from "@/app/login/schema";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function LoginForm() {
  const { toast } = useToast();
  const [lastResult, action] = useFormState(login, undefined);
  const [form, fields] = useForm({
    // Sync the result of last submission

    // @ts-ignore
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },

    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (lastResult?.status === "error") {
      toast({
        // @ts-ignore
        title: lastResult.message!,
      });
    }
  }, [lastResult]);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            key={fields.email.key}
            name={fields.email.name}
            // @ts-ignore
            defaultValue={fields.email.initialValue}
          />
          <div className="text-xs text-red-400">{fields.email.errors}</div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            key={fields.password.key}
            name={fields.password.name}
            // @ts-ignore
            defaultValue={fields.password.initialValue}
          />
          <div className="text-xs text-red-400">{fields.password.errors}</div>
        </div>
        <SubmitButton />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-2">
          Sign up
        </Link>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}
