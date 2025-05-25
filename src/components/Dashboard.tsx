
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import CustomerEntry from './CustomerEntry';
import CustomerRankings from './CustomerRankings';
import BusinessProfile from './BusinessProfile';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('entry');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCustomers();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        // Transform Supabase data to match the expected format
        const transformedCustomers = data?.map(customer => ({
          id: customer.id,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phoneNumber: customer.phone_number,
          totalPurchases: parseFloat(customer.total_purchases.toString()),
          visitCount: customer.visit_count,
          lastVisit: customer.updated_at
        })) || [];
        setCustomers(transformedCustomers);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Create userData object in the expected format for backward compatibility
  const userData = {
    businessName: profileData?.business_name || '',
    ownerName: profileData?.owner_name || '',
    email: profileData?.email || user?.email || '',
    customers: customers
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData?.business_name || 'Your Business'}
              </h1>
              <p className="text-gray-600">
                Welcome back, {profileData?.owner_name || user?.email}
              </p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger 
              value="entry" 
              className={`flex items-center gap-2 ${activeTab === 'entry' ? 'bg-green-100 text-green-700 border-green-200' : ''}`}
            >
              <UserPlus className="h-4 w-4" />
              Customer Entry
            </TabsTrigger>
            <TabsTrigger 
              value="rankings" 
              className={`flex items-center gap-2 ${activeTab === 'rankings' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}
            >
              <TrendingUp className="h-4 w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className={`flex items-center gap-2 ${activeTab === 'customers' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}`}
            >
              <Users className="h-4 w-4" />
              All Customers
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className={`flex items-center gap-2 ${activeTab === 'profile' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}
            >
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entry">
            <CustomerEntry userData={userData} setUserData={() => fetchCustomers()} />
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
            <BusinessProfile userData={userData} setUserData={() => fetchProfile()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
