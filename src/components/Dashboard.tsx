
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CustomerEntry from './CustomerEntry';
import CustomerRankings from './CustomerRankings';
import BusinessProfile from './BusinessProfile';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loyaltyTracker_isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const storedUserData = localStorage.getItem('loyaltyTracker_user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loyaltyTracker_isLoggedIn');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.businessName}</h1>
              <p className="text-gray-600">Welcome back, {userData.ownerName}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="entry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="entry" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Customer Entry
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Customers
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entry">
            <CustomerEntry userData={userData} setUserData={setUserData} />
          </TabsContent>

          <TabsContent value="rankings">
            <CustomerRankings userData={userData} />
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>
                  Complete list of all your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerRankings userData={userData} showAllCustomers={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <BusinessProfile userData={userData} setUserData={setUserData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
