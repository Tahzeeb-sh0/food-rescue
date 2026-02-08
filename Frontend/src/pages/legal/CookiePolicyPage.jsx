import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Shield, Settings, Eye, CheckCircle, XCircle, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicyPage = () => {
  const lastUpdated = "February 8, 2024";
  const [activeTab, setActiveTab] = useState('essential');

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      icon: Shield,
      required: true,
      description: 'Necessary for the website to function properly',
      cookies: [
        { name: 'session_id', purpose: 'Maintains your login session', duration: 'Session' },
        { name: 'csrf_token', purpose: 'Security token for form submissions', duration: 'Session' },
        { name: 'cookie_consent', purpose: 'Stores your cookie preferences', duration: '1 year' }
      ]
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      icon: Settings,
      required: false,
      description: 'Enable personalized features and preferences',
      cookies: [
        { name: 'language_pref', purpose: 'Remembers your language selection', duration: '1 year' },
        { name: 'theme_mode', purpose: 'Saves dark/light mode preference', duration: '1 year' },
        { name: 'user_settings', purpose: 'Stores dashboard customizations', duration: '6 months' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      icon: Eye,
      required: false,
      description: 'Help us understand how visitors interact with our site',
      cookies: [
        { name: '_ga', purpose: 'Google Analytics - distinguishes users', duration: '2 years' },
        { name: '_gid', purpose: 'Google Analytics - identifies sessions', duration: '24 hours' },
        { name: '_gat', purpose: 'Google Analytics - throttles requests', duration: '1 minute' }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      icon: Info,
      required: false,
      description: 'Used to deliver relevant advertisements',
      cookies: [
        { name: '_fbp', purpose: 'Facebook Pixel - tracks conversions', duration: '3 months' },
        { name: 'ads_pref', purpose: 'Stores ad engagement preferences', duration: '6 months' }
      ]
    }
  ];

  const sections = [
    {
      id: "what-are-cookies",
      title: "What Are Cookies?",
      content: `Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.

Cookies help us provide you with a better experience by:
- Keeping you signed in to your account
- Remembering your preferences and settings
- Understanding how you use our platform
- Improving our services based on usage patterns

You can manage or disable cookies through your browser settings at any time. However, please note that disabling certain cookies may affect the functionality of our Services.`
    },
    {
      id: "how-we-use",
      title: "How We Use Cookies",
      content: `FoodShare uses cookies for the following purposes:

Essential Operations: To enable core functionality such as security, network management, and account access. These cookies cannot be disabled.

Performance and Analytics: To analyze how visitors interact with our platform, identify errors, and improve overall performance. This helps us understand which features are most popular and how we can enhance user experience.

Functionality: To remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.

Targeting and Marketing: To deliver relevant content and advertisements, measure ad effectiveness, and understand user engagement with our marketing campaigns. These cookies track your browsing habits across different websites.`
    },
    {
      id: "third-party",
      title: "Third-Party Cookies",
      content: `In addition to our own cookies, we may use various third-party cookies to report usage statistics, deliver advertisements, and improve our Services. These include:

Google Analytics: Helps us understand website traffic and page interactions. Google's privacy policy applies to this data.

Facebook Pixel: Enables us to measure, optimize, and build audiences for our advertising campaigns.

Auth0: Our authentication provider uses cookies to maintain secure login sessions and prevent fraudulent activity.

Stripe: Processes payment information securely when you make donations.

We do not control the use of these third-party cookies and recommend reviewing their respective privacy policies for more information.`
    },
    {
      id: "managing",
      title: "Managing Your Cookie Preferences",
      content: `You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.

Browser Settings: You can typically find cookie settings in the "Options" or "Preferences" menu of your browser. Use the "Help" feature in your browser for more details.

Our Cookie Banner: When you first visit our site, you'll see a cookie consent banner allowing you to customize your preferences.

Cookie Settings Panel: You can update your preferences at any time by clicking the "Cookie Settings" link in the footer of our website.

Please note that disabling certain cookies, particularly essential cookies, may prevent you from accessing some features of our platform or using our Services entirely.`
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content: `We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business operations. Any changes will be posted on this page with an updated "Last Updated" date.

We encourage you to review this policy periodically to stay informed about how we use cookies. Your continued use of our Services after any changes indicates your acceptance of the updated policy.

If we make significant changes to how we use cookies, we will notify you through a prominent notice on our platform or via email.`
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
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
              <p className="text-gray-500">Last Updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cookie Types Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Types of Cookies We Use</h3>
          
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {cookieTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === type.id
                    ? 'bg-[#21c45d] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.name}
                {type.required && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Required</span>
                )}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          {cookieTypes.map((type) => (
            activeTab === type.id && (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="text-left px-4 py-3 rounded-l-lg">Cookie Name</th>
                        <th className="text-left px-4 py-3">Purpose</th>
                        <th className="text-left px-4 py-3 rounded-r-lg">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {type.cookies.map((cookie, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-gray-900">{cookie.name}</td>
                          <td className="px-4 py-3 text-gray-600">{cookie.purpose}</td>
                          <td className="px-4 py-3 text-gray-500">{cookie.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )
          ))}
        </motion.div>

        {/* Policy Sections */}
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
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-[#21c45d]" />
                </div>
                {section.title}
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line pl-11">
                {section.content}
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Contact Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions About Cookies?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about our use of cookies or this policy, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:privacy@foodshare.org" 
              className="inline-flex items-center gap-2 text-[#21c45d] hover:underline font-medium"
            >
              <Info className="w-4 h-4" />
              privacy@foodshare.org
            </a>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
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

export default CookiePolicyPage;