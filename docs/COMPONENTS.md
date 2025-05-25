
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
- Customer tracking capabilities
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

**Data Flow**:
1. `fetchProfile()` → loads business information
2. `fetchCustomers()` → loads and transforms customer data
3. Creates `userData` object for child components
4. Passes data and update functions to tabs

**Tabs Structure**:
- Customer Entry: Add new customers and record purchases
- Rankings: View top customers by purchase amount
- All Customers: Complete customer list
- Profile: Business information management

---

### 7. CustomerEntry.tsx
**Purpose**: Interface for adding new customers and recording purchases for returning customers.

**How it works**:

**New Customer Flow**:
- Generates sequential 4-digit customer IDs
- Creates customer record with initial purchase
- Updates parent state via callback

**Returning Customer Flow**:
- Searches existing customers by ID
- Updates purchase totals and visit counts
- Handles customer not found errors

**State Management**:
```typescript
newCustomer: { firstName, lastName, purchaseAmount }
returningCustomer: { customerId, purchaseAmount }
```

**Key Features**:
- Automatic ID generation and display
- Recent activity display (last 5 interactions)
- Form validation and error handling
- Success/error toast notifications

---

### 8. CustomerRankings.tsx
**Purpose**: Displays customer rankings based on purchase amounts and visit frequency.

**How it works**:

**Ranking Algorithm**:
1. Primary sort: total purchases (descending)
2. Secondary sort: visit count (descending)
3. Applies date filters if specified
4. Assigns rankings and special badges

**Features**:
- Date range filtering
- Top 3 customer highlighting
- Ranking icons (Trophy, Medal, Award)
- Summary statistics calculation
- Responsive table design

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
**Purpose**: Business information management and statistics display.

**How it works**:

**Form Sections**:
- Business Information: name, type, address, description
- Personal Information: owner name, email, phone

**Statistics Dashboard**:
- Total customers count
- Total visits across all customers
- Total revenue calculation

**Data Persistence**:
- Updates Supabase profiles table
- Maintains local state synchronization
- Provides visual feedback on save

**Features**:
- Icon-enhanced form fields
- Responsive two-column layout
- Real-time statistics calculation
- Form validation and success feedback

---

## UI Components (shadcn/ui)

### Button, Card, Input, Label, Tabs
**Purpose**: Consistent UI components providing design system foundation.

**Key Features**:
- Tailwind CSS styling
- Accessibility compliance
- Responsive design
- Theme consistency

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

### Customer Data Structure
```typescript
{
  id: string,           // 4-digit customer ID
  firstName: string,
  lastName: string,
  totalPurchases: number,
  visitCount: number,
  lastVisit: string     // ISO timestamp
}
```

### Profile Data Structure
```typescript
{
  businessName: string,
  ownerName: string,
  email: string,
  phone?: string,
  address?: string,
  businessType?: string,
  description?: string
}
```

## Error Handling Patterns

### Database Operations
- Try-catch blocks around all Supabase calls
- Detailed console logging for debugging
- User-friendly error messages via toast
- Graceful degradation for failed operations

### Form Validation
- Client-side validation before submission
- Server-side error handling
- Real-time feedback for invalid inputs
- Prevent submission of invalid data
