import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Users, Truck, AlertTriangle, CheckCircle, Mail, ChevronRight, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  const lastUpdated = "February 8, 2024";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: `By accessing or using FoodShare's platform, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services.

These Terms constitute a legally binding agreement between you and FoodShare Inc. ("FoodShare," "we," "us," or "our"). By creating an account, making a donation, or otherwise using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms.

We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting the updated Terms on our platform and updating the "Last Updated" date. Your continued use of the Services after such changes constitutes acceptance of the revised Terms.`
    },
    {
      id: "eligibility",
      title: "2. Eligibility and Accounts",
      icon: Users,
      content: `To use our Services, you must:

Be at least 18 years old or the age of majority in your jurisdiction.
Have the legal capacity to enter into a binding contract.
Not be prohibited from using the Services under applicable laws.
Provide accurate, current, and complete information during registration.
Maintain the security of your account credentials.
Notify us immediately of any unauthorized access or security breach.

You may register as an individual donor, a business/organization, or a verified NGO. Each account type has specific requirements and responsibilities as outlined in our NGO Verification Policy.

You are responsible for all activities that occur under your account. FoodShare is not liable for any loss or damage arising from your failure to maintain account security.`
    },
    {
      id: "donor-obligations",
      title: "3. Donor Obligations",
      icon: Truck,
      content: `As a food donor using our platform, you agree to:

Food Safety: Only donate food that is safe for consumption, properly stored, and within its expiration date or safe consumption period.
Accurate Representation: Provide truthful and accurate descriptions of donated food items, including quantity, type, dietary information, and condition.
Timely Availability: Ensure food is available for pickup during the specified time window and maintain communication with recipient NGOs.
Proper Packaging: Package food appropriately to maintain safety and quality during transport.
Compliance: Adhere to all applicable food safety laws, regulations, and guidelines in your jurisdiction.
No Harmful Items: Never donate food that is contaminated, spoiled, or otherwise unsafe for human consumption.

FoodShare reserves the right to suspend or terminate accounts of donors who repeatedly violate food safety standards or provide misleading information.`
    },
    {
      id: "ngo-obligations",
      title: "4. NGO and Recipient Obligations",
      icon: Users,
      content: `Verified NGOs and recipient organizations agree to:

Verification: Maintain current and accurate organizational information, including tax-exempt status where applicable.
Prompt Pickup: Collect donated food within the agreed-upon time window or communicate promptly if delays occur.
Food Handling: Follow proper food safety protocols during collection, transport, and distribution.
Respectful Conduct: Interact professionally and respectfully with donors and FoodShare staff.
Reporting: Provide accurate reporting on food distribution and impact metrics as requested.
Legal Compliance: Operate in compliance with all applicable laws regarding food recovery and charitable distribution.
Insurance: Maintain appropriate liability insurance coverage for food handling and distribution activities.

Failure to meet these obligations may result in suspension or removal from the platform.`
    },
    {
      id: "food-safety",
      title: "5. Food Safety and Liability",
      icon: AlertTriangle,
      content: `Food Safety Disclaimer: FoodShare facilitates connections between donors and recipients but does not handle, inspect, or take possession of food items. We are not responsible for the quality, safety, or legality of donated food.

Donor Warranty: Donors represent and warrant that donated food is safe for consumption and has been handled, stored, and prepared in accordance with applicable food safety laws.

Recipient Acknowledgment: Recipients acknowledge that they are responsible for inspecting food upon receipt and determining its suitability for distribution.

Limitation of Liability: To the maximum extent permitted by law, FoodShare shall not be liable for any claims, damages, or losses arising from food donations facilitated through our platform, including but not limited to foodborne illness, allergic reactions, or other health issues.

Indemnification: You agree to indemnify and hold harmless FoodShare, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Services or violation of these Terms.`
    },
    {
      id: "prohibited",
      title: "6. Prohibited Activities",
      icon: Gavel,
      content: `You may not use our Services to:

Donate or distribute food that is unsafe, contaminated, or unfit for human consumption.
Engage in fraudulent, deceptive, or misleading practices.
Harass, abuse, or discriminate against other users.
Violate any applicable laws, regulations, or third-party rights.
Interfere with or disrupt the operation of our platform.
Attempt to gain unauthorized access to our systems or other users' accounts.
Use automated means (bots, scrapers) to access or collect data from our platform.
Resell or commercially exploit food received through our platform without authorization.
Post or transmit any content that is defamatory, obscene, or otherwise objectionable.

Violations may result in immediate account suspension, termination, and potential legal action.`
    },
    {
      id: "intellectual",
      title: "7. Intellectual Property",
      icon: FileText,
      content: `All content on the FoodShare platform, including text, graphics, logos, images, software, and trademarks, is the property of FoodShare or its licensors and is protected by intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to access and use the Services for their intended purpose. This license does not permit:

Modifying, copying, or creating derivative works based on our platform.
Using any content for commercial purposes without authorization.
Attempting to decompile or reverse engineer any software.
Removing any copyright or proprietary notices.

User-generated content (photos, descriptions) remains your property, but you grant FoodShare a worldwide, royalty-free license to use, display, and distribute such content in connection with our Services.`
    },
    {
      id: "termination",
      title: "8. Termination",
      icon: Scale,
      content: `You may terminate your account at any time by contacting us or using the account deletion feature in your settings.

We may suspend or terminate your account, with or without notice, for:

Violation of these Terms or any applicable laws.
Fraudulent or abusive behavior.
Extended periods of inactivity.
Requests by law enforcement or government agencies.
Technical or security issues.

Upon termination:

Your right to use the Services immediately ceases.
You remain liable for any outstanding obligations.
We may retain certain information as required by law or for legitimate business purposes.
Provisions regarding liability, indemnification, and intellectual property survive termination.`
    },
    {
      id: "dispute",
      title: "9. Dispute Resolution",
      icon: Scale,
      content: `Governing Law: These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to conflict of law principles.

Informal Resolution: We encourage users to contact us directly to resolve any disputes informally before pursuing formal legal action.

Arbitration: Any dispute arising from these Terms or your use of the Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Arbitration shall be conducted in [City, State].

Class Action Waiver: You agree that any proceedings will be conducted only on an individual basis and not as a class action or representative action.

Exceptions: Nothing in this section shall prevent either party from seeking injunctive relief in a court of competent jurisdiction.`
    },
    {
      id: "contact",
      title: "10. Contact Information",
      icon: Mail,
      content: `If you have any questions about these Terms, please contact us:

Email: legal@foodshare.org
Address: 123 Green Street, Eco City, EC 12345
Phone: +1 (234) 567-890

We aim to respond to all inquiries within 2 business days.`
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
              <Scale className="w-6 h-6 text-[#21c45d]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
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

        {/* Agreement Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 bg-[#21c45d]/10 border border-[#21c45d]/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-[#21c45d] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Agreement</h3>
              <p className="text-gray-600 text-sm">
                By using FoodShare's Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
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

export default TermsOfServicePage;