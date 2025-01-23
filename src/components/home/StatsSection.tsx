import { motion } from 'framer-motion';

const stats = [
  { id: 1, name: 'Happy Clients', value: '500+' },
  { id: 2, name: 'ROI Increase', value: '300%' },
  { id: 3, name: 'Success Rate', value: '95%' },
  { id: 4, name: 'Markets Served', value: '20+' },
];

export default function StatsSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-white"
        />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl lg:max-w-none"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Trusted by businesses worldwide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg leading-8 text-gray-600"
            >
              Our results speak for themselves
            </motion.p>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative flex flex-col bg-white p-8"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <dt className="text-sm font-semibold leading-6 text-gray-600 relative z-10">{stat.name}</dt>
                <motion.dd
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="order-first text-3xl font-semibold tracking-tight text-gray-900 relative z-10"
                >
                  {stat.value}
                </motion.dd>
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{
                    opacity: 1,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    background: 'linear-gradient(90deg, rgba(79,70,229,0.1) 0%, rgba(79,70,229,0.05) 100%)',
                  }}
                />
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
