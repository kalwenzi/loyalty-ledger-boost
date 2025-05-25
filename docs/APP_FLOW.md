
# LoyaltyTracker Application Flow

## Overview
LoyaltyTracker is a customer loyalty management system designed for small businesses like butcheries, salons, and local vendors. The application helps track customer purchases, visits, and rankings to build stronger customer relationships.

## Application Flow Algorithm

### 1. Initial Entry Point
```
User visits homepage (/) → 
  - Sees marketing content and features
  - Can click "Get Started" to go to authentication
```

### 2. Authentication Flow
```
User goes to /auth →
  - If not logged in: Shows login/signup form
  - If already logged in: Redirects to /dashboard
  
Signup Process:
  1. User fills form (business name, owner name, email, password)
  2. Supabase creates auth user
  3. Trigger automatically creates profile record
  4. User receives email verification
  5. After verification, user can log in

Login Process:
  1. User enters email/password
  2. Supabase validates credentials
  3. Sets session and redirects to dashboard
```

### 3. Dashboard Flow (Protected Route)
```
User accesses /dashboard →
  - ProtectedRoute checks authentication
  - If not authenticated: Redirects to /auth
  - If authenticated: Loads dashboard

Dashboard initialization:
  1. useAuth hook provides user context
  2. fetchProfile() loads user business data
  3. fetchCustomers() loads customer records
  4. Transforms Supabase data to component format
  5. Renders tabbed interface
```

### 4. Customer Management Flow

#### Adding New Customer:
```
User goes to "Customer Entry" tab →
  1. Fills new customer form (first name, last name, purchase amount)
  2. System generates sequential customer ID (0001, 0002, etc.)
  3. Creates customer record in Supabase with:
     - Generated customer_id
     - User's ID as foreign key
     - Initial purchase amount
     - Visit count = 1
     - Current timestamp
  4. Updates local state and shows success toast
  5. Refreshes customer list
```

#### Recording Return Customer Purchase:
```
User enters existing customer ID and purchase amount →
  1. System searches for customer by ID
  2. If found: Updates total_purchases and visit_count
  3. Updates last_visit timestamp
  4. Saves to Supabase
  5. Shows success message with updated totals
  6. If not found: Shows error message
```

### 5. Rankings and Analytics Flow
```
Rankings Tab:
  1. Fetches all user's customers from state
  2. Applies date filters if set
  3. Sorts by total_purchases (primary), then visit_count (secondary)
  4. Displays top customers with rankings and badges
  5. Shows summary statistics

All Customers Tab:
  - Same as rankings but shows complete list without limit
```

### 6. Profile Management Flow
```
Profile Tab:
  1. Loads current profile data from Supabase
  2. Pre-fills form with existing business information
  3. User can update business details
  4. Saves changes to profiles table
  5. Updates local state
```

### 7. Data Persistence Strategy
```
All data flows through Supabase:
  - Authentication: Supabase Auth
  - User profiles: public.profiles table
  - Customer data: public.customers table
  - Real-time updates via Supabase client
  - Row Level Security ensures data isolation
```

### 8. Logout Flow
```
User clicks logout →
  1. Calls supabase.auth.signOut()
  2. Clears user session
  3. useAuth context updates to null
  4. Redirects to homepage
  5. Shows logout confirmation toast
```

## Error Handling Strategy
- Try-catch blocks around all Supabase operations
- Toast notifications for user feedback
- Console logging for debugging
- Graceful fallbacks for missing data
- Loading states during async operations

## Security Model
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Protected routes require authentication
- Automatic profile creation via database triggers
- Secure password handling through Supabase Auth
