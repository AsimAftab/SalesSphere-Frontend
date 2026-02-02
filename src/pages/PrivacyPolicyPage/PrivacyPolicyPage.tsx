import React from 'react';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">

          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-lg text-gray-600">SalesSphere Web Application</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: November 24, 2025</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
              <nav className="space-y-2">
                {[
                  { id: 'introduction', title: '1. Introduction' },
                  { id: 'information-collect', title: '2. Information We Collect' },
                  { id: 'use-information', title: '3. How We Use Info' },
                  { id: 'sharing', title: '4. Information Sharing' },
                  { id: 'security', title: '5. Data Security' },
                  { id: 'retention', title: '6. Data Retention' },
                  { id: 'rights', title: '7. Your Rights' },
                  { id: 'location', title: '8. Location Permissions' },
                  { id: 'third-party', title: '9. Third-Party Links' },
                  { id: 'children', title: '10. Children\'s Privacy' },
                  { id: 'changes', title: '11. Changes to Policy' },
                  { id: 'contact', title: '12. Contact Us' },
                  { id: 'consent', title: '13. Consent' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-full text-left px-3 py-2 rounded transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
              {/* Section 1: Introduction */}
              <section id="introduction">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  SalesSphere ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services (collectively, the "Service"). By using SalesSphere, you agree to the collection and use of information in accordance with this policy.
                </p>
                <p className="text-gray-700 leading-relaxed text-justify mt-4">
                  This policy applies to all versions of the SalesSphere application on all device platforms (Web and Mobile). We encourage you to read this policy carefully before using our Service.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 2: Information We Collect */}
              <section id="information-collect">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                <p className="text-gray-700 text-justify mb-4">We collect various types of information to provide and improve our Service:</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Full name and contact details (phone number, email address)</li>
                      <li>Account credentials (username, password)</li>
                      <li>Profile photo (optional)</li>
                      <li>Employee identification details</li>
                      <li>Role and designation information</li>
                      {/* <li>Department and reporting structure</li> */}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Employee Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Real-time GPS location data (when tracking is enabled)</li>
                      <li>Attendance records (check-in/check-out times)</li>
                      <li>Beat plan assignments and route information</li>
                      <li>Working hours and schedule information</li>
                      <li>Performance metrics and KPIs</li>
                      <li>Site assignments and territory information</li>
                      <li>Task completion and activity logs</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Customer and Party Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Customer/Party names and company information</li>
                      <li>Contact details (phone, email, address)</li>
                      <li>Business location and service addresses</li>
                      <li>Prospect information and conversion tracking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.4 Order and Transaction Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Order details and specifications</li>
                      <li>Product information and quantities</li>
                      <li>Transaction records and order history</li>
                      <li>Order status and fulfillment tracking</li>
                      <li>Pricing information</li>
                      <li>Delivery addresses and schedules</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.5 Location Data</h3>
                    <p className="text-gray-700 text-justify mb-2">We collect precise or approximate location information when you:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Enable location tracking for field force employees</li>
                      <li>Access the live tracking feature</li>
                      <li>Create or execute beat plans</li>
                      <li>Record customer visit locations</li>
                      <li>Log attendance with location stamps</li>
                    </ul>
                    <p className="text-gray-700 text-justify mt-2 italic">
                      Location data helps us optimize field operations, track employee movements, ensure accountability, and provide accurate route planning.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.6 Communications Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Email communications</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2.7 Analytics and Performance Data</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Sales performance metrics</li>
                      <li>Dashboard KPIs and statistics</li>
                      <li>Custom reports and exports</li>
                      <li>Comparative analytics data</li>
                      <li>Trend analysis information</li>
                      <li>Product and inventory analytics</li>
                    </ul>
                  </div>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Section 3: How We Use Your Information */}
              <section id="use-information">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 text-justify mb-4">We use collected information for the following purposes:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>To create and manage user accounts</li>
                  <li>To authenticate users and maintain session security</li>
                  <li>To track and monitor employee field activities in real-time</li>
                  <li>To record and manage attendance data</li>
                  <li>To create, assign, and optimize beat plans and sales routes</li>
                  <li>To manage customer relationships and prospect</li>
                  <li>To process, track, and fulfill orders</li>
                  <li>To generate analytics, reports, and dashboards</li>
                  <li>To provide location-based services and tracking</li>
                  <li>To send notifications, alerts, and reminders</li>
                  <li>To provide customer support and respond to inquiries</li>
                  <li>To improve application functionality and user experience</li>
                  <li>To personalize content </li>
                  <li>To conduct performance analysis and business intelligence</li>
                  <li>To comply with legal obligations and enforce our terms</li>
                  <li>To ensure platform security and prevent misuse</li>
                  <li>To export data in various formats (PDF, Excel) for business purposes</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 4: Information Sharing */}
              <section id="sharing">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 text-justify mb-4">We may share your information with the following parties:</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Within Organization</h3>
                    <p className="text-gray-700 text-justify">We share employee data, customer information, and performance metrics:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                      <li>With managers and admins for performance monitoring</li>
                      <li>With team members as required for collaboration</li>
                      <li>Across organizational hierarchy based on role permissions</li>
                      <li>With administrators for system management and reporting</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Service Providers</h3>
                    <p className="text-gray-700 text-justify">We use third-party service providers to support our operations:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                      <li><strong>Google Maps API</strong> for interactive mapping and location services</li>
                      <li>Cloud hosting providers for application infrastructure and data storage</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Legal Requirements</h3>
                    <p className="text-gray-700 text-justify">We may disclose your information if required by law, court order, or government request, or to:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                      <li>Protect the rights and safety of SalesSphere, our users, and the public</li>
                      <li>Detect, prevent, or address fraud and security issues</li>
                      <li>Enforce our Terms of Service</li>
                      <li>Comply with regulatory and compliance obligations</li>
                    </ul>
                  </div>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Section 5: Data Security */}
              <section id="security">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 text-justify mb-4">We are committed to protecting your data and implement industry-standard security measures:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Data Encryption:</strong> All data is encrypted both in transit and at rest</li>
                  <li><strong>Regular Security Audits and Updates:</strong> Continuous monitoring and patching of security vulnerabilities</li>
                  <li><strong>Access Controls and Role-Based Permissions:</strong> Strict access control based on user roles</li>
                  <li><strong>Activity Logging and Monitoring:</strong> Comprehensive audit trails for security events</li>
                  <li><strong>Secure API Endpoints:</strong> All API communications are authenticated and authorized</li>
                </ul>
                <p className="text-gray-700 text-justify mt-4 italic">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 6: Data Retention */}
              <section id="retention">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention and Deletion</h2>
                <p className="text-gray-700 text-justify mb-4">We retain your personal information for as long as necessary to provide our services and comply with legal obligations.</p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Data Retention and Backup:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Employee and Organization Data:</strong> 30-day data retrieval and backup period</li>
                  <li><strong>Active user accounts:</strong> Retained while account is active</li>
                  <li><strong>Order and transaction data:</strong> Retained for business operations and compliance</li>
                  <li><strong>Location tracking data:</strong> Retained as needed for operational purposes</li>
                  <li><strong>Customer/Party data:</strong> Retained as long as the business relationship exists</li>
                </ul>

                <p className="text-gray-700 text-justify mt-4">
                  You may request deletion of your account and associated data by contacting us at <a href="mailto:info@salessphere.com" className="text-blue-600 hover:underline">info@salessphere.com</a>. Upon deletion request, we will remove your personal information within 30 days, except where retention is required by law or legitimate business purposes.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 7: Your Rights */}
              <section id="rights">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-700 text-justify mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Correction:</strong> Update or correct inaccurate information through your profile settings</li>
                  <li><strong>Location Control:</strong> Enable or disable location tracking at any time</li>
                </ul>
                <p className="text-gray-700 text-justify mt-4">
                  To exercise these rights, contact us at <a href="mailto:info@salessphere.com" className="text-blue-600 hover:underline font-semibold">info@salessphere.com</a> or through your organization administrator.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 8: Location Permissions */}
              <section id="location">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Location Permissions</h2>
                <p className="text-gray-700 text-justify mb-4">SalesSphere requires location access to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Track field employee real-time locations</li>
                  <li>Verify attendance check-in/check-out locations</li>
                  <li>Optimize beat plans and route planning</li>
                  <li>Record customer visit locations</li>
                  <li>Display employee locations on interactive maps</li>
                  <li>Generate location-based analytics and reports</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">You can control location permissions:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Field employees can enable/disable location sharing through app settings</li>
                  <li>Administrators can configure location tracking policies</li>
                  <li>Location data collection can be paused when not on duty</li>
                </ul>
                <p className="text-gray-700 text-justify mt-4 italic">
                  Disabling location tracking may limit certain features, particularly for field force roles.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Remaining Sections - Condensed */}
              <section id="third-party">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
                <p className="text-gray-700 text-justify">
                  Our application may contain links to third-party websites or integrate with third-party services (such as Google Maps). We are not responsible for the privacy practices of these external parties. We encourage you to review their privacy policies before providing any information.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Third-party services we use:</strong> Google Maps - Refer to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Maps Privacy Policy</a>
                </p>
              </section>

              <hr className="border-gray-200" />

              <section id="children">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-700 text-justify">
                  SalesSphere is a business-to-business (B2B) application intended for professional use by employees and authorized business users. It is not intended for users under the age of 18. We do not knowingly collect personal information from children.
                </p>
              </section>

              <hr className="border-gray-200" />

              <section id="changes">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 text-justify">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. Any changes will be posted on our website and within the application. Your continued use of SalesSphere after changes are posted constitutes acceptance of the updated policy.
                </p>
              </section>

              <hr className="border-gray-200" />



              {/* Contact Section - Enhanced */}
              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 text-justify mb-6">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">SalesSphere</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a href="mailto:info@salessphere.com" className="text-blue-600 hover:underline font-semibold">
                          info@salessphere.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <a href="tel:+917991176217" className="text-blue-600 hover:underline font-semibold">
                          +91-7991176217
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-800 font-medium">
                          BMSIT, Avallahalli, Yelahanka,<br />
                          Doddaballapura Main Road,<br />
                          Bengaluru, 560119, Karnataka, India
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    For data protection inquiries, please use the subject line "Privacy Inquiry" in your email.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 7 business days.
                  </p>
                </div>
              </section>

              <hr className="border-gray-200" />

              <section id="consent">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Consent</h2>
                <p className="text-gray-700 text-justify mb-4">
                  By accessing, registering for, and using the SalesSphere web application, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. You consent to the collection, use, processing, and disclosure of your information as described in this Privacy Policy.
                </p>
                <p className="text-gray-700 font-semibold">
                  <strong>For Employee Users:</strong> Your employer/organization has authorized your use of SalesSphere, and data collected may be shared with your organization as per the terms of their service agreement.
                </p>
              </section>

              {/* Footer Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <p className="text-center text-sm text-gray-600 italic">
                  This Privacy Policy is effective as of the "Last Updated" date and supersedes all previous versions. Please check this page periodically for updates.
                </p>
                <p className="text-center text-xs text-gray-500 mt-2">
                  © {new Date().getFullYear()} SalesSphere. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
