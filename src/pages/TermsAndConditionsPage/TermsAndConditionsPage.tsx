import React from 'react';
import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Terms and Conditions</h1>
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
                  { id: 'acceptance', title: '1. Acceptance' },
                  { id: 'definitions', title: '2. Definitions' },
                  { id: 'service', title: '3. Service Description' },
                  { id: 'account', title: '4. Account Registration' },
                  { id: 'responsibilities', title: '5. User Responsibilities' },
                  { id: 'subscription', title: '6. Subscription & Payment' },
                  { id: 'intellectual', title: '7. Intellectual Property' },
                  { id: 'license', title: '8. License & Restrictions' },
                  { id: 'privacy', title: '9. Data Privacy' },
                  { id: 'third-party', title: '10. Third-Party Services' },
                  { id: 'termination', title: '11. Termination' },
                  { id: 'warranties', title: '12. Warranties' },
                  { id: 'liability', title: '13. Limitation of Liability' },
                  { id: 'modifications', title: '14. Modifications' },
                  { id: 'contact', title: '15. Contact Information' },
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

              {/* Section 1: Acceptance */}
              <section id="acceptance">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction and Acceptance</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Welcome to SalesSphere ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the SalesSphere platform, including our web application, mobile applications, and related services (collectively, the "Service").
                </p>
                <p className="text-gray-700 leading-relaxed text-justify mt-4">
                  By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
                </p>
                <p className="text-gray-700 leading-relaxed text-justify mt-4">
                  <strong>Important:</strong> These Terms constitute a legally binding agreement between you and SalesSphere.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 2: Definitions */}
              <section id="definitions">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <p className="text-gray-700 text-justify mb-4">For purposes of these Terms, the following definitions apply:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>"Service":</strong> The SalesSphere platform including website, mobile applications, web application, and all related tools and features</li>
                  <li><strong>"User," "You," or "Your":</strong> The individual or organization using the Service</li>
                  <li><strong>"Account":</strong> Your registered account on the SalesSphere platform</li>
                  <li><strong>"Content":</strong> Any data, information, text, images, or other materials you upload, submit, or transmit through the Service</li>
                  <li><strong>"Organization":</strong> The company or entity that has subscribed to the Service</li>
                  <li><strong>"Employee User":</strong> Individual users authorized by an Organization to use the Service</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 3: Service Description */}
              <section id="service">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Service Description</h2>
                <p className="text-gray-700 text-justify mb-4">SalesSphere is a comprehensive field force automation and sales management platform that provides:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Real-time GPS tracking and employee location monitoring</li>
                  <li>Attendance management and tracking</li>
                  <li>Order management and processing</li>
                  <li>Customer (Party) and prospect management</li>
                  <li>Beat planning and route optimization</li>
                  <li>Analytics and reporting dashboards</li>
                  <li>Product and inventory management</li>
                  <li>Multi-site and multi-user support</li>
                  <li>Role-based access control</li>
                </ul>
                <p className="text-gray-700 text-justify mt-4">
                  We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. We will make reasonable efforts to notify you of significant changes.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 4: Account Registration */}
              <section id="account">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Account Registration and Eligibility</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Eligibility Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>You must be at least 18 years of age to use the Service</li>
                  <li>You must have the legal authority to enter into this agreement</li>
                  <li>If registering on behalf of an organization, you must be authorized to bind that organization to these Terms</li>
                  <li>The Service is intended for business and professional use only</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Security</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>You must provide accurate, current, and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized access to your account</li>
                  <li>Sharing account credentials with unauthorized users is strictly prohibited</li>
                  <li>You are responsible for all activities that occur under your account</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 5: User Responsibilities */}
              <section id="responsibilities">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Responsibilities and Acceptable Use</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">You Agree To:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Use the Service in compliance with all applicable laws and regulations</li>
                  <li>Respect the intellectual property rights of SalesSphere and others</li>
                  <li>Maintain the security and accuracy of your account information</li>
                  <li>Obtain necessary consents from employees for GPS tracking and data collection</li>
                  <li>Use the Service only for its intended business purposes</li>
                  <li>Comply with all labor laws and employee privacy regulations in your jurisdiction</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">You Agree NOT To:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the intellectual property rights of others</li>
                  <li>Upload or transmit malicious software, viruses, or harmful code</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                  <li>Use the Service to spam, harass, or harm others</li>
                  <li>Resell, sublicense, or distribute the Service without authorization</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without permission</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 6: Subscription and Payment */}
              <section id="subscription">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription and Payment Terms</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscription Plans</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Various subscription tiers are available based on features and user count</li>
                  <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                  <li>You can schedule a demo to understand the Service features before subscribing</li>
                  <li>Custom enterprise plans are available upon request</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Payment authorization is required before billing commences</li>
                  <li>All fees are stated in Indian Rupees (INR) unless otherwise specified</li>
                  <li>Fees are non-refundable except as required by applicable law</li>
                  <li>We reserve the right to change pricing with 30 days' advance notice</li>
                  <li>Failure to pay may result in service suspension or termination</li>
                  <li>Applicable taxes (GST, etc.) will be added to subscription fees</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 7: Intellectual Property */}
              <section id="intellectual">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Intellectual Property</h3>
                <p className="text-gray-700 text-justify mb-4">
                  All components of the Service, including but not limited to software, designs, text, graphics, logos, icons, images, audio clips, and data compilations, are the property of SalesSphere or its licensors, and are protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Content</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>You retain ownership of all content you upload to the Service</li>
                  <li>You grant us a limited license to use, store, and process your content solely for providing the Service</li>
                  <li>You represent that you have all necessary rights to the content you upload</li>
                  <li>You are responsible for ensuring your content does not violate any laws or third-party rights</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback and Suggestions</h3>
                <p className="text-gray-700 text-justify">
                  Any feedback, suggestions, or ideas you provide to us regarding the Service become our property, and we may use them without any obligation to you.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 8: License */}
              <section id="license">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. License and Restrictions</h2>
                <p className="text-gray-700 text-justify mb-4">
                  Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business purposes.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">License Restrictions</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>You may not copy, modify, or create derivative works of the Service</li>
                  <li>You may not reverse engineer or attempt to extract source code</li>
                  <li>You may not lease, sell, or sublicense the Service</li>
                  <li>You may not use the Service to develop competing products or services</li>
                  <li>You may not remove or modify any proprietary notices</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 9: Data Privacy */}
              <section id="privacy">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Privacy and Security</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Our collection and use of personal data is governed by our Privacy Policy</li>
                  <li>You are responsible for obtaining necessary consents from your employees for data collection, including GPS tracking</li>
                  <li>You must comply with all applicable data protection laws, including the Information Technology Act, 2000 (India)</li>
                  <li>We implement industry-standard security measures to protect your data</li>
                  <li>Upon account termination, data export will be available for 30 days</li>
                  <li>After the 30-day period, data may be permanently deleted</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 10: Third-Party Services */}
              <section id="third-party">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Services and Integrations</h2>
                <p className="text-gray-700 text-justify mb-4">
                  The Service may integrate with or contain links to third-party services, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Google Maps for location services</li>
                  <li>Cloud hosting providers</li>
                  <li>Other business tools and platforms</li>
                </ul>
                <p className="text-gray-700 text-justify mt-4">
                  We are not responsible for the terms, privacy practices, or content of third-party services. Your use of third-party services is at your own risk and subject to their terms and conditions.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 11: Termination */}
              <section id="termination">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Termination by You</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation is effective at the end of your current billing period</li>
                  <li>No refunds for partial billing periods unless required by law</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Termination by Us</h3>
                <p className="text-gray-700 text-justify mb-2">We may suspend or terminate your access to the Service:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>For violation of these Terms</li>
                  <li>For non-payment of fees</li>
                  <li>For security risks or threats to the Service</li>
                  <li>If required by law or legal process</li>
                  <li>If we cease offering the Service</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Effect of Termination</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>All rights and licenses granted to you will immediately cease</li>
                  <li>You must cease all use of the Service</li>
                  <li>Your data will be available for export for 30 days</li>
                  <li>After 30 days, your data may be permanently deleted</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 12: Warranties and Disclaimers */}
              <section id="warranties">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Warranties and Disclaimers</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Availability</h3>
                <p className="text-gray-700 text-justify mb-4">
                  While we strive to maintain high service availability, we do not guarantee uninterrupted or error-free operation of the Service. Scheduled maintenance and unforeseen issues may cause temporary disruptions.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Disclaimer</h3>
                <p className="text-gray-700 text-justify mb-2">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Warranties of merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Accuracy or reliability of data or information</li>
                  <li>Security or freedom from viruses or harmful components</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 13: Limitation of Liability */}
              <section id="liability">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Limitation of Liability</h2>
                <p className="text-gray-700 text-justify mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>This includes damages for loss of profits, revenue, data, or business opportunities</li>
                  <li>Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                  <li>Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Section 14: Modifications */}
              <section id="modifications">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Modifications to Terms</h2>
                <p className="text-gray-700 text-justify mb-4">
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Posting the updated Terms on our website</li>
                  <li>Updating the "Last Updated" date</li>
                  <li>Sending email notification to registered users (for significant changes)</li>
                </ul>
                <p className="text-gray-700 text-justify mt-4">
                  Your continued use of the Service after changes are posted constitutes acceptance of the modified Terms. If you do not agree to the modifications, you must stop using the Service.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Section 15: Contact Information */}
              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                <p className="text-gray-700 text-justify mb-6">
                  If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us:
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
                </div>
              </section>

              {/* Acceptance Statement */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <p className="text-center text-gray-700 font-semibold mb-2">
                  Acceptance of Terms
                </p>
                <p className="text-center text-sm text-gray-600 italic">
                  By using SalesSphere, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
                <p className="text-center text-xs text-gray-500 mt-4">
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

export default TermsAndConditionsPage;
