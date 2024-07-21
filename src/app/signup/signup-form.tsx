"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/signup/actions";
import { signupSchema } from "@/app/signup/schema";

export default function Form() {
  const [lastResult, action] = useFormState(signup, undefined);
  const [form, fields] = useForm({
    // Sync the result of last submission
    // @ts-ignore
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema });
    },

    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });


  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              key={fields.firstName.key}
              name={fields.firstName.name}
              // @ts-ignore
              defaultValue={fields.firstName.initialValue}
              type="text"
            />
            <div className="text-xs text-red-400">
              {fields.firstName.errors}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              key={fields.lastName.key}
              name={fields.lastName.name}
              // @ts-ignore
              defaultValue={fields.lastName.initialValue}
              type="text"
            />
            <div className="text-xs text-red-400">{fields.lastName.errors}</div>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            key={fields.email.key}
            name={fields.email.name}
            // @ts-ignore
            defaultValue={fields.email.initialValue}
            type="email"
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
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}
