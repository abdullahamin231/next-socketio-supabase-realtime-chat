"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { loginSchema } from "@/app/login/schema";
import { createClient } from "@/utils/supabase/server";

export async function login(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: loginSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const supabase = createClient();

  const data = {
    email: submission.value.email,
    password: submission.value.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
