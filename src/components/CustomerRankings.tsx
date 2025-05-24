
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Trophy, Medal, Award } from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  totalPurchases: number;
  visitCount: number;
  lastVisit: string;
}

interface CustomerRankingsProps {
  userData: any;
  showAllCustomers?: boolean;
}

const CustomerRankings = ({ userData, showAllCustomers = false }: CustomerRankingsProps) => {
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const customers = userData.customers || [];

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply date filter if both dates are provided
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Include entire end date

      filtered = filtered.filter((customer: Customer) => {
        const lastVisit = new Date(customer.lastVisit);
        return lastVisit >= startDate && lastVisit <= endDate;
      });
    }

    // Sort by total purchases (primary) and visit count (secondary)
    filtered.sort((a: Customer, b: Customer) => {
      if (b.totalPurchases !== a.totalPurchases) {
        return b.totalPurchases - a.totalPurchases;
      }
      return b.visitCount - a.visitCount;
    });

    return filtered;
  }, [customers, dateFilter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-medium">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Top Customer</Badge>;
    if (rank <= 3) return <Badge variant="secondary">Top 3</Badge>;
    if (rank <= 5) return <Badge variant="outline">Top 5</Badge>;
    return null;
  };

  const clearFilters = () => {
    setDateFilter({ startDate: '', endDate: '' });
  };

  const displayedCustomers = showAllCustomers ? filteredAndSortedCustomers : filteredAndSortedCustomers.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter by Date Range
          </CardTitle>
          <CardDescription>
            Filter rankings by customer activity within a specific period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
              />
            </div>
            <div>
              <Button 
                onClick={clearFilters} 
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>
            {showAllCustomers ? 'All Customers' : 'Top Customer Rankings'}
          </CardTitle>
          <CardDescription>
            {dateFilter.startDate && dateFilter.endDate 
              ? `Rankings for ${dateFilter.startDate} to ${dateFilter.endDate}`
              : 'Ranked by total purchases, then by visit frequency'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayedCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Total Purchases</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                    <TableHead className="text-right">Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedCustomers.map((customer: Customer, index: number) => {
                    const rank = index + 1;
                    return (
                      <TableRow key={customer.id} className={rank <= 3 ? 'bg-green-50/50' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer.id}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${customer.totalPurchases.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {customer.visitCount}
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-600">
                          {new Date(customer.lastVisit).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getRankBadge(rank)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {dateFilter.startDate && dateFilter.endDate 
                  ? 'No customer activity found in the selected date range'
                  : 'No customers added yet. Start by adding your first customer!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {filteredAndSortedCustomers.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                ${filteredAndSortedCustomers.reduce((sum: number, customer: Customer) => sum + customer.totalPurchases, 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {filteredAndSortedCustomers.reduce((sum: number, customer: Customer) => sum + customer.visitCount, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Visits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                ${filteredAndSortedCustomers.length > 0 
                  ? (filteredAndSortedCustomers.reduce((sum: number, customer: Customer) => sum + customer.totalPurchases, 0) / filteredAndSortedCustomers.length).toFixed(2)
                  : '0.00'
                }
              </div>
              <p className="text-sm text-gray-600">Average per Customer</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomerRankings;
