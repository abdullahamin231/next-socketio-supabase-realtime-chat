import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddContactButton from "./AddContactButton";


export interface Contact {
  fallback: string;
  name: string;
  latestMessage: string;
  lastSeen: string;
}

export const ContactButton = () => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-lg font-medium">Contacts</h2>
      <AddContactButton />
    </div>
  );
};



interface ContactItemProps extends Contact {
  onClick: () => void;
}

export const ContactItem = ({
  fallback,
  name,
  latestMessage,
  lastSeen,
  onClick,
}: ContactItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer"
    >
      <Avatar className="h-10 w-10 border">
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{latestMessage}</p>
      </div>
      <div className="text-xs text-muted-foreground">{lastSeen}</div>
    </div>
  );
};

interface ContactListProps {
  contacts: Contact[];
  onClick: (contact: Contact) => void;
}

export const ContactList = ({ contacts, onClick }: ContactListProps) => {
  return (
    <ScrollArea className="h-96">
      {contacts.map((contact, i) => (
        <ContactItem key={i} {...contact} onClick={() => onClick(contact)} />
      ))}
    </ScrollArea>
  );
};
