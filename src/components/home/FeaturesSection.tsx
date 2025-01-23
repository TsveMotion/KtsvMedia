import { motion } from 'framer-motion';
import { CalendarDaysIcon, PhoneIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Expert Consultation',
    description: 'Get personalized strategies from our experienced advertising professionals tailored to your business needs.',
    icon: UserGroupIcon,
  },
  {
    name: 'Phone Consultation',
    description: 'Speak directly with our experts from anywhere in the world at a time that suits you best.',
    icon: PhoneIcon,
  },
  {
    name: 'Data-Driven Insights',
    description: 'Receive actionable insights backed by real market data and proven advertising strategies.',
    icon: ChartBarIcon,
  },
  {
    name: 'Flexible Scheduling',
    description: 'Book appointments at your convenience with our easy-to-use scheduling system.',
    icon: CalendarDaysIcon,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-indigo-600"
          >
            Grow Faster
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Everything you need to scale your business
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Our comprehensive advertising solutions are designed to help you reach your target audience and achieve measurable results.
          </motion.p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute -inset-4 rounded-lg bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600"
                    >
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </motion.div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
