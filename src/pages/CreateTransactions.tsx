import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { url } from '@/env';
import Modal from '@/components/ui/modal';
import TransactionModal from '@/components/ui/modal';


const API_URL = url;

const CreateTransactions = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSendMoney = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user") || '""');
        const response = await fetch(`${API_URL}/auth/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, token]);

  const userId = JSON.parse(localStorage.getItem("user") || '""');

  const confirmTransaction = () => {
    toast.success(`Transaction successful for ${selectedUser.name}`);
    setIsModalOpen(false);
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
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      <Navbar />
      <Card className="max-w-4xl mt-20 sm:mt-32 mx-auto w-full p-4 sm:p-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-red-500 flex items-center justify-center py-10">
              <AlertTriangle className="h-5 w-5 mr-2" /> {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Mobile</th>
                    <th className="border p-2 text-left">Amount</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border">
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2 truncate max-w-xs">{user.email}</td>
                      <td className="border p-2">{user.mobileNumber}</td>
                      <td className="border p-2">${user.amountAvailable}</td>
                      <td className="border p-2">
                        <Button onClick={() => handleSendMoney(user)} className="w-full sm:w-auto">
                          Send Money
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
  <TransactionModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onConfirm={() => {
        
      toast.success(`Transaction sent to ${selectedUser.name}`);
      setIsModalOpen(false);
    }}
    senderId = {userId}
    
    userName={selectedUser.name}
    selectedUser={selectedUser._id}
  />
)}

    </div>
  );
};

export default CreateTransactions;
