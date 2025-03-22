
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, User, Mail, MapPin, Phone, Lock, Fingerprint, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Register = () => {
  const { register, isLoading, macAddresses } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    address?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!address) newErrors.address = 'Address is required';
    
    if (!mobileNumber) newErrors.mobileNumber = 'mobileNumber number is required';
    else if (!/^[0-9]{10,15}$/.test(mobileNumber.replace(/[^0-9]/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobileNumber number';
    }
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await register({
        name,
        email,
        address,
        mobileNumber,
        password,
        macAddresses: macAddresses || 'unknown'
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="container max-w-lg">
          <div className="glass-panel rounded-xl p-8 shadow-xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center space-y-2">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-gray-600 text-sm">
                  Join our secure blockchain fraud detection platform
                </p>
              </motion.div>
              
              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Address Field */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main St, City, Country"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`pl-10 ${errors.address ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>
                
                {/* mobileNumber Field */}
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber" className="text-sm font-medium">
                    mobileNumber Number
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      placeholder="+1 (123) 456-7890"
                      value={mobileNumber}
                      onChange={(e) => setmobileNumber(e.target.value)}
                      className={`pl-10 ${errors.mobileNumber ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
                
                {/* Device ID Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="macAddresses" className="text-sm font-medium">
                    Device ID
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Fingerprint className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="macAddresses"
                      type="text"
                      value={macAddresses || 'Generating...'}
                      readOnly
                      className="pl-10 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    This is your unique device identifier for enhanced security.
                  </p>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 ${errors.password ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${errors.confirmPassword ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full glass-button" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>
              
              <motion.div variants={itemVariants} className="text-center text-sm">
                <span className="text-gray-600">Already have an account?</span>{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
