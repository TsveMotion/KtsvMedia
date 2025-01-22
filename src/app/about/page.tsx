'use client';

import { motion } from 'framer-motion';

const team = [
  {
    name: 'Digital Excellence',
    role: 'Our Mission',
    description: 'We strive to deliver exceptional digital solutions that empower businesses to thrive in the modern digital landscape.',
    image: '/team/digital-excellence.jpg'
  },
  {
    name: 'Innovation',
    role: 'Our Approach',
    description: 'We embrace cutting-edge technologies and creative strategies to solve complex challenges and drive results.',
    image: '/team/innovation.jpg'
  },
  {
    name: 'Client Success',
    role: 'Our Focus',
    description: 'Your success is our priority. We work closely with you to understand your goals and deliver solutions that exceed expectations.',
    image: '/team/client-success.jpg'
  }
];

const values = [
  {
    title: 'Innovation',
    description: 'Constantly pushing boundaries and embracing new technologies.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Quality',
    description: 'Delivering excellence in every project we undertake.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Collaboration',
    description: 'Working together to achieve remarkable results.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Integrity',
    description: 'Building trust through honesty and transparency.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              About KtsvMedia
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              We are a team of digital innovators passionate about creating impactful solutions
              that drive business growth and success.
            </p>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Our Values
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative group"
                >
                  <div className="h-full relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-100 transition-colors duration-200">
                        {value.icon}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              What Drives Us
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="space-y-4">
                    <div className="aspect-w-3 aspect-h-2">
                      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3 className="text-gray-900">{member.name}</h3>
                        <p className="text-blue-600">{member.role}</p>
                      </div>
                      <div className="text-gray-600">
                        <p>{member.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Ready to Work Together?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Let&apos;s create something amazing together!
            </p>
            <div className="mt-8">
              <a
                href="/schedule"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Schedule a Call
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
