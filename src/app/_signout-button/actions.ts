import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function signOut() {
  try {
    // Get user information
    let userData;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      userData = data;
    } catch (error) {
      console.log("Error getting user:", error);
      return { error: "Failed to retrieve user information." };
    }

    // Update last_seen
    try {
      const { error } = await supabase
        .from("user_info")
        .update({ last_seen: 'now()' })
        .match({ id: userData.user.id })
        .select();
      if (error) throw error;
    } catch (error) {
      console.log("Error updating last_seen:", error);
      // We don't return here as this is not critical for sign out
    }

    // Sign out the user
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.log("Error signing out:", error);
      return { error: "Failed to sign out. Please try again." };
    }

    return { message: "You have been signed out successfully." };
  } catch (error) {
    console.log("Unexpected error during sign out:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}