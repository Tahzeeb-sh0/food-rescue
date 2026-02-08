import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const lastUpdated = "February 8, 2024";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: FileText,
      content: `FoodShare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food rescue platform and services.

This policy applies to information we collect through our website, mobile applications, and other online services (collectively, the "Services"). By accessing or using our Services, you agree to this Privacy Policy.`
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      icon: Eye,
      content: `We collect several types of information from and about users of our Services:

Personal Information: Name, email address, phone number, postal address, and profile information when you register for an account.

Donation Data: Information about food donations including photos, descriptions, quantities, dietary information, and pickup locations.

Usage Data: Information about how you access and use our Services, including IP address, browser type, device information, pages visited, and time spent.

Location Data: With your consent, we collect precise geolocation data to match donors with nearby NGOs and optimize pickup routes.

Communications: Records of your communications with us, including emails, chat messages, and customer support inquiries.`
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      icon: Shield,
      content: `We use the information we collect to:

Provide and maintain our Services, including matching food donors with recipient organizations.
Process and facilitate food donations and pickups.
Communicate with you about your account, donations, and platform updates.
Improve and personalize your experience on our platform.
Ensure safety and security, including verifying NGO credentials and preventing fraud.
Comply with legal obligations and enforce our terms of service.
Send promotional communications (with your consent, which you may withdraw at any time).
Analyze usage patterns to improve our Services and develop new features.`
    },
    {
      id: "information-sharing",
      title: "4. Information Sharing and Disclosure",
      icon: ChevronRight,
      content: `We may share your information in the following circumstances:

With NGOs: When you make a donation, we share relevant details (food type, quantity, pickup location) with verified recipient organizations.

Service Providers: We engage third-party vendors to perform functions on our behalf (payment processing, hosting, analytics, customer support).

Legal Requirements: We may disclose information if required by law, regulation, legal process, or governmental request.

Business Transfers: In connection with a merger, acquisition, or sale of assets, your information may be transferred as a business asset.

With Your Consent: We may share information with third parties when you explicitly authorize us to do so.

We do not sell your personal information to third parties for marketing purposes.`
    },
    {
      id: "data-security",
      title: "5. Data Security",
      icon: Lock,
      content: `We implement appropriate technical and organizational measures to protect your personal information:

Encryption: All data transmitted between your device and our servers is encrypted using SSL/TLS technology.
Access Controls: Strict access controls limit who can access personal information within our organization.
Regular Audits: We conduct regular security assessments and vulnerability testing.
Data Minimization: We collect only the information necessary to provide our Services.
Employee Training: Our staff receives regular training on data protection and privacy practices.

While we strive to use commercially acceptable means to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`
    },
    {
      id: "your-rights",
      title: "6. Your Privacy Rights",
      icon: Eye,
      content: `Depending on your location, you may have the following rights regarding your personal information:

Access: Request a copy of the personal information we hold about you.
Correction: Request that we correct inaccurate or incomplete information.
Deletion: Request deletion of your personal information, subject to certain legal exceptions.
Portability: Request a copy of your data in a structured, machine-readable format.
Restriction: Request that we limit the processing of your information.
Objection: Object to processing based on legitimate interests or direct marketing.
Withdraw Consent: Withdraw consent where processing is based on consent.

To exercise these rights, please contact us using the information provided below.`
    },
    {
      id: "cookies",
      title: "7. Cookies and Tracking Technologies",
      icon: FileText,
      content: `We use cookies and similar tracking technologies to enhance your experience:

Essential Cookies: Required for the operation of our Services (e.g., authentication, security).
Functionality Cookies: Enable personalized features and remember your preferences.
Analytics Cookies: Help us understand how visitors interact with our Services.
Marketing Cookies: Used to deliver relevant advertisements (with your consent).

You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our Services.`
    },
    {
      id: "children",
      title: "8. Children's Privacy",
      icon: Shield,
      content: `Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover that a child under 13 has provided us with personal information, we will promptly delete such information from our systems.`
    },
    {
      id: "international",
      title: "9. International Data Transfers",
      icon: ChevronRight,
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from those in your jurisdiction. We ensure appropriate safeguards are in place to protect your information when transferred internationally, including standard contractual clauses approved by relevant authorities.`
    },
    {
      id: "changes",
      title: "10. Changes to This Policy",
      icon: FileText,
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically. Your continued use of our Services after any changes constitutes acceptance of the updated policy.`
    },
    {
      id: "contact",
      title: "11. Contact Us",
      icon: Mail,
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Email: privacy@foodshare.org
Address: 123 Green Street, Eco City, EC 12345
Phone: +1 (234) 567-890
Data Protection Officer: dpo@foodshare.org

We will respond to your inquiry within 30 days.`
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#21c45d]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500">Last Updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 text-gray-600 hover:text-[#21c45d] transition-colors text-sm"
              >
                <ChevronRight className="w-4 h-4" />
                {section.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {sections.map((section) => (
            <motion.section
              key={section.id}
              id={section.id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 scroll-mt-24"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-[#21c45d]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 pt-2">
                  {section.title}
                </h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line pl-14">
                {section.content}
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#21c45d] hover:underline font-medium"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;