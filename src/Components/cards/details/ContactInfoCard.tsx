import React from 'react';

interface ContactItem {
  label: string;
  value: string;
}

interface ContactInfoCardProps {
  title: string;
  contacts: ContactItem[];
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ title, contacts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {contacts.map((contact) => (
        <div key={contact.label}>
          <p className="text-sm text-gray-500">{contact.label}</p>
          <p className="font-semibold text-gray-800 break-words">{contact.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactInfoCard;