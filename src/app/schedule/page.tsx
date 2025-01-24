'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay, addDays, startOfWeek } from 'date-fns';

interface BookingResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Define days starting from Monday
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const calendarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?date=${formattedDate}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch availability');
        }
        
        if (!Array.isArray(data.availableTimeSlots)) {
          throw new Error('Invalid response format');
        }
        
        setAvailableTimeSlots(data.availableTimeSlots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setError('Failed to load available times. Please try again.');
        setAvailableTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };
    checkAvailability();
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
        }),
      });

      const data: BookingResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setSuccess('Booking confirmed! Check your email for details.');

      setName('');
      setEmail('');
      setPhone('');
      setSelectedDate(null);
      setSelectedTime(null);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  // Get calendar days starting from Monday
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const firstMonday = startOfWeek(start, { weekStartsOn: 1 });
    
    const days = [];
    let currentDay = firstMonday;
    
    while (currentDay <= end || days.length % 7 !== 0) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    
    return days;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Progress bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="pt-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 sm:py-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            Book A Call
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Choose a convenient time for your free consultation, and let's discuss how we can help transform your digital presence.
          </p>
        </motion.div>

        <div className={`
          grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8
          lg:h-[calc(100vh-16rem)] lg:overflow-hidden
          sm:max-h-none sm:overflow-visible
        `}>
          {/* Left Column - Calendar */}
          <motion.div
            variants={calendarVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              {/* Calendar header */}
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevMonth}
                    className="p-1 sm:p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700"
                  >
                    ←
                  </motion.button>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextMonth}
                    className="p-1 sm:p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700"
                  >
                    →
                  </motion.button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {days.map(day => (
                  <div
                    key={day}
                    className="bg-white p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-700"
                  >
                    {day}
                  </div>
                ))}
                {getDaysInMonth().map((date) => {
                  const isSelected = selectedDate && isSameDay(selectedDate, date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const disabled = date < today;
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                  return (
                    <motion.button
                      key={date.toISOString()}
                      onClick={() => !disabled && setSelectedDate(date)}
                      className={`
                        relative bg-white p-1 sm:p-2 text-center transition-all duration-200
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 cursor-pointer'}
                        ${isSelected ? 'text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      `}
                      whileHover={!disabled ? { scale: 1.05 } : undefined}
                      disabled={disabled}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="selected-day"
                          className="absolute inset-1 bg-indigo-600 rounded-lg"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                      <span className={`relative z-10 text-xs sm:text-sm ${isSelected ? 'text-white' : ''}`}>
                        {format(date, 'd')}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Available times for {format(selectedDate, 'EEEE, MMMM d')}
                </h3>

                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="text-sm sm:text-base text-gray-500 text-center py-2">No available time slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => (
                      <motion.button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          p-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                          ${selectedTime === time
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          }
                        `}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Enter your details
            </h3>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm sm:text-base text-red-600"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm sm:text-base text-green-600"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !selectedDate || !selectedTime}
                  whileHover={!isSubmitting && selectedDate && selectedTime ? { scale: 1.02 } : undefined}
                  whileTap={!isSubmitting && selectedDate && selectedTime ? { scale: 0.98 } : undefined}
                  className={`
                    w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-white font-medium text-sm sm:text-base transition-all duration-200 shadow-md
                    ${isSubmitting || !selectedDate || !selectedTime
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                    }
                  `}
                >
                  {isSubmitting ? 'Booking...' : 'Book Consultation'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
