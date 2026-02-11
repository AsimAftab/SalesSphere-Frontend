import type { FAQCategory } from './HelpCenterPage.types';

export const categories: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Set up your account, invite your team, and configure your first beat plan.',
    icon: 'Rocket',
    color: 'blue',
    items: [
      {
        id: 'gs-1',
        question: 'How do I create a SalesSphere account?',
        answer:
          'To get started, simply visit our <a href="/schedule-demo" class="text-blue-600 hover:underline font-medium">Schedule a Demo</a> page and fill in your details. Our team will contact you to schedule a personalized demo session. After the demo, you can choose the plan that best fits your needs, and we will set up your organization account. You\'ll receive your login credentials via email to access the platform.',
      },
      {
        id: 'gs-2',
        question: 'How do I add team members to my organization?',
        answer:
          'Navigate to <strong>Employees</strong> from the sidebar, then click <strong>Add Employee</strong>. Fill in the employee\'s name, email, phone number, and assign them a role. They\'ll receive an email with their login credentials automatically.',
      },
      {
        id: 'gs-3',
        question: 'What roles are available in SalesSphere?',
        answer:
          'SalesSphere supports role-based access control. The admin can create any custom roles tailored to the organization\'s needs and assign granular permissions that control access to specific modules and actions. Roles can be created and customized in <strong>Admin Panel &gt; Roles &amp; Permissions</strong>.',
      },
      {
        id: 'gs-4',
        question: 'How do I create my first beat plan?',
        answer:
          'Go to <strong>Beat Plan</strong> from the sidebar and click <strong>Create Beat Plan</strong>. Add the entities (parties/prospects) you want to visit, set the schedule, and assign the plan to a team member. Beat plans help organize daily visit routes and ensure complete territory coverage.',
      },
      {
        id: 'gs-5',
        question: 'How does GPS tracking work?',
        answer:
          'GPS tracking is tied to beat plans. Once a beat plan is assigned to an employee, they start tracking when they begin the beat. The system records their location throughout the beat and tracking stops automatically after the last party is visited. Administrators can view the complete route history in real time via <strong>Live Tracking</strong>.',
      },
      {
        id: 'gs-6',
        question: 'What platforms is SalesSphere available on?',
        answer:
          'SalesSphere is available as a <strong>web application</strong> accessible from any modern browser and as a <strong>mobile app</strong> for Android. The web app is designed for administrators and managers, while the mobile app is optimized for field employees to manage beat plans, attendance, orders, and more on the go.',
      },
    ],
  },
  {
    id: 'administrators',
    title: 'For Administrators',
    description: 'Manage roles, monitor teams, configure dashboards, and handle subscriptions.',
    icon: 'ShieldCheck',
    color: 'purple',
    items: [
      {
        id: 'admin-1',
        question: 'How do I manage roles and permissions?',
        answer:
          'Go to <strong>Admin Panel &gt; Roles &amp; Permissions</strong>. Here you can create custom roles, assign granular permissions for each module (employees, orders, expenses, etc.), and control what each team member can view, create, edit, or delete. Changes take effect immediately.',
      },
      {
        id: 'admin-2',
        question: 'How does real-time location tracking work?',
        answer:
          'When an employee starts an assigned beat plan, GPS tracking begins automatically. You can view all active team members on an interactive map via <strong>Live Tracking</strong>. For each employee, you can see their complete route history from the start of the beat plan to the last visited entity (party/prospect). Tracking stops automatically once the last entity (party/prospect) in the beat is visited.',
      },
      {
        id: 'admin-3',
        question: 'How do I use the analytics dashboard?',
        answer:
          'The <strong>Dashboard</strong> provides an overview of key metrics including sales performance, attendance rates, order volumes, and collection summaries. Use the <strong>Analytics</strong> page for deeper insights with charts, trends, and exportable reports in PDF or Excel formats.',
      },
      {
        id: 'admin-4',
        question: 'How do I manage my organization\'s subscription?',
        answer:
          'Subscription details can be viewed and managed through <strong>Admin Panel &gt; Plan and Billing</strong>. You can see your current plan, billing cycle, user limits, and payment history. To upgrade, downgrade, or modify your plan, contact our support team at <a href="mailto:support@salessphere360.com" class="text-blue-600 hover:underline font-medium">support@salessphere360.com</a>.',
      },
      {
        id: 'admin-5',
        question: 'How do I approve or reject leave and expense requests?',
        answer:
          'You can filter by status in the respective modules (<strong>Leaves</strong>, <strong>Expenses</strong>, or <strong>Tour Plan</strong>) to see pending requests. Click on a pending request to review details, attached receipts, or leave/tour reasons. You can approve or reject with a single click.',
      },
      {
        id: 'admin-6',
        question: 'Can I export data from SalesSphere?',
        answer:
          'Yes. Most modules support data export in <strong>PDF</strong> and <strong>Excel</strong> formats. Navigate to the relevant section (Orders, Attendance, Expenses, etc.), apply any desired filters, and click the <strong>Export</strong> button.',
      },
    ],
  },
  {
    id: 'field-executives',
    title: 'For Field Executives',
    description: 'Check in/out, manage beat plans, create orders, and submit expenses.',
    icon: 'MapPinCheck',
    color: 'emerald',
    items: [
      {
        id: 'fe-1',
        question: 'How do I check in and check out?',
        answer:
          'After logging in, tap <strong>Utilities</strong> in the bottom bar, then go to <strong>Attendance</strong> and click the <strong>Check In</strong> button. The system will record your GPS coordinates and timestamp. If geo-fencing is enabled for your organization, you can only check in within the organization\'s radius. If geo-fencing is not enabled, you can check in from anywhere but your location is still recorded. When you leave, click <strong>Check Out</strong>.',
      },
      {
        id: 'fe-2',
        question: 'How do I follow my assigned beat plan?',
        answer:
          'After logging in, the first page itself shows your beat plans in a tabbed format — <strong>Active &amp; Pending</strong> in one tab and <strong>Completed</strong> in another. Select an active beat plan to see the list of entities (parties/prospects) to visit with their addresses. You check in at each entity and mark it as completed, which is automatically reflected in the progress bar.',
      },
      {
        id: 'fe-3',
        question: 'How do I create an order or estimate?',
        answer:
          'After logging in, tap <strong>Invoice</strong> in the bottom bar. Select the customer (party), choose products from the catalog, set quantities and pricing, and choose the expected delivery date and click <strong>Generate Invoice</strong> for an order, or click <strong>Estimate</strong> for a quotation. Both can be exported as PDF for the customer.',
      },
      {
        id: 'fe-4',
        question: 'How do I record a collection or payment?',
        answer:
          'After logging in, tap <strong>Utilities</strong> in the bottom bar, then go to <strong>Collection</strong> and click <strong>Add Collection</strong>. Select the customer, enter the payment amount, choose the payment method (cash, cheque, UPI, bank transfer), and add any reference numbers. For cheque payments, you can record the cheque number and date for tracking.',
      },
      {
        id: 'fe-5',
        question: 'How do I submit an expense claim?',
        answer:
          'After logging in, tap <strong>Utilities</strong> in the bottom bar, then go to <strong>Expenses</strong> and click <strong>Add Expense</strong>. Select the expense category (travel, food, accommodation, etc.), enter the amount, add a description, and upload receipt photos. Your claim will be submitted for approval. You can track the status in the Expenses section.',
      },
      {
        id: 'fe-6',
        question: 'How do I record odometer readings?',
        answer:
          'After logging in, tap <strong>Utilities</strong> in the bottom bar, then go to <strong>Odometer</strong> and click <strong>Add Reading</strong>. First, enter the start reading, upload an image, and add a description. When ending the trip, enter the end reading, upload an image, and add a description. The system will automatically calculate the distance traveled. You can start multiple odometer readings in a day. These records are used for travel expense verification.',
      },
    ],
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    description: 'Update your profile, manage passwords, and understand data privacy.',
    icon: 'UserCog',
    color: 'orange',
    items: [
      {
        id: 'as-1',
        question: 'How do I update my profile information?',
        answer:
          'Click on your avatar in the header or navigate to <strong>Settings</strong> from the sidebar to open the Settings page. You can update your name, phone number, address, and profile photo. Some fields may be restricted based on your organization\'s policies and can only be modified by an administrator.',
      },
      {
        id: 'as-2',
        question: 'How do I change my password?',
        answer:
          'Go to <strong>Settings</strong> and click the <strong>Change Password</strong> button. Enter your current password, then type and confirm your new password. If you\'ve forgotten your password, use the <a href="/forgot-password" class="text-blue-600 hover:underline font-medium">Forgot Password</a> link on the login page.',
      },
      {
        id: 'as-3',
        question: 'How does role-based access control work?',
        answer:
          'SalesSphere uses granular role-based access control (RBAC). Each user is assigned a role that determines which modules they can access and what actions they can perform. Administrators configure these permissions in <strong>Admin Panel &gt; Roles &amp; Permissions</strong>. This ensures every user only sees data relevant to their responsibilities.',
      },
      {
        id: 'as-4',
        question: 'Can I export or download my personal data?',
        answer:
          'Yes. You can export your personal data, attendance records, expense claims, and other information from the respective modules using the <strong>Export</strong> feature. For a comprehensive data export or to exercise your data portability rights, contact your administrator or email us at <a href="mailto:support@salessphere360.com" class="text-blue-600 hover:underline font-medium">support@salessphere360.com</a>.',
      },
      {
        id: 'as-5',
        question: 'How do I request account deletion?',
        answer:
          'To request account deletion, contact your organization\'s administrator or email us at <a href="mailto:support@salessphere360.com" class="text-blue-600 hover:underline font-medium">support@salessphere360.com</a> with the subject line "Account Deletion Request." We will process your request within 7 business days. Please note that your data will be available for export for 7 days after deletion, after which it is permanently removed. For more details, see our <a href="/privacy-policy" class="text-blue-600 hover:underline font-medium">Privacy Policy</a>.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Fix GPS issues, check-in problems, performance slowdowns, and more.',
    icon: 'AlertTriangle',
    color: 'rose',
    items: [
      {
        id: 'ts-1',
        question: 'GPS location is not being detected — what should I do?',
        answer:
          'First, ensure that <strong>Location Services</strong> are enabled on your device and that your browser has permission to access your location. Try these steps:<br/><br/>1. Open your browser settings and allow location access for SalesSphere.<br/>2. Ensure you\'re not using a VPN that masks your location.<br/>3. Move to an area with better GPS signal (away from tall buildings or underground).<br/>4. Clear your browser cache and reload the page.<br/>5. If using mobile, restart the app and try again.<br/><br/>If the issue persists, contact your administrator or reach out to our support team.',
      },
      {
        id: 'ts-2',
        question: 'I can\'t check in at my assigned location — what\'s wrong?',
        answer:
          'This usually happens when you are outside the configured <strong>check-in radius</strong> for the location. Ensure you are physically at or near the assigned customer location. If your GPS signal is inaccurate, try moving to an open area for a better fix.',
      },
      {
        id: 'ts-3',
        question: 'The application is running slowly — how can I improve performance?',
        answer:
          'Try the following steps to improve performance:<br/><br/>1. Clear your browser cache and cookies.<br/>2. Close unnecessary browser tabs and applications.<br/>3. Ensure you have a stable internet connection.<br/>4. Use the latest version of a supported browser (Chrome, Firefox, Edge, or Safari).<br/>5. If on mobile, ensure the app is updated to the latest version.<br/><br/>If performance issues continue, please contact our support team with details about your device and browser.',
      },
      {
        id: 'ts-4',
        question: 'Which browsers are supported?',
        answer:
          'SalesSphere works best on the latest versions of <strong>Google Chrome</strong>, <strong>Mozilla Firefox</strong>, <strong>Microsoft Edge</strong>, and <strong>Apple Safari</strong>. We recommend keeping your browser up to date for the best experience. Internet Explorer is not supported.',
      },
      {
        id: 'ts-5',
        question: 'My data isn\'t syncing — what should I check?',
        answer:
          'Data sync issues are usually related to network connectivity. Check your internet connection and try refreshing the page. For beat plans, if you lose network during an active beat, your data will be cached locally and automatically synced once you are back online. Make sure you\'re not blocking any SalesSphere domains in your firewall or ad blocker. If the problem persists, try logging out and back in, or contact support.',
      },
      {
        id: 'ts-6',
        question: 'I forgot my login email — what should I do?',
        answer:
          'Your email is either given by you to your organization\'s administrator or provided by them when creating your account. A one-time temporary password is generated once your account is set up. If you\'ve forgotten your email, please contact your administrator to retrieve your account details. If you are an administrator, reach out to our support team at <a href="mailto:support@salessphere360.com" class="text-blue-600 hover:underline font-medium">support@salessphere360.com</a> for assistance.',
      },
    ],
  },
  {
    id: 'contact-support',
    title: 'Contact & Support',
    description: 'Learn how to reach us, our response times, and the cancellation process.',
    icon: 'Headphones',
    color: 'cyan',
    items: [
      {
        id: 'cs-1',
        question: 'How can I contact SalesSphere support?',
        answer:
          'You can reach our support team through the following channels:<br/><br/><strong>Email:</strong> <a href="mailto:support@salessphere360.com" class="text-blue-600 hover:underline font-medium">support@salessphere360.com</a><br/><strong>Phone (Nepal):</strong> <a href="tel:+977981903166" class="text-blue-600 hover:underline font-medium">+977-981903166</a><br/><strong>Phone (India):</strong> <a href="tel:+917991176217" class="text-blue-600 hover:underline font-medium">+91-7991176217</a> / <a href="tel:+916204160441" class="text-blue-600 hover:underline font-medium">+91-6204160441</a><br/><br/>Our team is available during business hours and we strive to respond to all inquiries promptly.',
      },
      {
        id: 'cs-2',
        question: 'What are the typical response times for support requests?',
        answer:
          'We aim to respond to all support inquiries within <strong>24 hours</strong> during business days. Critical issues (e.g., login failures, data access problems) are prioritized and typically addressed within a few hours. For general questions and feature requests, you can expect a response within 1–2 business days.',
      },
      {
        id: 'cs-3',
        question: 'How do I cancel my subscription?',
        answer:
          'To cancel your subscription, contact our support team at <a href="mailto:support@salessphere360.com" class="text-blue-600 hover:underline font-medium">support@salessphere360.com</a> with the subject line "Subscription Cancellation." Your cancellation will take effect at the end of your current billing cycle. You will retain access to the Service until then. After cancellation, your data will be available for export for 7 days. For full details, see our <a href="/terms-and-conditions" class="text-blue-600 hover:underline font-medium">Terms and Conditions</a>.',
      },
      {
        id: 'cs-4',
        question: 'Can I schedule a demo before subscribing?',
        answer:
          'Absolutely! We encourage you to see SalesSphere in action before making a decision. Visit our <a href="/schedule-demo" class="text-blue-600 hover:underline font-medium">Schedule a Demo</a> page, fill in your details, and our team will arrange a personalized walkthrough of the platform tailored to your business needs.',
      },
    ],
  },
];
