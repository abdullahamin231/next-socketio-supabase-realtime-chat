"use client";

import { useState } from "react";
import { Contact, ContactButton, ContactList } from "./ContactComponents";
import { MessageBox } from "./MessageComponents";

export default function Body() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  }

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
      <MessageBox />
    </div>
  );
}

