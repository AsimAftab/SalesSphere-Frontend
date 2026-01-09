import React from 'react';
import ContactInfoCard from '../../../../components/cards/EmployeeDetails_cards/ContactInfoCard';
import { type Employee } from '../../../../api/employeeService';

interface ContactSectionProps {
    employee: Employee | null;
}

const ContactSection: React.FC<ContactSectionProps> = ({ employee }) => {
    if (!employee) return null;

    const contactDetails = [
        { label: 'Email Address', value: employee.email },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
        { label: 'Address', value: employee.address || 'N/A' },
    ];

    return (
        <ContactInfoCard
            title="Contact Information"
            contacts={contactDetails}
        />
    );
};

export default ContactSection;
