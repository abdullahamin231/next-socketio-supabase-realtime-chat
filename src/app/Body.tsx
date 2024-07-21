"use client";

import { useState } from "react";
import { Contact, ContactButton, ContactList } from "./ContactComponents";
import { MessageBox } from "./MessageComponents";
import Image from "next/image";
import NoContactSelectedImage from "@/assets/no-contact-selected.svg";

export default function Body() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const dummyContacts = [
    {
      fallback: "JD",
      name: "John Doe",
      latestMessage: "What are you doing?",
      lastSeen: "2h",
    },
    {
      fallback: "AA",
      name: "Abdullah Amin",
      latestMessage: "Hello, how are you?",
      lastSeen: "1m",
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="border-r border-muted bg-muted/20 p-4 sm:p-6">
        <div className="grid gap-2">
          <ContactButton />
          <ContactList onClick={handleContactClick} contacts={dummyContacts} />
        </div>
      </div>
      {selectedContact ? (
        <MessageBox contact={selectedContact} />
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
