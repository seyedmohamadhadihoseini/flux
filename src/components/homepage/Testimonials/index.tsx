"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('home.testimonials');

  const reviews = ['review1', 'review2'];

  return (
    <section className="py-24 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('title')}
          </motion.h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl dark:shadow-none hover:shadow-2xl transition-shadow duration-300"
            >
              <Quote className="w-10 h-10 text-blue-500/20 mb-4" />
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
                "{t(`${key}.text`)}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {t(`${key}.name`).charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {t(`${key}.name`)}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t(`${key}.role`)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}