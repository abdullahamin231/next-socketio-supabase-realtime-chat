"use client";

import { useEffect, useState } from "react";
import {
  ContactButton,
  ContactList,
  CompleteContact,
  ContactListDrawer,
} from "./ContactComponents";
import { MessageBox } from "./MessageComponents";
import Image from "next/image";
import NoContactSelectedImage from "@/assets/no-contact-selected.svg";
import { User } from "@supabase/supabase-js";
import { fetchContacts } from "./actions";

export default function ChatApp({ user: userData }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] =
    useState<CompleteContact | null>(null);
  const [contacts, setContacts] = useState<CompleteContact[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleContactClick = (contact: CompleteContact) => {
    setSelectedContact(contact);
  };

  useEffect(() => {
    if (!userData) return;
    const fecthContactsAsync = async () => {
      setLoading(true);
      const localData = localStorage.getItem("contacts");
      if (!localData) {
        const response = await fetchContacts(userData);
        if (response) {
          setContacts(response);
          localStorage.setItem("contacts", JSON.stringify(response));
        }
      } else {
        setContacts(JSON.parse(localData));
      }
      setLoading(false);
    };

    fecthContactsAsync();
  }, [userData]);

  return (
    <div
      className={`flex flex-1 ${
        isMobile ? "flex-col items-center" : ""
      } overflow-hidden`}
    >
      <div
        className={`${
          !isMobile
            ? "border-r border-muted bg-muted/20 p-4 sm:p-6"
            : "border-r border-muted p-4 sm:p-6"
        }`}
      >
        {isMobile ? (
          <ContactListDrawer
            loading={loading}
            onClick={handleContactClick}
            selectedContact={selectedContact}
            contacts={contacts}
          />
        ) : (
          <div className={"grid gap-2 min-w-44"}>
            <ContactButton userId={userData.id} />
            <ContactList
              loading={loading}
              onClick={handleContactClick}
              selectedContact={selectedContact}
              contacts={contacts}
            />
          </div>
        )}
      </div>
      {selectedContact ? (
        <MessageBox
          conversationId={selectedContact.conversationId as string}
          closeMessageBox={() => setSelectedContact(null)}
          contact={selectedContact}
          userData={userData}
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
