import React from 'react';
import { motion } from 'motion/react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'modern';
  color?: 'primary' | 'white' | 'blue' | 'purple' | 'gradient';
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'modern',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-500',
    white: 'text-white',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    gradient: 'text-gradient-to-r from-blue-500 to-purple-500'
  };

  // Spinner classique
  const SpinnerLoader = () => (
    <motion.div
      className={`border-2 border-current border-t-transparent rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  // Dots bouncing
  const DotsLoader = () => (
    <div className={`flex space-x-1 ${sizeClasses[size]}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-1/3 rounded-full bg-current ${colorClasses[color]}`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );

  // Pulse
  const PulseLoader = () => (
    <motion.div
      className={`rounded-full bg-current ${sizeClasses[size]} ${colorClasses[color]}`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );

  // Bars loading
  const BarsLoader = () => (
    <div className={`flex space-x-1 items-end ${sizeClasses[size]}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-1/5 bg-current ${colorClasses[color]}`}
          animate={{ height: ['20%', '100%', '20%'] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );

  // Ring avec gradient
  const RingLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className="absolute inset-0 border-4 border-transparent rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full" />
    </div>
  );

  // Loader moderne avec particules
  const ModernLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Cercle principal */}
      <motion.div
        className={`absolute inset-0 border-2 border-current rounded-full ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Particules orbitantes */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-1/4 h-1/4 bg-current rounded-full ${colorClasses[color]}`}
          animate={{
            rotate: 360,
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          style={{
            top: '0%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: `center ${size === 'sm' ? '8px' : size === 'md' ? '16px' : size === 'lg' ? '24px' : '32px'}`
          }}
        />
      ))}
      
      {/* Point central pulsant */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-current rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );

  const LoaderVariant = {
    spinner: SpinnerLoader,
    dots: DotsLoader,
    pulse: PulseLoader,
    bars: BarsLoader,
    ring: RingLoader,
    modern: ModernLoader
  }[variant];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <LoaderVariant />
      {text && (
        <motion.p
          className={`mt-3 text-sm font-medium ${
            color === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;

{/* <Loader variant="dots" color="blue" />
<Loader variant="pulse" color="purple" />
<Loader variant="ring" />
<Loader variant="bars" /> */}