
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, DollarSign, User, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CustomerEntryProps {
  userData: any;
  setUserData: (data: any) => void;
}

const CustomerEntry = ({ userData, setUserData }: CustomerEntryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    firstName: '',
    lastName: ''
  });

  // Debounced search effect
  useEffect(() => {
    const searchCustomer = async () => {
      if (phoneNumber.length >= 10) {
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
            setFoundCustomer({
              id: data.id,
              firstName: data.first_name,
              lastName: data.last_name,
              phoneNumber: data.phone_number,
              totalPurchases: parseFloat(data.total_purchases.toString()),
              visitCount: data.visit_count,
              lastVisit: data.updated_at
            });
            setShowNewCustomerForm(false);
          } else {
            setFoundCustomer(null);
            setShowNewCustomerForm(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !purchaseAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter phone number and purchase amount",
        variant: "destructive"
      });
      return;
    }

    try {
      const amount = parseFloat(purchaseAmount);
      
      if (foundCustomer) {
        // Update existing customer
        const { error } = await supabase
          .from('customers')
          .update({
            total_purchases: foundCustomer.totalPurchases + amount,
            visit_count: foundCustomer.visitCount + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', foundCustomer.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Purchase Recorded",
          description: `Added $${amount} purchase for ${foundCustomer.firstName} ${foundCustomer.lastName}`
        });
      } else if (showNewCustomerForm && newCustomerData.firstName && newCustomerData.lastName) {
        // Create new customer
        const { error } = await supabase
          .from('customers')
          .insert({
            user_id: user?.id,
            first_name: newCustomerData.firstName,
            last_name: newCustomerData.lastName,
            phone_number: phoneNumber,
            total_purchases: amount,
            visit_count: 1
          });

        if (error) {
          throw error;
        }

        toast({
          title: "New Customer Added",
          description: `Created customer ${newCustomerData.firstName} ${newCustomerData.lastName} with $${amount} purchase`
        });
      }

      // Reset form
      setPhoneNumber('');
      setPurchaseAmount('');
      setFoundCustomer(null);
      setShowNewCustomerForm(false);
      setNewCustomerData({ firstName: '', lastName: '' });
      
      // Refresh data
      setUserData(userData);

    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: "Failed to save customer data",
        variant: "destructive"
      });
    }
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
            Enter phone number to search for existing customers or add new ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Search */}
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="pl-10"
                />
                {isSearching && (
                  <Search className="absolute right-3 top-3 h-4 w-4 text-blue-400 animate-spin" />
                )}
              </div>
            </div>

            {/* Found Customer Display */}
            {foundCustomer && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-green-800">Customer Found</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Name:</strong> {foundCustomer.firstName} {foundCustomer.lastName}</p>
                      <p><strong>Phone:</strong> {foundCustomer.phoneNumber}</p>
                    </div>
                    <div>
                      <p><strong>Total Purchases:</strong> ${foundCustomer.totalPurchases.toFixed(2)}</p>
                      <p><strong>Visits:</strong> {foundCustomer.visitCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Customer Form */}
            {showNewCustomerForm && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Customer Not Found</h3>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowNewCustomerForm(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Customer
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newCustomerData.firstName}
                        onChange={(e) => setNewCustomerData({
                          ...newCustomerData,
                          firstName: e.target.value
                        })}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newCustomerData.lastName}
                        onChange={(e) => setNewCustomerData({
                          ...newCustomerData,
                          lastName: e.target.value
                        })}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purchase Amount */}
            <div>
              <Label htmlFor="purchaseAmount">Purchase Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="purchaseAmount"
                  type="number"
                  step="0.01"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!phoneNumber || !purchaseAmount || (showNewCustomerForm && (!newCustomerData.firstName || !newCustomerData.lastName))}
            >
              {foundCustomer ? 'Record Purchase' : 'Add Customer & Purchase'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerEntry;
