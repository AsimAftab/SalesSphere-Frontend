import type { LegalPageData } from '../../components/legal';

export const termsData: LegalPageData = {
  title: 'Terms and Conditions',
  subtitle: 'SalesSphere Technologies Pvt. Ltd.',
  lastUpdated: 'February 8, 2026',
  sections: [
    {
      id: 'acceptance',
      number: 1,
      title: 'Introduction and Acceptance',
      navTitle: 'Acceptance',
      content: [
        {
          type: 'paragraph',
          text: 'Welcome to SalesSphere. These Terms and Conditions ("Terms") outline the rules and guidelines that govern your access to and use of the SalesSphere platform, operated by SalesSphere Technologies Pvt. Ltd. ("SalesSphere," "we," "our," or "us"). This includes our web application, mobile applications, and all related services (collectively, the "Service").',
        },
        {
          type: 'paragraph',
          text: 'By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, we kindly ask that you refrain from using the Service.',
        },
        {
          type: 'highlight',
          text: 'These Terms form a legally binding agreement between you and SalesSphere Technologies Pvt. Ltd. We encourage you to read them carefully before proceeding.',
        },
      ],
    },
    {
      id: 'definitions',
      number: 2,
      title: 'Definitions',
      navTitle: 'Definitions',
      content: [
        {
          type: 'paragraph',
          text: 'To help you better understand these Terms, the following key terms are defined below:',
        },
        {
          type: 'list',
          items: [
            { bold: '"Service":', text: 'Refers to the SalesSphere platform, including the website, web application, mobile applications, APIs, and all associated tools and features' },
            { bold: '"User," "You," or "Your":', text: 'Refers to any individual or organization that accesses or uses the Service' },
            { bold: '"Organization":', text: 'The company or business entity that holds an active subscription to the Service' },
            { bold: '"Administrator":', text: 'A User who has been granted administrative privileges to manage the Organization\'s account, team members, and platform settings' },
            { bold: '"Field Executive":', text: 'An employee User who carries out field operations such as customer visits, order collection, and beat plan execution' },
            { bold: '"Account":', text: 'Your personal registered account on the SalesSphere platform' },
            { bold: '"Content":', text: 'Any data, information, text, images, documents, or other materials that are uploaded, submitted, or generated through the Service' },
          ],
        },
      ],
    },
    {
      id: 'service',
      number: 3,
      title: 'What SalesSphere Offers',
      navTitle: 'Our Service',
      content: [
        {
          type: 'paragraph',
          text: 'SalesSphere is a comprehensive field sales management and workforce automation platform built to help businesses streamline their field operations. Through the Service, your organization can access:',
        },
        {
          type: 'list',
          items: [
            'Real-time GPS tracking and live location monitoring of field employees',
            'GPS-verified attendance management with check-in and check-out',
            'Order and estimate creation, processing, and fulfillment tracking',
            'Customer (Party) management, prospect pipeline, and CRM tools',
            'Beat plan creation, team assignment, and route optimization',
            'Collections and payment tracking, including cheque management',
            'Expense claims and reimbursement workflows with receipt uploads',
            'Tour planning and scheduling for field teams',
            'Odometer and trip distance tracking for field travel',
            'Leave request and approval management',
            'Document management and employee record keeping',
            'Analytics dashboards, performance reports, and data exports in PDF and Excel formats',
            'Multi-site and multi-user support with role-based access control',
          ],
        },
        {
          type: 'paragraph',
          text: 'We are continuously working to improve the Service. From time to time, we may introduce new features, modify existing ones, or retire certain functionality. We will make every reasonable effort to inform you of any significant changes through in-app notifications or email.',
        },
      ],
    },
    {
      id: 'account',
      number: 4,
      title: 'Account Registration and Eligibility',
      navTitle: 'Account & Eligibility',
      content: [
        {
          type: 'subheading',
          text: 'Who Can Use the Service',
        },
        {
          type: 'list',
          items: [
            'You must be at least 18 years of age to create an account or use the Service',
            'You must have the legal authority to enter into this agreement, whether on your own behalf or on behalf of your organization',
            'If you are registering on behalf of an organization, you confirm that you are duly authorized to bind that organization to these Terms',
            'The Service is designed exclusively for business and professional use',
          ],
        },
        {
          type: 'subheading',
          text: 'Keeping Your Account Secure',
        },
        {
          type: 'paragraph',
          text: 'We take account security seriously, and we ask that you do the same:',
        },
        {
          type: 'list',
          items: [
            'Please provide accurate, up-to-date, and complete information during registration',
            'Keep your login credentials confidential and do not share them with unauthorized individuals',
            'If you suspect any unauthorized access to your account, please notify us immediately at info@salessphere360.com',
            'You are responsible for all activity that takes place under your account',
          ],
        },
      ],
    },
    {
      id: 'responsibilities',
      number: 5,
      title: 'Acceptable Use',
      navTitle: 'Acceptable Use',
      content: [
        {
          type: 'paragraph',
          text: 'We want SalesSphere to be a safe, reliable, and productive platform for everyone. To that end, we ask that all users adhere to the following guidelines:',
        },
        {
          type: 'subheading',
          text: 'What we expect from you',
        },
        {
          type: 'list',
          items: [
            'Use the Service in compliance with all applicable laws and regulations in your jurisdiction',
            'Obtain proper consent from employees before enabling GPS tracking, attendance monitoring, or any form of location-based data collection',
            'Ensure that your use of the Service complies with applicable labor laws and employee privacy regulations',
            'Take responsibility for the accuracy and integrity of the data you enter into the platform',
            'Use the Service solely for its intended business purposes',
          ],
        },
        {
          type: 'subheading',
          text: 'What is not permitted',
        },
        {
          type: 'list',
          items: [
            'Using the Service in any manner that violates applicable laws or regulations',
            'Uploading or transmitting malicious software, viruses, or any form of harmful code',
            'Attempting to gain unauthorized access to the Service, its infrastructure, or other users\' accounts',
            'Reverse engineering, decompiling, or disassembling any part of the Service',
            'Reselling, sublicensing, or redistributing the Service without prior written authorization from SalesSphere',
            'Using the Service to monitor or track individuals without their knowledge and informed consent',
            'Interfering with or disrupting the normal operation of the Service',
            'Employing automated bots, scrapers, or similar tools to access the Service without our permission',
          ],
        },
      ],
    },
    {
      id: 'subscription',
      number: 6,
      title: 'Subscription and Payment',
      navTitle: 'Subscription & Payment',
      content: [
        {
          type: 'subheading',
          text: 'Subscription Plans',
        },
        {
          type: 'paragraph',
          text: 'The Service is available through a range of subscription plans, each tailored to different business needs:',
        },
        {
          type: 'list',
          items: [
            'Plans vary by features, user limits, and the level of support provided',
            'Subscription fees are billed in advance on a monthly or annual basis, depending on your selected plan',
            'We encourage you to schedule a demo through our website to explore the platform before committing to a subscription',
            'Custom enterprise plans can be arranged to meet the specific requirements of larger organizations',
          ],
        },
        {
          type: 'subheading',
          text: 'Payment Terms',
        },
        {
          type: 'list',
          items: [
            'All fees are quoted in the applicable local currency (INR or NPR) unless otherwise agreed upon in writing',
            'Subscription fees are non-refundable, except where required by applicable law or as specifically outlined in your subscription agreement',
            'Should we need to adjust our pricing, we will provide you with at least 7 days\' advance written notice',
            'If subscription fees remain unpaid past the due date, we may need to suspend or restrict access to the Service until payment is received',
            'All applicable taxes — including GST, VAT, or other local levies — will be added to your subscription fees as required by law',
          ],
        },
      ],
    },
    {
      id: 'intellectual',
      number: 7,
      title: 'Intellectual Property',
      navTitle: 'Intellectual Property',
      content: [
        {
          type: 'subheading',
          text: 'Our Intellectual Property',
        },
        {
          type: 'paragraph',
          text: 'The Service — including its software, visual design, text, graphics, logos, icons, and all underlying technology — is the intellectual property of SalesSphere Technologies Pvt. Ltd. or its licensors, and is protected under applicable intellectual property laws. During the term of your subscription, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your internal business purposes.',
        },
        {
          type: 'subheading',
          text: 'Your Content',
        },
        {
          type: 'paragraph',
          text: 'We respect your ownership of the data you bring to the platform:',
        },
        {
          type: 'list',
          items: [
            'You retain full ownership of all content you upload or submit to the Service',
            'By using the Service, you grant us a limited license to store, process, and display your content solely for the purpose of delivering the Service to you',
            'You confirm that you hold all necessary rights to the content you upload and that it does not infringe upon any applicable law or third-party rights',
          ],
        },
      ],
    },
    {
      id: 'privacy',
      number: 8,
      title: 'Data Privacy and Security',
      navTitle: 'Data Privacy',
      content: [
        {
          type: 'paragraph',
          text: 'Protecting your data is a responsibility we take seriously. Our collection, use, and safeguarding of personal data is governed by our Privacy Policy, which forms an integral part of these Terms.',
        },
        {
          type: 'list',
          items: [
            'As an Organization, you are responsible for securing all necessary consents from your employees before enabling data collection features, including GPS tracking and attendance monitoring',
            'You are expected to comply with all applicable data protection and privacy laws in your jurisdiction, including but not limited to the Individual Privacy Act, 2075 (Nepal) and the Digital Personal Data Protection Act, 2023 (India)',
            'We employ industry-standard security measures — including data encryption, role-based access controls, and comprehensive audit logging — to safeguard your information',
            'In the event of account termination, your data will remain available for export for 7 days. After this period, it may be permanently removed from our systems',
          ],
        },
      ],
    },
    {
      id: 'third-party',
      number: 9,
      title: 'Third-Party Services',
      navTitle: 'Third-Party Services',
      content: [
        {
          type: 'paragraph',
          text: 'To deliver a seamless experience, the Service integrates with select third-party providers:',
        },
        {
          type: 'list',
          items: [
            { bold: 'Google Maps API:', text: 'Powers our interactive maps, live tracking, route visualization, and geocoding features' },
            { bold: 'Cloud Infrastructure Providers:', text: 'Ensures secure and reliable application hosting, data storage, and content delivery' },
          ],
        },
        {
          type: 'paragraph',
          text: 'Please note that your use of these third-party services is subject to their own terms and privacy policies. We encourage you to review them independently, as SalesSphere is not responsible for the practices of external service providers.',
        },
      ],
    },
    {
      id: 'termination',
      number: 10,
      title: 'Termination',
      navTitle: 'Termination',
      content: [
        {
          type: 'subheading',
          text: 'If you wish to cancel',
        },
        {
          type: 'list',
          items: [
            'You are free to cancel your subscription at any time by reaching out to us directly',
            'Your cancellation will take effect at the end of the current billing period',
            'Refunds for unused portions of a billing cycle are not issued, except where required by applicable law',
          ],
        },
        {
          type: 'subheading',
          text: 'If we need to take action',
        },
        {
          type: 'paragraph',
          text: 'In certain circumstances, we may need to suspend or terminate your access to the Service. This may occur if:',
        },
        {
          type: 'list',
          items: [
            'There is a breach of any provision of these Terms',
            'Subscription fees remain unpaid beyond the due date',
            'Your usage poses a security risk to the platform or other users',
            'We are compelled to act by law or legal process',
            'We decide to discontinue the Service, in which case we will provide reasonable advance notice',
          ],
        },
        {
          type: 'subheading',
          text: 'What happens after termination',
        },
        {
          type: 'paragraph',
          text: 'Upon termination, please be aware of the following:',
        },
        {
          type: 'list',
          items: [
            'All rights and licenses granted to you under these Terms will cease immediately',
            'You will have 7 days to export your data in supported formats (PDF, Excel)',
            'After this 7-day window, your data may be permanently deleted from our systems',
            'Provisions relating to intellectual property, limitation of liability, indemnification, and governing law will continue to apply',
          ],
        },
      ],
    },
    {
      id: 'liability',
      number: 11,
      title: 'Limitation of Liability',
      navTitle: 'Liability',
      content: [
        {
          type: 'paragraph',
          text: 'We are committed to providing a reliable and high-quality Service. However, to the fullest extent permitted by applicable law, please note the following:',
        },
        {
          type: 'list',
          items: [
            'SalesSphere shall not be held liable for any indirect, incidental, special, consequential, or punitive damages that may arise from your use of the Service',
            'This includes, but is not limited to, damages relating to loss of profits, revenue, data, or business opportunities',
            'Our total cumulative liability for any claims related to the Service shall not exceed the total fees you have paid to SalesSphere in the 12 months immediately preceding the claim',
          ],
        },
        {
          type: 'paragraph',
          text: 'While we strive to maintain high service uptime, we cannot guarantee that the Service will operate without interruption or error at all times. Scheduled maintenance windows and unforeseen technical issues may occasionally result in brief service disruptions.',
          italic: true,
        },
      ],
    },
    {
      id: 'indemnification',
      number: 12,
      title: 'Indemnification',
      navTitle: 'Indemnification',
      content: [
        {
          type: 'paragraph',
          text: 'You agree to indemnify, defend, and hold harmless SalesSphere Technologies Pvt. Ltd., along with its officers, directors, employees, and agents, from and against any claims, damages, losses, or expenses — including reasonable legal fees — that may arise from:',
        },
        {
          type: 'list',
          items: [
            'Your use of, or inability to use, the Service',
            'Any breach of these Terms on your part',
            'Non-compliance with applicable laws or regulations, including a failure to obtain the required employee consents for tracking and monitoring activities',
            'Any content you upload or submit through the Service that infringes upon the rights of a third party',
          ],
        },
      ],
    },
    {
      id: 'governing-law',
      number: 13,
      title: 'Governing Law and Dispute Resolution',
      navTitle: 'Governing Law',
      content: [
        {
          type: 'paragraph',
          text: 'We believe in resolving matters fairly and transparently:',
        },
        {
          type: 'list',
          items: [
            'These Terms are governed by and shall be interpreted in accordance with the laws of Nepal',
            'Any disputes arising from or in connection with these Terms or the Service shall fall under the exclusive jurisdiction of the courts in Biratnagar, Nepal',
            'Before pursuing formal legal proceedings, both parties agree to make a good-faith effort to resolve the matter through direct negotiation for a minimum period of 7 days',
          ],
        },
      ],
    },
    {
      id: 'modifications',
      number: 14,
      title: 'Changes to These Terms',
      navTitle: 'Changes',
      content: [
        {
          type: 'paragraph',
          text: 'As our platform evolves, these Terms may need to be updated from time to time. Whenever we make material changes, we will ensure you are informed by:',
        },
        {
          type: 'list',
          items: [
            'Publishing the revised Terms on our website with an updated "Last Updated" date',
            'Sending an email notification to all registered users for significant updates',
            'Allowing at least 15 days\' notice before any material changes take effect',
          ],
        },
        {
          type: 'paragraph',
          text: 'If you continue to use the Service after the revised Terms take effect, this will be considered your acceptance of the updated Terms. Should you disagree with any changes, we respectfully ask that you discontinue use of the Service.',
        },
      ],
    },
    {
      id: 'contact',
      number: 15,
      title: 'Get in Touch',
      navTitle: 'Contact',
      content: [
        {
          type: 'paragraph',
          text: 'We value open communication. If you have any questions, concerns, or feedback regarding these Terms, please do not hesitate to reach out to us:',
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
        },
      ],
    },
  ],
  footerNote: {
    title: 'Acceptance of Terms',
    text: 'By continuing to use SalesSphere, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy.',
    copyright: true,
  },
};
