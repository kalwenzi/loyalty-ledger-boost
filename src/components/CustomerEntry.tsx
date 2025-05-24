
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
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
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    purchaseAmount: ''
  });
  const [returningCustomer, setReturningCustomer] = useState({
    customerId: '',
    purchaseAmount: ''
  });

  const generateCustomerId = () => {
    const nextId = userData.nextCustomerId || 1;
    return nextId.toString().padStart(4, '0');
  };

  const handleNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.purchaseAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const customerId = generateCustomerId();
    const customer: Customer = {
      id: customerId,
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      totalPurchases: parseFloat(newCustomer.purchaseAmount),
      visitCount: 1,
      lastVisit: new Date().toISOString()
    };

    const updatedUserData = {
      ...userData,
      customers: [...(userData.customers || []), customer],
      nextCustomerId: (userData.nextCustomerId || 1) + 1
    };

    setUserData(updatedUserData);
    localStorage.setItem('loyaltyTracker_user', JSON.stringify(updatedUserData));

    toast({
      title: "Customer Added!",
      description: `${customer.firstName} ${customer.lastName} has been assigned ID: ${customerId}`
    });

    setNewCustomer({ firstName: '', lastName: '', purchaseAmount: '' });
  };

  const handleReturningCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!returningCustomer.customerId || !returningCustomer.purchaseAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const customers = userData.customers || [];
    const customerIndex = customers.findIndex((c: Customer) => c.id === returningCustomer.customerId);
    
    if (customerIndex === -1) {
      toast({
        title: "Customer Not Found",
        description: "No customer found with that ID",
        variant: "destructive"
      });
      return;
    }

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = {
      ...updatedCustomers[customerIndex],
      totalPurchases: updatedCustomers[customerIndex].totalPurchases + parseFloat(returningCustomer.purchaseAmount),
      visitCount: updatedCustomers[customerIndex].visitCount + 1,
      lastVisit: new Date().toISOString()
    };

    const updatedUserData = {
      ...userData,
      customers: updatedCustomers
    };

    setUserData(updatedUserData);
    localStorage.setItem('loyaltyTracker_user', JSON.stringify(updatedUserData));

    const customer = updatedCustomers[customerIndex];
    toast({
      title: "Purchase Recorded!",
      description: `${customer.firstName} ${customer.lastName} - Total: $${customer.totalPurchases.toFixed(2)}`
    });

    setReturningCustomer({ customerId: '', purchaseAmount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* New Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              New Customer
            </CardTitle>
            <CardDescription>
              Register a first-time customer and assign them an ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewCustomer} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newCustomer.firstName}
                  onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newCustomer.lastName}
                  onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPurchaseAmount">Purchase Amount ($)</Label>
                <Input
                  id="newPurchaseAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newCustomer.purchaseAmount}
                  onChange={(e) => setNewCustomer({...newCustomer, purchaseAmount: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Next Customer ID:</strong> {generateCustomerId()}
                </p>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Returning Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Returning Customer
            </CardTitle>
            <CardDescription>
              Record a purchase for an existing customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReturningCustomer} className="space-y-4">
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={returningCustomer.customerId}
                  onChange={(e) => setReturningCustomer({...returningCustomer, customerId: e.target.value})}
                  placeholder="Enter 4-digit ID (e.g., 0001)"
                  maxLength={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="returningPurchaseAmount">Purchase Amount ($)</Label>
                <Input
                  id="returningPurchaseAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={returningCustomer.purchaseAmount}
                  onChange={(e) => setReturningCustomer({...returningCustomer, purchaseAmount: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Purchase
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

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
                      <p className="text-sm text-gray-600">ID: {customer.id}</p>
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
