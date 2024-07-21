import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    error: "You have been signed out successfully.",
  };
}
