import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const HeroImageCompoent = () => {
  const floatVariants = {
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      {/* Main Image Container with White Border */}
      <div className="relative p-3 bg-white rounded-[2rem] shadow-lg shadow-gray-400">
        <div className="relative rounded-[1.5rem] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3]"
          >
            <img 
              src="/Images/Home-Page-Images/cardImage.jpg" 
              alt="Chef preparing rescued meals" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Floating Stats Card - Positioned to overlap bottom-left */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg shadow-gray-200/80 px-5 py-4 z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#21c45d]" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#21c45d]">
                12.4k
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Meals Rescued Today
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroImageCompoent;