
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, User, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessProfileProps {
  userData: any;
  setUserData: (data: any) => void;
}

const BusinessProfile = ({ userData, setUserData }: BusinessProfileProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: userData.businessName || '',
    ownerName: userData.ownerName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
    businessType: userData.businessType || '',
    description: userData.description || '',
    currency: userData.currency || 'USD'
  });

  // Major international currencies + 30 most common African currencies
  const currencies = [
    // Major International
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    
    // African Currencies
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu' },
    { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
    { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj' },
    { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk' },
    { code: 'SZL', name: 'Eswatini Lilangeni', symbol: 'L' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
    { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D' },
    { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD' },
    { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
    { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
    { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUserData = {
      ...userData,
      ...formData
    };

    setUserData(updatedUserData);
    localStorage.setItem('loyaltyTracker_user', JSON.stringify(updatedUserData));

    toast({
      title: "Profile Updated",
      description: "Your business profile has been saved successfully"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCurrencyChange = (value: string) => {
    setFormData({
      ...formData,
      currency: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Profile
          </CardTitle>
          <CardDescription>
            Manage your business information and personal details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Your business name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    placeholder="e.g., Butchery, Salon, Retail Store"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500">Major International</div>
                        {currencies.slice(0, 5).map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 border-t mt-1 pt-2">African Currencies</div>
                        {currencies.slice(5).map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, city, postal code"
                      className="pl-10 min-h-[80px]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your business"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Business Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {userData.customers ? userData.customers.length : 0}
            </div>
            <p className="text-sm text-gray-600">Total Customers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {userData.customers 
                ? userData.customers.reduce((sum: number, customer: any) => sum + customer.visitCount, 0)
                : 0
              }
            </div>
            <p className="text-sm text-gray-600">Total Visits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {formData.currency === 'USD' ? '$' : currencies.find(c => c.code === formData.currency)?.symbol || '$'}
              {userData.customers 
                ? userData.customers.reduce((sum: number, customer: any) => sum + customer.totalPurchases, 0).toFixed(2)
                : '0.00'
              }
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessProfile;
