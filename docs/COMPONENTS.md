
# Component Documentation

## Core Application Components

### 1. App.tsx
**Purpose**: Root application component that sets up routing and global providers.

**How it works**:
- Wraps entire app with QueryClient for data fetching
- Provides AuthProvider for authentication context
- Sets up React Router with protected and public routes
- Includes global UI providers (TooltipProvider, Toaster)
- Defines route structure: `/` → HomePage, `/auth` → AuthPage, `/dashboard` → Dashboard

**Key Features**:
- Single source of truth for app configuration
- Centralized error boundary setup via toast notifications
- Route protection implementation

---

### 2. AuthProvider (useAuth.tsx)
**Purpose**: Manages authentication state and provides auth methods throughout the app.

**How it works**:
- Creates React context for auth state
- Monitors Supabase auth state changes
- Provides methods: signUp, signIn, signOut
- Maintains user session and loading states

**Key Features**:
- Automatic session restoration on app load
- Real-time auth state synchronization
- Centralized auth error handling
- Type-safe auth context

**State Management**:
```typescript
{
  user: User | null,
  session: Session | null,
  loading: boolean,
  signUp: (email, password, metadata) => Promise,
  signIn: (email, password) => Promise,
  signOut: () => Promise
}
```

---

### 3. ProtectedRoute.tsx
**Purpose**: Route wrapper that ensures only authenticated users can access protected pages.

**How it works**:
- Consumes useAuth context
- Shows loading spinner while checking auth
- Redirects to `/auth` if user not authenticated
- Renders children if user is authenticated

**Security Features**:
- Prevents unauthorized access to dashboard
- Handles loading states gracefully
- Automatic redirection

---

### 4. HomePage.tsx
**Purpose**: Landing page showcasing app features and providing entry point.

**How it works**:
- Static marketing content with feature cards
- "Get Started" button navigates to `/auth`
- Responsive design with gradient background
- Uses Lucide icons for visual appeal

**Features Highlighted**:
- Customer tracking capabilities via phone numbers
- Purchase analytics
- Business insights

---

### 5. AuthPage.tsx
**Purpose**: Unified authentication component handling both login and signup.

**How it works**:
- Toggle between login/signup modes
- Form validation (password length, confirmation matching)
- Integration with Supabase Auth
- Automatic redirection after successful auth

**Form Fields**:
- Login: email, password
- Signup: business name, owner name, email, password, confirm password

**Validation Rules**:
- Email format validation
- Password minimum 6 characters
- Password confirmation matching
- Required field validation

---

### 6. Dashboard.tsx
**Purpose**: Main application interface with tabbed navigation for all features.

**How it works**:
- Fetches user profile and customer data on mount
- Transforms Supabase data to component-expected format
- Manages global app state for customer operations
- Provides logout functionality
- Tracks active tab state for visual feedback

**Data Flow**:
1. `fetchProfile()` → loads business information
2. `fetchCustomers()` → loads and transforms customer data (including phone numbers)
3. Creates `userData` object for child components
4. Passes data and update functions to tabs

**Data Transformation**:
- Maps `phone_number` from DB to `phoneNumber` in components
- Handles new customer data structure with phone identification

**Navigation Features**:
- Active tab highlighting with colored backgrounds
- Visual feedback for current section
- Color-coded tabs: Entry (green), Rankings (blue), Customers (purple), Profile (orange)

**Tabs Structure**:
- Customer Entry: Phone-based customer search and entry
- Rankings: View top customers by purchase amount
- All Customers: Complete customer list with phone numbers
- Profile: Business information and currency management

---

### 7. CustomerEntry.tsx
**Purpose**: Phone number-based customer identification and purchase recording system.

**How it works**:

**Phone Number Search Flow**:
- Real-time search as user types (debounced 300ms)
- Queries Supabase customers table by phone_number
- Shows loading state during search with spinning search icon
- Displays found customer details or new customer form

**Customer Found Flow**:
- Displays customer name and purchase history in green-themed card
- Allows direct purchase amount entry
- Updates existing customer record
- Increments visit count and total purchases

**New Customer Flow**:
- Triggers when phone number not found (>=10 digits)
- Shows blue-themed "Customer Not Found" card
- Compact "Add New Customer" button (not full-width)
- Collects first name, last name, and initial purchase
- Creates new customer record with phone as identifier
- Sets initial visit count to 1

**State Management**:
```typescript
phoneNumber: string,
purchaseAmount: string,
foundCustomer: Customer | null,
isSearching: boolean,
showNewCustomerForm: boolean,
newCustomerData: { firstName, lastName }
```

**Key Features**:
- Asynchronous phone number search
- Automatic customer detection
- Seamless new customer registration
- Real-time search feedback with visual indicators
- Form validation and error handling
- Success/error toast notifications
- Optimized UI with compact buttons

**Search Algorithm**:
1. User types phone number
2. Debounced search after 300ms delay
3. Query database for exact phone match
4. Update UI based on search results
5. Handle loading and error states

---

### 8. CustomerRankings.tsx
**Purpose**: Displays customer rankings based on purchase amounts and visit frequency.

