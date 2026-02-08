import type { LegalPageData } from '../../components/legal';

export const privacyData: LegalPageData = {
  title: 'Privacy Policy',
  subtitle: 'SalesSphere Technologies Pvt. Ltd.',
  lastUpdated: 'February 8, 2026',
  sections: [
    {
      id: 'introduction',
      number: 1,
      title: 'Introduction',
      navTitle: 'Introduction',
      content: [
        {
          type: 'paragraph',
          text: 'Welcome to SalesSphere. Your privacy matters to us, and we are committed to safeguarding the personal information you entrust to us. This Privacy Policy explains how SalesSphere Technologies Pvt. Ltd. ("SalesSphere," "we," "our," or "us") collects, uses, shares, and protects your information when you use our web application, mobile applications, and related services (collectively, the "Service").',
        },
        {
          type: 'paragraph',
          text: 'This policy applies to all versions of the SalesSphere platform across all supported platforms — including Web and Mobile — and covers all users, whether you are an administrator, field executive, or other authorized team member. By using the Service, you acknowledge and consent to the practices described in this policy.',
        },
        {
          type: 'highlight',
          text: 'We encourage you to read this policy carefully. If you have any questions about how your data is handled, please do not hesitate to reach out to us using the contact details provided at the end of this document.',
        },
      ],
    },
    {
      id: 'information-collect',
      number: 2,
      title: 'Information We Collect',
      navTitle: 'Information We Collect',
      content: [
        {
          type: 'paragraph',
          text: 'To deliver a reliable and feature-rich experience, we collect the following categories of information. We only gather what is necessary to operate and improve the Service for you and your organization.',
        },
        {
          type: 'subheading',
          text: 'Account and Profile Information',
        },
        {
          type: 'list',
          items: [
            'Full name, email address, and phone number',
            'Account credentials (username and securely encrypted password)',
            'Profile photo (optional — you choose whether to upload one)',
            'Role, designation, and organizational hierarchy details',
          ],
        },
        {
          type: 'subheading',
          text: 'Employee and Workforce Data',
        },
        {
          type: 'list',
          items: [
            'Real-time GPS location data (collected only when tracking is enabled by your organization)',
            'Attendance records, including GPS-stamped check-in and check-out times',
            'Beat plan assignments, route information, and customer visit logs',
            'Leave requests, tour plans, and scheduling information',
            'Expense claims, uploaded receipts, and reimbursement records',
            'Odometer readings and trip distance records',
            'Performance metrics and activity logs',
            'Uploaded documents and employee records',
          ],
        },
        {
          type: 'subheading',
          text: 'Customer and Business Data',
        },
        {
          type: 'list',
          items: [
            'Customer and party names, contact details, and company information',
            'Business locations and service addresses',
            'Prospect information and sales pipeline data',
            'Order details, estimates, invoices, and transaction history',
            'Collection and payment records, including cheque details',
            'Product catalog and pricing information',
          ],
        },
        {
          type: 'subheading',
          text: 'Location Data',
        },
        {
          type: 'paragraph',
          text: 'We collect precise location information in the following situations:',
        },
        {
          type: 'list',
          items: [
            'When location tracking has been enabled for field employees by their organization',
            'When an employee uses the live tracking or attendance features',
            'During beat plan execution or when customer visits are being recorded',
            'When odometer-based trip tracking is active',
          ],
        },
        {
          type: 'highlight',
          text: 'Your privacy is important to us. Location tracking is always controlled by your organization\'s administrator, and employees are clearly informed whenever tracking is active. Location data is used solely for operational purposes — such as route optimization, attendance verification, and field activity monitoring — and is never shared with third parties for advertising or marketing purposes.',
        },
        {
          type: 'subheading',
          text: 'Technical and Usage Data',
        },
        {
          type: 'list',
          items: [
            'Browser type, device information, and operating system',
            'IP address and approximate location derived from IP',
            'Pages visited, features used, and session duration',
            'Error logs and performance data to help us improve the Service',
          ],
        },
      ],
    },
    {
      id: 'use-information',
      number: 3,
      title: 'How We Use Your Information',
      navTitle: 'How We Use Info',
      content: [
        {
          type: 'paragraph',
          text: 'We use the information we collect thoughtfully and responsibly, always with the goal of providing you with the best possible experience. Here is how we put your data to work:',
        },
        {
          type: 'subheading',
          text: 'Delivering and Operating the Service',
        },
        {
          type: 'list',
          items: [
            'Creating and managing user accounts and authenticating your sessions securely',
            'Enabling real-time GPS tracking and live location monitoring for field teams',
            'Managing attendance, leave requests, and workforce scheduling',
            'Processing orders, estimates, collections, and payment records',
            'Creating, assigning, and optimizing beat plans and sales routes',
            'Managing customer relationships, prospects, and the sales pipeline',
            'Generating analytics dashboards, performance reports, and data exports',
          ],
        },
        {
          type: 'subheading',
          text: 'Improving and Communicating',
        },
        {
          type: 'list',
          items: [
            'Enhancing application functionality, performance, and overall user experience',
            'Sending you important service-related notifications, alerts, and reminders',
            'Providing timely customer support and responding to your inquiries',
            'Maintaining platform security, preventing misuse, and detecting potential fraud',
            'Meeting our legal obligations and enforcing our Terms of Service',
          ],
        },
      ],
    },
    {
      id: 'sharing',
      number: 4,
      title: 'Information Sharing',
      navTitle: 'Information Sharing',
      content: [
        {
          type: 'paragraph',
          text: 'We want to be completely transparent about how your data may be shared. Rest assured, we do not sell your personal information — and we never will. Here are the limited circumstances in which we may share your data:',
        },
        {
          type: 'subheading',
          text: 'Within Your Organization',
        },
        {
          type: 'list',
          items: [
            'Employee data, location information, and performance metrics are accessible to authorized administrators and managers within your organization, based on role-based permissions',
            'This sharing is essential for the core functionality of the Service — for example, enabling managers to view their team\'s attendance or monitor field activity in real time',
          ],
        },
        {
          type: 'subheading',
          text: 'Trusted Third-Party Service Providers',
        },
        {
          type: 'list',
          items: [
            { bold: 'Google Maps API:', text: 'Used for map rendering, geocoding, and route services. This integration is subject to Google\'s own Privacy Policy' },
            { bold: 'Cloud Infrastructure:', text: 'Used for secure hosting and data storage. All data is processed in accordance with our data processing agreements' },
          ],
        },
        {
          type: 'subheading',
          text: 'Legal Obligations',
        },
        {
          type: 'paragraph',
          text: 'In rare circumstances, we may be required to disclose your information if compelled by law, court order, or government authority, or when necessary to protect the rights, safety, or property of SalesSphere, our users, or the general public.',
        },
      ],
    },
    {
      id: 'security',
      number: 5,
      title: 'Data Security',
      navTitle: 'Data Security',
      content: [
        {
          type: 'paragraph',
          text: 'We take the security of your data seriously and have implemented robust, industry-standard measures to keep your information safe:',
        },
        {
          type: 'list',
          items: [
            { bold: 'Encryption:', text: 'All data is encrypted both in transit (TLS/SSL) and at rest, ensuring your information remains protected at every stage' },
            { bold: 'Access Controls:', text: 'Our role-based permission system ensures that users can only access data relevant to their assigned role' },
            { bold: 'CSRF Protection:', text: 'Cross-site request forgery tokens are used to secure all authenticated requests against unauthorized actions' },
            { bold: 'Audit Logging:', text: 'Comprehensive activity logs support security monitoring and enable swift incident response' },
            { bold: 'Secure APIs:', text: 'Every API endpoint requires proper authentication and authorization before granting access' },
          ],
        },
        {
          type: 'paragraph',
          text: 'While we take every reasonable precaution to protect your information, please understand that no method of electronic transmission or storage is entirely immune to risk. We cannot guarantee absolute security, but we are fully committed to addressing any security incidents promptly and transparently.',
          italic: true,
        },
      ],
    },
    {
      id: 'retention',
      number: 6,
      title: 'Data Retention',
      navTitle: 'Data Retention',
      content: [
        {
          type: 'paragraph',
          text: 'We retain your data only for as long as it is needed to provide the Service and fulfill our legal obligations. Here is how our retention practices work:',
        },
        {
          type: 'list',
          items: [
            { bold: 'Active accounts:', text: 'Your data is retained for the duration of your active subscription so you can enjoy uninterrupted access to all features' },
            { bold: 'After termination:', text: 'Following account termination, your data remains available for export for 7 days, after which it may be permanently deleted from our systems' },
            { bold: 'Transaction records:', text: 'Retained for the period required by applicable tax, accounting, and legal compliance obligations' },
            { bold: 'Location data:', text: 'Retained for the duration configured by your organization\'s administrator, in line with operational needs' },
          ],
        },
        {
          type: 'paragraph',
          text: 'If you would like to request deletion of your account and associated data, please contact us at <a href="mailto:info@salessphere360.com" class="text-secondary hover:underline">info@salessphere360.com</a>. We will process all deletion requests within 7 days, unless retention is required by applicable law.',
        },
      ],
    },
    {
      id: 'rights',
      number: 7,
      title: 'Your Rights',
      navTitle: 'Your Rights',
      content: [
        {
          type: 'paragraph',
          text: 'We believe you should have meaningful control over your personal data. Depending on your jurisdiction, you may be entitled to the following rights:',
        },
        {
          type: 'list',
          items: [
            { bold: 'Access:', text: 'Request a clear summary of the personal data we hold about you' },
            { bold: 'Correction:', text: 'Update or correct any inaccurate information through your profile settings or by reaching out to us directly' },
            { bold: 'Deletion:', text: 'Request the deletion of your personal data, subject to any legal retention requirements' },
            { bold: 'Data Portability:', text: 'Export your data in widely supported formats (PDF, Excel) directly through the Service' },
            { bold: 'Location Control:', text: 'Organization administrators have the ability to enable or disable location tracking; employees are always informed of their tracking status' },
            { bold: 'Grievance Redressal:', text: 'If you have concerns about how your data is being handled, you are welcome to contact our Grievance Officer (details provided below)' },
          ],
        },
        {
          type: 'paragraph',
          text: 'To exercise any of these rights, simply reach out to us at <a href="mailto:info@salessphere360.com" class="text-secondary hover:underline font-semibold">info@salessphere360.com</a> or speak with your organization\'s administrator. We are here to help.',
        },
      ],
    },
    {
      id: 'location',
      number: 8,
      title: 'Location Data and Permissions',
      navTitle: 'Location Data',
      content: [
        {
          type: 'paragraph',
          text: 'Location data plays an important role in enabling the Service\'s field force management capabilities. We want you to understand exactly how and why we collect this information:',
        },
        {
          type: 'list',
          items: [
            'Tracking field employee locations in real time during working hours for operational visibility',
            'Verifying GPS-stamped attendance check-in and check-out',
            'Optimizing beat plans, sales routes, and territory assignments',
            'Recording customer visit locations for accountability and reporting',
            'Tracking odometer readings and trip distances for travel management',
            'Generating location-based analytics and performance reports',
          ],
        },
        {
          type: 'subheading',
          text: 'Transparency and Control',
        },
        {
          type: 'paragraph',
          text: 'We are committed to ensuring that location tracking is handled with full transparency:',
        },
        {
          type: 'list',
          items: [
            'All location tracking policies are configured by your organization\'s administrator',
            'Employees are clearly informed whenever location tracking is active',
            'Tracking can be limited to working hours only, as configured by the administrator',
            'Please note that disabling location permissions may restrict access to certain features, particularly for field executive roles',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      number: 9,
      title: 'Cookies and Session Management',
      navTitle: 'Cookies',
      content: [
        {
          type: 'paragraph',
          text: 'We use a minimal set of cookies and similar technologies — strictly what is needed to keep the Service running smoothly and securely:',
        },
        {
          type: 'list',
          items: [
            { bold: 'Authentication:', text: 'Session tokens that keep you signed in securely throughout your session' },
            { bold: 'Security:', text: 'CSRF tokens that protect your account against cross-site request forgery attacks' },
            { bold: 'Preferences:', text: 'Small data files that remember your settings and display preferences for a personalized experience' },
          ],
        },
        {
          type: 'paragraph',
          text: 'We do not use third-party advertising or marketing cookies. Every cookie we use is strictly necessary for the operation and security of the Service — nothing more.',
        },
      ],
    },
    {
      id: 'third-party',
      number: 10,
      title: 'Third-Party Services',
      navTitle: 'Third-Party Services',
      content: [
        {
          type: 'paragraph',
          text: 'To deliver a seamless and feature-rich experience, the Service integrates with a select number of trusted third-party providers:',
        },
        {
          type: 'list',
          items: [
            { bold: 'Google Maps:', text: 'Powers our interactive maps, live tracking visualization, geocoding, and route optimization. For more details, please refer to the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">Google Privacy Policy</a>' },
            { bold: 'Cloud Infrastructure:', text: 'Provides secure and reliable application hosting, database services, and file storage' },
          ],
        },
        {
          type: 'paragraph',
          text: 'Please note that your interactions with these third-party services are governed by their own terms and privacy policies. We encourage you to review them independently, as SalesSphere is not responsible for the privacy practices of external providers.',
        },
      ],
    },
    {
      id: 'changes',
      number: 11,
      title: 'Changes to This Policy',
      navTitle: 'Policy Changes',
      content: [
        {
          type: 'paragraph',
          text: 'As our platform grows and evolves, this Privacy Policy may need to be updated from time to time. Whenever we make material changes, we will make sure you are informed by:',
        },
        {
          type: 'list',
          items: [
            'Publishing the updated policy on our website with a revised "Last Updated" date',
            'Sending notifications through the application or via email for significant changes',
            'Providing at least 15 days\' notice before any material changes take effect',
          ],
        },
        {
          type: 'paragraph',
          text: 'If you continue to use the Service after the updated policy takes effect, this will be considered your acceptance of the changes. Should you disagree with any updates, we respectfully ask that you discontinue use of the Service and contact us if you have any concerns.',
        },
      ],
    },
    {
      id: 'contact',
      number: 12,
      title: 'Get in Touch',
      navTitle: 'Contact Us',
      content: [
        {
          type: 'paragraph',
          text: 'Your privacy is important to us, and we are always here to help. If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please do not hesitate to reach out:',
        },
        {
          type: 'contact',
          title: 'SalesSphere Technologies Pvt. Ltd.',
          contacts: [
            {
              type: 'email',
              label: 'Email',
              value: 'info@salessphere360.com',
              href: 'mailto:info@salessphere360.com',
            },
            {
              type: 'phone',
              label: 'Phone (Nepal)',
              value: '+977-981903166',
              href: 'tel:+977981903166',
            },
            {
              type: 'phone',
              label: 'Phone (India)',
              value: '+91-7991176217',
              href: 'tel:+917991176217',
            },
            {
              type: 'phone',
              label: 'Phone (India)',
              value: '+91-6204160441',
              href: 'tel:+916204160441',
            },
            {
              type: 'address',
              label: 'Registered Address',
              value: 'Biratnagar, Province No. 1,\nNepal',
            },
          ],
          note: 'For data protection or privacy-related inquiries, please include the subject line "Privacy Inquiry" in your email so we can prioritize your request.',
          responseTime: 'We aim to respond to all privacy-related inquiries within 7 business days.',
        },
      ],
    },
  ],
  footerNote: {
    title: 'Your Privacy, Our Commitment',
    text: 'By continuing to use SalesSphere, you acknowledge that you have read and understood this Privacy Policy. We are committed to protecting your data and being transparent about our practices.',
    copyright: true,
  },
};
