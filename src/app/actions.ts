import { User } from "@supabase/supabase-js";
import { Contact, CompleteContact } from "./ContactComponents";
import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();

export const getAllUsers = async (searchBy: string, searchInput: string) => {
  if (searchBy === "email") {
    return [];
  } else if (searchBy === "name") {
    const { data, error } = await supabase
      .from("user_info")
      .select("*")
      .ilike("full_name", `%${searchInput}%`);
    if (error) {
      console.error(error);
    }
    return data;
  }
};


export const sendMessageUseCase = async (
  conversationId: string,
  message: string,
  senderId: string
) => {
  try {
    const { data, error } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        content: message,
      },
    ]);
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
};

export const fetchMessagesUseCase = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .limit(10)
      .order("created_at", { ascending: true });
    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchConversationUseCase = async (
  contact: Contact,
  userData: User
): Promise<string | undefined> => {
  try {
    // First, try to select the existing row
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(user1_id.eq.${userData.id},user2_id.eq.${contact.id}),and(user1_id.eq.${contact.id},user2_id.eq.${userData.id})`
      );

    if (!data || data.length === 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from("conversations")
        .insert([
          {
            user1_id: userData.id,
            user2_id: contact.id,
          },
        ])
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      } else {
        console.log("New conversation created:", insertedData);
        return insertedData[0].id;
      }
    } else {
      console.log("Existing conversation found:", data);
      return data[0].id;
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchContacts = async (
  userData: User
): Promise<CompleteContact[] | undefined> => {
  try {
    const { data, error } = await supabase
      .from("user_info")
      .select("*")
      .neq("id", userData.id);
    if (error) throw error;

    const contacts = data.map((contact: any) => ({
      id: contact.id,
      name: contact.full_name,
      fallback: `${contact.full_name.split(" ")[0][0]}${
        contact.full_name.split(" ")[1][0]
      }`,
      lastSeen: getLastSeenString(contact.last_seen),
    }));

    const promisedConversationIds = contacts.map(async (contact: Contact) => {
      const id = await fetchConversationUseCase(contact, userData);
      return { ...contact, conversationId: id };
    });

    const completeContacts: CompleteContact[] = await Promise.all(
      promisedConversationIds
    );

    return completeContacts;
  } catch (error) {
    console.error(error);
  }
};

function getLastSeenString(isoString: any) {
  const now = new Date();
  const lastSeen = new Date(isoString);
  // @ts-ignore
  const diffInMilliseconds = now - lastSeen;
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return lastSeen.toLocaleDateString();
  }
}
