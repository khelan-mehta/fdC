import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertTriangle, Loader, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_URL = 'http://localhost:3001/api/auth';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Email not found');
      setStep(2);
    } catch (err) {
      setError('Email not found');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) throw new Error('Invalid OTP');
      setStep(3);
    } catch (err) {
      setError('Invalid OTP');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) throw new Error('Password reset failed');
      navigate('/login');
    } catch (err) {
      setError('Password reset failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="container max-w-md">
          <div className="glass-panel rounded-xl p-8 shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <Key className="h-6 w-6 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold">
                  {step === 1 && 'Forgot Password'}
                  {step === 2 && 'Enter OTP'}
                  {step === 3 && 'Reset Password'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {step === 1 && 'Enter your email to receive an OTP'}
                  {step === 2 && 'Enter the OTP sent to your email'}
                  {step === 3 && 'Set a new password for your account'}
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </p>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <Label htmlFor="email">Email</Label>
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
                      className="pl-10"
                    />
                  </div>

                  <Button onClick={handleSendOtp} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <Button onClick={handleVerifyOtp} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Button onClick={handleResetPassword} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Reset Password'}
                  </Button>
                </div>
              )}

              <div className="text-center text-sm">
                <span className="text-gray-600">Remember your password?</span>{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgetPassword;