**How it works**:

**Ranking Algorithm**:
1. Primary sort: total purchases (descending)
2. Secondary sort: visit count (descending)
3. Applies date filters if specified
4. Assigns rankings and special badges

**Updated Display**:
- Shows phone numbers instead of customer IDs
- Maintains all existing ranking functionality
- Responsive table design with phone number column
- Currency-aware display using business profile settings

**Features**:
- Date range filtering
- Top 3 customer highlighting
- Ranking icons (Trophy, Medal, Award)
- Summary statistics calculation
- Phone number display for easy identification

**Badge System**:
- Rank 1: "Top Customer" (yellow)
- Rank 2-3: "Top 3" (secondary)
- Rank 4-5: "Top 5" (outline)

**Statistics Calculated**:
- Total revenue for filtered period
- Total visits
- Average revenue per customer

---

### 9. BusinessProfile.tsx
**Purpose**: Business information management, currency selection, and statistics display.

**How it works**:

**Form Sections**:
- Business Information: name, type, address, description, currency
- Personal Information: owner name, email, phone

**Currency Management**:
- Dropdown select with 5 major international currencies
- 30 most common African currencies
- Visual currency symbols and full names
- Grouped display (International vs African)
- Saves to user profile for global use

**Supported Currencies**:
- **International**: USD, EUR, GBP, JPY, CHF
- **African**: ZAR, NGN, KES, UGX, TZS, GHS, EGP, MAD, TND, DZD, AOA, BWP, BIF, CVE, XAF, KMF, CDF, DJF, ERN, SZL, ETB, GMD, GNF, LRD, LYD, MGA, MWK, MRU, MUR, MZN, NAD, RWF

**Statistics Dashboard**:
- Total customers count
- Total visits across all customers
- Total revenue calculation with selected currency symbol

**Data Persistence**:
- Updates Supabase profiles table
- Maintains local state synchronization
- Provides visual feedback on save

**Features**:
- Icon-enhanced form fields
- Responsive two-column layout
- Real-time statistics calculation
- Currency-aware revenue display
- Form validation and success feedback

---

## UI Components (shadcn/ui)

### Button, Card, Input, Label, Tabs, Select
**Purpose**: Consistent UI components providing design system foundation.

**Key Features**:
- Tailwind CSS styling
- Accessibility compliance
- Responsive design
- Theme consistency
- Select component for currency dropdown

### Toast System
**Purpose**: User feedback for actions and errors.

**Implementation**:
- Success messages for completed actions
- Error messages for failed operations
- Automatic dismissal
- Consistent styling and positioning

---

## Hooks and Utilities

### useToast
**Purpose**: Provides toast notification functionality.

**Usage**:
```typescript
const { toast } = useToast();
toast({
  title: "Success",
  description: "Action completed",
  variant: "default" | "destructive"
});
```

### Supabase Client
**Purpose**: Database and authentication interface.

**Configuration**:
- Project URL and anon key
- Row Level Security integration
- Real-time subscriptions capability
- Type-safe database operations

---

## Data Models

### Customer Data Structure (Updated)
```typescript
{
  id: string,              // UUID from database
  firstName: string,
  lastName: string,
  phoneNumber: string,     // Primary identifier (unique)
  totalPurchases: number,
  visitCount: number,
  lastVisit: string        // ISO timestamp
}
```

### Profile Data Structure (Updated)
```typescript
{
  businessName: string,
  ownerName: string,
  email: string,
  phone?: string,
  address?: string,
  businessType?: string,
  description?: string,
  currency: string         // ISO currency code (e.g., 'USD', 'KES', 'NGN')
}
```

### Database Schema Changes
- Removed `customer_id` column (4-digit sequential ID)
- Added `phone_number` column with unique constraint
- Phone number serves as primary customer identifier
- Updated indexes for phone number search optimization
- Currency stored in user profiles for global application

### Currency System
- Default currency: USD
- Supports 35+ currencies (5 international + 30+ African)
- Currency selection persists across all components
- Automatic symbol display in statistics and reports

## Error Handling Patterns

### Database Operations
- Try-catch blocks around all Supabase calls
- Detailed console logging for debugging
- User-friendly error messages via toast
- Graceful degradation for failed operations
- Phone number uniqueness validation

### Form Validation
- Client-side validation before submission
- Server-side error handling
- Real-time feedback for invalid inputs
- Prevent submission of invalid data
- Phone number format validation

### Search Operations
- Debounced search to prevent excessive API calls
- Loading states during search with visual indicators
- Graceful handling of no results
- Network error handling
- Optimized UI feedback

## User Experience Enhancements

### Visual Feedback
- Active tab highlighting with distinct colors
- Loading states with animated icons
- Success/error states with appropriate styling
- Compact button sizing for better UX

### Navigation
- Color-coded tabs for easy identification
- Visual state management across components
- Responsive design for all screen sizes

### Data Entry
- Phone-first customer identification
- Automatic customer lookup and creation
- Streamlined purchase recording process
- Currency-aware displays throughout application
