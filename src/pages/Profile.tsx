
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, MapPin, Phone, Fingerprint, Shield, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, isLoading, macAddresses, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    mobileNumber: ''
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    address?: string;
    mobileNumber?: string;
  }>({});
  
  // Redirect if not logged in
  
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        mobileNumber: user.mobileNumber || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.address) newErrors.address = 'Address is required';
    
    if (!formData.mobileNumber) newErrors.mobileNumber = 'mobileNumber number is required';
    else if (!/^[0-9]{10,15}$/.test(formData.mobileNumber.replace(/[^0-9]/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobileNumber number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleEditToggle = () => {
    if (isEditing && validate()) {
      // Save changes
      handleSave();
    } else {
      setIsEditing(!isEditing);
    }
  };
  
  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      const success = await updateProfile({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        mobileNumber: formData.mobileNumber
      });
      
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security Status Card */}
            <Card className="glass-card md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Security Status</CardTitle>
                  <CardDescription>Your account security overview</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Device Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Email Confirmed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">mobileNumber Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Profile Info Card */}
            <div className="md:col-span-2">
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
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
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
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
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.address ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
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
                        name="mobileNumber"
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.mobileNumber ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => logout()}>
                    Sign Out
                  </Button>
                  <Button 
                    onClick={handleEditToggle} 
                    className={isEditing ? 'glass-button' : ''}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      isEditing ? 'Save Changes' : 'Edit Profile'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Device Info Card */}
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>Your device security details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Device ID</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Fingerprint className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      value={macAddresses || 'Unknown'}
                      readOnly
                      className="pl-10 bg-gray-50 font-mono text-xs"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    This is your unique device identifier for enhanced security.
                  </p>
                </div>
                
                <div className="pt-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-medium">Security Tips</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-2">
                      <li>• Never share your device ID with anyone</li>
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication when available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
