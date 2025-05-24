
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <ShoppingCart className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">LoyaltyTracker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help your business track customer loyalty, purchases, and build stronger relationships with your best customers.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Customer Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Easily track new and returning customers with auto-generated IDs</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Purchase Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Monitor spending patterns and visit frequency to identify top customers</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Business Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Get detailed reports and rankings to grow your business</p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Buttons */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Join thousands of businesses already tracking customer loyalty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Perfect for butcheries, salons, small vendors, and local businesses</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
