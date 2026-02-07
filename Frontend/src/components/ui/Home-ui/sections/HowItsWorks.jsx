import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Bell, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: 'List Surplus',
      description: 'Snap a photo and upload details of your excess food, dietary types, and collection window in seconds.',
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Bell,
      title: 'Instant Alert',
      description: 'Verified NGOs within a 10km radius receive a notification to claim the donation immediately.',
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Truck,
      title: 'Safe Rescue',
      description: 'NGO partners collect the food using food-safe transport and distribute it to local community centers.',
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
  ];

  const stats = [
    { value: '542K+', label: 'MEALS SERVED' },
    { value: '120+', label: 'NGO PARTNERS' },
    { value: '15K', label: 'KG FOOD SAVED' },
    { value: '8.2T', label: 'CO2 PREVENTED' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our streamlined process ensures that food reaches those who need it most, safely and efficiently.
          </p>
        </motion.div>

        {/* Steps Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}
              >
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[#21c45d] rounded-3xl px-8 py-12 md:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statVariants}
                custom={index}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.6 + index * 0.1, 
                    type: "spring", 
                    stiffness: 150 
                  }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-green-100 text-xs font-semibold tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;