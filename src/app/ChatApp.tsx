"use client";

import { useEffect, useState } from "react";
import {
  ContactButton,
  ContactList,
  CompleteContact,
} from "./ContactComponents";
import { MessageBox } from "./MessageComponents";
import Image from "next/image";
import NoContactSelectedImage from "@/assets/no-contact-selected.svg";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { fetchContacts } from "./actions";

export default function ChatApp({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] =
    useState<CompleteContact | null>(null);
  const [contacts, setContacts] = useState<CompleteContact[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  const handleContactClick = (contact: CompleteContact) => {
    setSelectedContact(contact);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        setUserData(user);
      } catch (error) {
        console.log("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;
    const fecthContactsAsync = async () => {
      setLoading(true);
      const response = await fetchContacts(userData);
      if (response) {
        setContacts(response);
      }
      setLoading(false);
    }

    fecthContactsAsync();
    
  }, [userData]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="border-r border-muted bg-muted/20 p-4 sm:p-6">
        <div className="grid gap-2 min-w-44">
          <ContactButton />
          <ContactList
            loading={loading}
            onClick={handleContactClick}
            selectedContact={selectedContact}
            contacts={contacts}
          />
        </div>
      </div>
      {selectedContact ? (
        <MessageBox
          conversationId={selectedContact.conversationId as string}
          closeMessageBox={() => setSelectedContact(null)}
          contact={selectedContact}
          userData={user}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center w-full">
            <Image
              className="max-w-60"
              src={NoContactSelectedImage}
              alt="No Contact Selected"
            />
            <p className="text-2xl mt-2 font-bold tracking-tight">
              You have no contact selected
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              Select a contact to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
