import React, { useState, useEffect, useRef } from 'react';
import AboutUsIndex from './AboutUsIndex';

const AboutUsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: [0, 0.5, 1],
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  return (
    <div className="bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <AboutUsIndex activeSection={activeSection} />
          </div>
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">About SalesSphere</h1>
            <div className="prose prose-lg text-gray-700 mx-auto">
              <p className="text-sm text-gray-500 text-center mb-8">Last updated: November 17, 2025</p>

              {/* Hero Section */}
              <h2 id="hero" ref={(el) => (sectionRefs.current[0] = el)} className="text-2xl font-bold mt-8 mb-4">Transforming Field Sales, One Team at a Time</h2>
              <p>
                SalesSphere was born from a simple observation: field sales teams are the backbone of countless businesses, yet they're often equipped with outdated tools and disconnected systems. We set out to change that.
              </p>
              <p>
                Founded in 2025, SalesSphere has grown from a vision to revolutionize field sales operations into a comprehensive platform trusted by businesses across industries. We believe that every sales representative in the field deserves the same powerful tools and insights that headquarters enjoys.
              </p>

              {/* Mission Section */}
              <h2 id="mission" ref={(el) => (sectionRefs.current[1] = el)} className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
              <p>
                To empower field sales teams with intelligent, intuitive technology that transforms how businesses operate outside the office—driving growth, transparency, and success in every interaction.
              </p>

              {/* What We Do Section */}
              <h2 id="what-we-do" ref={(el) => (sectionRefs.current[2] = el)} className="text-2xl font-bold mt-8 mb-4">What We Do</h2>
              <p>
                SalesSphere is the all-in-one field sales management platform that brings together everything your sales team needs to succeed:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">For Field Teams:</h3>
              <ul className="list-disc pl-6">
                <li>Real-time GPS tracking and route optimization</li>
                <li>Mobile order creation and management</li>
                <li>Automated attendance with GPS verification</li>
                <li>Instant access to product catalogs and pricing</li>
                <li>Offline functionality for seamless work</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">For Management:</h3>
              <ul className="list-disc pl-6">
                <li>Comprehensive analytics and performance dashboards</li>
                <li>Territory visibility and revenue trend analysis</li>
                <li>Stock management and inventory reconciliation</li>
                <li>Role-based access control</li>
                <li>Data-driven insights for strategic decisions</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">For Organizations:</h3>
              <ul className="list-disc pl-6">
                <li>Seamless integration with existing systems</li>
                <li>Scalable infrastructure that grows with you</li>
                <li>Enterprise-grade security and compliance</li>
                <li>AI-powered insights and automation</li>
                <li>Dedicated support and training</li>
              </ul>

              {/* Who We Serve Section */}
              <h2 id="who-we-serve" ref={(el) => (sectionRefs.current[3] = el)} className="text-2xl font-bold mt-8 mb-4">Who We Serve</h2>
              <p>
                From emerging startups to established enterprises, SalesSphere powers field sales operations across diverse industries:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>Pharmaceuticals:</strong> Ensure compliance, track field visits, and manage sample distribution.</li>
                <li><strong>Manufacturing:</strong> Connect factory to field with real-time stock updates and order processing.</li>
                <li><strong>Retail & Consumer Goods:</strong> Optimize territory coverage and merchandising activities.</li>
              </ul>

              {/* Our Values Section */}
              <h2 id="our-values" ref={(el) => (sectionRefs.current[4] = el)} className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
              <ul className="list-disc pl-6">
                <li><strong>Innovation First:</strong> We continuously evolve our platform with cutting-edge technology to stay ahead of market needs.</li>
                <li><strong>Customer Success:</strong> Your growth is our success. We're committed to delivering measurable results and ROI.</li>
                <li><strong>Transparency:</strong> From pricing to data analytics, we believe in complete visibility and honest communication.</li>
                <li><strong>Simplicity:</strong> Powerful doesn't mean complicated. We design intuitive solutions that teams actually want to use.</li>
                <li><strong>Reliability:</strong> Your business can't afford downtime. We ensure 99.9% uptime with enterprise-grade infrastructure.</li>
              </ul>

              {/* Why SalesSphere Section */}
              <h2 id="why-salessphere" ref={(el) => (sectionRefs.current[5] = el)} className="text-2xl font-bold mt-8 mb-4">Why SalesSphere?</h2>
              <ul className="list-disc pl-6">
                <li><strong>Purpose-Built for Field Sales:</strong> Unlike generic CRM systems, SalesSphere is specifically engineered for the unique challenges of field operations.</li>
                <li><strong>Data-Driven Decisions:</strong> Turn field data into actionable insights with our intuitive analytics dashboard and AI-powered recommendations.</li>
                <li><strong>Quick Deployment:</strong> Get your team up and running in days, not months, with our streamlined onboarding process.</li>
                <li><strong>Mobile-First Design:</strong> Built for the field, optimized for mobile, with offline capabilities that keep your team productive anywhere.</li>
                <li><strong>Enterprise Security:</strong> Bank-level encryption, role-based access, and compliance with international data protection standards.</li>
                <li><strong>Dedicated Support:</strong> Our customer success team is with you every step of the way, from implementation to optimization.</li>
              </ul>

              {/* Our Impact Section */}
              <h2 id="our-impact" ref={(el) => (sectionRefs.current[6] = el)} className="text-2xl font-bold mt-8 mb-4">Our Impact</h2>
              <p>
                Since our inception, SalesSphere has helped businesses achieve:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>40% improvement</strong> in field sales productivity</li>
                <li><strong>35% reduction</strong> in operational costs</li>
                <li><strong>50% faster</strong> order-to-delivery cycles</li>
                <li><strong>99.9% system uptime</strong> for uninterrupted operations</li>
                <li><strong>Thousands of field representatives</strong> empowered daily</li>
              </ul>

              {/* Looking Forward Section */}
              <h2 id="looking-forward" ref={(el) => (sectionRefs.current[7] = el)} className="text-2xl font-bold mt-8 mb-4">Looking Forward</h2>
              <p>
                The future of field sales is intelligent, connected, and data-driven. At SalesSphere, we're not just keeping pace with this future—we're building it.
              </p>
              <p>
                Our roadmap includes advanced AI capabilities, predictive analytics, IoT integrations, and deeper automation to make field sales operations even more efficient and effective.
              </p>

              {/* Contact Section */}
              <h2 id="contact-us" ref={(el) => (sectionRefs.current[8] = el)} className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
              <p>
                Have questions? Want to learn more? Our team is here to help.
              </p>
              <ul className="list-disc pl-6">
                <li>Email: <a href="mailto:info@salessphere360.com" className="text-blue-600 hover:underline">info@salessphere360.com</a></li>
                <li>Website: <a href="https://www.salessphere360.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.salessphere360.com</a></li>
              </ul>

              <p className="mt-8 text-center text-sm text-gray-500">
                &copy; 2025 SalesSphere. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
