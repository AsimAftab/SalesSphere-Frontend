import React from 'react';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

const AboutUsPage: React.FC = () => {
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">About SalesSphere</h1>
          <p className="text-lg text-gray-600">Transforming Field Sales, One Team at a Time</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: November 24, 2025</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
              <nav className="space-y-2">
                {[
                  { id: 'hero', title: 'Who We Are' },
                  { id: 'mission', title: 'Our Mission' },
                  { id: 'what-we-do', title: 'What We Do' },
                  { id: 'who-we-serve', title: 'Who We Serve' },
                  { id: 'our-values', title: 'Our Values' },
                  { id: 'why-salessphere', title: 'Why SalesSphere' },
                  { id: 'our-impact', title: 'Our Impact' },
                  { id: 'contact-us', title: 'Contact Us' },
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

              {/* Hero Section */}
              <section id="hero">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Transforming Field Sales, One Team at a Time</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  SalesSphere was born from a simple observation: field sales teams are the backbone of countless businesses, yet they're often equipped with outdated tools and disconnected systems. We set out to change that.
                </p>
                <p className="text-gray-700 leading-relaxed text-justify mt-4">
                  Founded in 2025, SalesSphere has grown from a vision to revolutionize field sales operations into a comprehensive platform trusted by businesses across industries. We believe that every sales representative in the field deserves the same powerful tools and insights that headquarters enjoys.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Mission Section */}
              <section id="mission">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  To empower field sales teams with intelligent, intuitive technology that transforms how businesses operate outside the office—driving growth, transparency, and success in every interaction.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* What We Do Section */}
              <section id="what-we-do">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
                <p className="text-gray-700 text-justify mb-4">
                  SalesSphere is the all-in-one field sales management platform that brings together everything your sales team needs to succeed:
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">For Field Teams:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Real-time GPS tracking and route optimization</li>
                  <li>Mobile order creation and management</li>
                  <li>Automated attendance with GPS verification</li>
                  <li>Instant access to product catalogs and pricing</li>
                  <li>Offline functionality for seamless work</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">For Management:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Comprehensive analytics and performance dashboards</li>
                  <li>Territory visibility and revenue trend analysis</li>
                  <li>Stock management and inventory reconciliation</li>
                  <li>Role-based access control</li>
                  <li>Data-driven insights for strategic decisions</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">For Organizations:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Seamless integration with existing systems</li>
                  <li>Scalable infrastructure that grows with you</li>
                  <li>Enterprise-grade security and compliance</li>
                  <li>AI-powered insights and automation</li>
                  <li>Dedicated support and training</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Who We Serve Section */}
              <section id="who-we-serve">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Serve</h2>
                <p className="text-gray-700 text-justify mb-4">
                  From emerging startups to established enterprises, SalesSphere powers field sales operations across diverse industries:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Pharmaceuticals:</strong> Ensure compliance, track field visits, and manage sample distribution.</li>
                  <li><strong>Manufacturing:</strong> Connect factory to field with real-time stock updates and order processing.</li>
                  <li><strong>Retail & Consumer Goods:</strong> Optimize territory coverage and merchandising activities.</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Our Values Section */}
              <section id="our-values">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Innovation First:</strong> We continuously evolve our platform with cutting-edge technology to stay ahead of market needs.</li>
                  <li><strong>Customer Success:</strong> Your growth is our success. We're committed to delivering measurable results and ROI.</li>
                  <li><strong>Transparency:</strong> From pricing to data analytics, we believe in complete visibility and honest communication.</li>
                  <li><strong>Simplicity:</strong> Powerful doesn't mean complicated. We design intuitive solutions that teams actually want to use.</li>
                  <li><strong>Reliability:</strong> Your business can't afford downtime. We ensure 99.9% uptime with enterprise-grade infrastructure.</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Why SalesSphere Section */}
              <section id="why-salessphere">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why SalesSphere?</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Purpose-Built for Field Sales:</strong> Unlike generic CRM systems, SalesSphere is specifically engineered for the unique challenges of field operations.</li>
                  <li><strong>Data-Driven Decisions:</strong> Turn field data into actionable insights with our intuitive analytics dashboard and AI-powered recommendations.</li>
                  <li><strong>Quick Deployment:</strong> Get your team up and running in days, not months, with our streamlined onboarding process.</li>
                  <li><strong>Mobile-First Design:</strong> Built for the field, optimized for mobile, with offline capabilities that keep your team productive anywhere.</li>
                  <li><strong>Enterprise Security:</strong> Bank-level encryption, role-based access, and compliance with international data protection standards.</li>
                  <li><strong>Dedicated Support:</strong> Our customer success team is with you every step of the way, from implementation to optimization.</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Our Impact Section */}
              <section id="our-impact">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Impact</h2>
                <p className="text-gray-700 text-justify mb-4">
                  Since our inception, SalesSphere has helped businesses achieve:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>40% improvement</strong> in field sales productivity</li>
                  <li><strong>35% reduction</strong> in operational costs</li>
                  <li><strong>50% faster</strong> order-to-delivery cycles</li>
                  <li><strong>99.9% system uptime</strong> for uninterrupted operations</li>
                  <li><strong>Thousands of field representatives</strong> empowered daily</li>
                </ul>
              </section>

              <hr className="border-gray-200" />

              {/* Looking Forward Section */}
              <section id="looking-forward">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking Forward</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  The future of field sales is intelligent, connected, and data-driven. At SalesSphere, we're not just keeping pace with this future—we're building it.
                </p>
                <p className="text-gray-700 leading-relaxed text-justify mt-4">
                  Our roadmap includes advanced AI capabilities, predictive analytics, IoT integrations, and deeper automation to make field sales operations even more efficient and effective.
                </p>
              </section>

              <hr className="border-gray-200" />

              {/* Contact Section */}
              <section id="contact-us">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 text-justify mb-6">
                  Have questions? Want to learn more? Our team is here to help.
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

              {/* Footer */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <p className="text-center text-xs text-gray-500">
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

export default AboutUsPage;
