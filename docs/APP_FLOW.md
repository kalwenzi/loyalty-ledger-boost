
# LoyaltyTracker Application Flow

## Overview
LoyaltyTracker is a customer loyalty management system designed for small businesses like butcheries, salons, and local vendors. The application helps track customer purchases, visits, and rankings using phone numbers as unique customer identifiers.

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

#### Phone Number-Based Customer Search:
```
User enters phone number in Customer Entry →
  1. System searches asynchronously as user types (debounced 300ms)
  2. Query searches customers table by phone_number and user_id
  3. If match found: Displays customer details and purchase form
  4. If no match and phone >= 10 digits: Shows new customer form
  5. Real-time feedback during search process
```

#### Adding New Customer:
```
User enters phone number with no match →
  1. System prompts for customer details (first name, last name)
  2. User fills form with personal details and initial purchase amount
  3. System creates customer record in Supabase with:
     - Phone number as unique identifier
     - User's ID as foreign key
     - Customer names and purchase amount
     - Visit count = 1
     - Current timestamp
  4. Updates local state and shows success toast
  5. Refreshes customer list
```

#### Recording Return Customer Purchase:
```
Customer phone number found in search →
  1. System displays customer information automatically
  2. User enters new purchase amount
  3. System updates total_purchases and visit_count
  4. Updates last_visit timestamp
  5. Saves to Supabase
  6. Shows success message with updated totals
```

### 5. Rankings and Analytics Flow
```
Rankings Tab:
  1. Fetches all user's customers from state
  2. Applies date filters if set
  3. Sorts by total_purchases (primary), then visit_count (secondary)
  4. Displays top customers with rankings and badges
  5. Shows summary statistics
  6. Phone numbers displayed instead of customer IDs

All Customers Tab:
  - Same as rankings but shows complete list without limit
  - Displays phone numbers for easy identification
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
  - Customer data: public.customers table (phone_number as unique identifier)
  - Real-time updates via Supabase client
  - Row Level Security ensures data isolation
  - Unique constraint on phone_number per user
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

## Customer Identification System

### Phone Number as Primary Identifier
- Phone numbers serve as unique customer identifiers
- Replaces previous 4-digit sequential ID system
- Enables natural customer lookup and recognition
- Supports international phone number formats

### Search Algorithm
```
Phone number input (length >= 3) →
  Debounced search (300ms delay) →
  Query: customers.phone_number = input AND customers.user_id = current_user →
  Result: Customer found OR Customer not found →
  UI Update: Show customer details OR Show new customer form
```

## Error Handling Strategy
- Try-catch blocks around all Supabase operations
- Toast notifications for user feedback
- Console logging for debugging
- Graceful fallbacks for missing data
- Loading states during async operations
- Duplicate phone number prevention via unique constraints

## Security Model
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Protected routes require authentication
- Automatic profile creation via database triggers
- Secure password handling through Supabase Auth
- Phone number uniqueness enforced per user
