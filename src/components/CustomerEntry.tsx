
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Search, Plus, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  totalPurchases: number;
  visitCount: number;
  lastVisit: string;
}

interface CustomerEntryProps {
  userData: any;
  setUserData: (data: any) => void;
}

const CustomerEntry = ({ userData, setUserData }: CustomerEntryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    firstName: '',
    lastName: ''
  });

  // Search for customer as user types phone number
  useEffect(() => {
    const searchCustomer = async () => {
      if (phoneNumber.length >= 3) {
        setIsSearching(true);
        try {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', user?.id)
            .eq('phone_number', phoneNumber)
            .maybeSingle();

          if (error) {
            console.error('Error searching customer:', error);
            return;
          }

          if (data) {
            const customer: Customer = {
              id: data.id,
              firstName: data.first_name,
              lastName: data.last_name,
              phoneNumber: data.phone_number,
              totalPurchases: parseFloat(data.total_purchases.toString()),
              visitCount: data.visit_count,
              lastVisit: data.updated_at
            };
            setFoundCustomer(customer);
            setShowNewCustomerForm(false);
          } else {
            setFoundCustomer(null);
            setShowNewCustomerForm(phoneNumber.length >= 10);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFoundCustomer(null);
        setShowNewCustomerForm(false);
      }
    };

    const debounceTimer = setTimeout(searchCustomer, 300);
    return () => clearTimeout(debounceTimer);
  }, [phoneNumber, user?.id]);

  const handleExistingCustomerPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foundCustomer || !purchaseAmount) {
      toast({
        title: "Error",
        description: "Please enter a purchase amount",
        variant: "destructive"
      });
      return;
    }

    try {
      const newTotal = foundCustomer.totalPurchases + parseFloat(purchaseAmount);
      const newVisitCount = foundCustomer.visitCount + 1;

      const { error } = await supabase
        .from('customers')
        .update({
          total_purchases: newTotal,
          visit_count: newVisitCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', foundCustomer.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Purchase Recorded!",
        description: `${foundCustomer.firstName} ${foundCustomer.lastName} - Total: $${newTotal.toFixed(2)}`
      });

      // Refresh data by calling setUserData with the current userData
      setUserData(userData);
      resetForm();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to record purchase",
        variant: "destructive"
      });
    }
  };

  const handleNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomerData.firstName || !newCustomerData.lastName || !purchaseAmount || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('customers')
        .insert({
          user_id: user?.id,
          phone_number: phoneNumber,
          first_name: newCustomerData.firstName,
          last_name: newCustomerData.lastName,
          total_purchases: parseFloat(purchaseAmount),
          visit_count: 1
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Customer Added!",
        description: `${newCustomerData.firstName} ${newCustomerData.lastName} has been registered`
      });

      // Refresh data by calling setUserData with the current userData
      setUserData(userData);
      resetForm();
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setPurchaseAmount('');
    setFoundCustomer(null);
    setShowNewCustomerForm(false);
    setNewCustomerData({ firstName: '', lastName: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Customer Entry
          </CardTitle>
          <CardDescription>
            Enter phone number to find existing customer or create new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (e.g., +1234567890)"
              required
            />
            {isSearching && (
              <p className="text-sm text-gray-500 mt-1">Searching...</p>
            )}
          </div>

          {foundCustomer && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Customer Found!</h3>
              <p className="text-green-700">
                <strong>{foundCustomer.firstName} {foundCustomer.lastName}</strong>
              </p>
              <p className="text-sm text-green-600">
                Total Purchases: ${foundCustomer.totalPurchases.toFixed(2)} | 
                Visits: {foundCustomer.visitCount}
              </p>
            </div>
          )}

          {showNewCustomerForm && !foundCustomer && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-blue-800">New Customer</h3>
              <p className="text-blue-700 text-sm">Customer not found. Please enter details:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newCustomerData.firstName}
                    onChange={(e) => setNewCustomerData({...newCustomerData, firstName: e.target.value})}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newCustomerData.lastName}
                    onChange={(e) => setNewCustomerData({...newCustomerData, lastName: e.target.value})}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {(foundCustomer || showNewCustomerForm) && (
            <form onSubmit={foundCustomer ? handleExistingCustomerPurchase : handleNewCustomer}>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="purchaseAmount">Purchase Amount ($)</Label>
                  <Input
                    id="purchaseAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {foundCustomer ? 'Record Purchase' : 'Add New Customer'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Clear
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last 5 customer interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {userData.customers && userData.customers.length > 0 ? (
            <div className="space-y-2">
              {userData.customers
                .sort((a: Customer, b: Customer) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
                .slice(0, 5)
                .map((customer: Customer) => (
                  <div key={customer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                      <p className="text-sm text-gray-600">Phone: {customer.phoneNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${customer.totalPurchases.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{customer.visitCount} visits</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No customer activity yet. Add your first customer above!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerEntry;
