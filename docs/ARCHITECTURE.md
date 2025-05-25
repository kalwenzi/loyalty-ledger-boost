
# LoyaltyTracker Architecture Documentation

## System Overview

LoyaltyTracker is a modern web application built with a React frontend and Supabase backend, designed to help small businesses manage customer loyalty programs.

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + useState/useEffect
- **Routing**: React Router v6

---

## Database Architecture

### Tables Structure

#### profiles
```sql
- id (UUID, PK, references auth.users)
- business_name (TEXT, NOT NULL)
- owner_name (TEXT, NOT NULL) 
- email (TEXT, NOT NULL)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)
```

#### customers
```sql
- id (UUID, PK, auto-generated)
- user_id (UUID, FK to auth.users)
- customer_id (TEXT, business-assigned ID)
- first_name (TEXT, NOT NULL)
- last_name (TEXT, NOT NULL)
- total_purchases (NUMERIC, DEFAULT 0)
- visit_count (INTEGER, DEFAULT 1)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)
```

### Row Level Security (RLS)
- **Profiles**: Users can only access their own profile data
- **Customers**: Users can only access customers they created
- Automatic policy enforcement at database level

### Database Functions
```sql
handle_new_user() - Trigger function that creates profile on user signup
```

---

## Frontend Architecture

### Component Hierarchy
```
App
├── AuthProvider (Context)
├── QueryClientProvider
├── TooltipProvider
└── BrowserRouter
    ├── HomePage (/)
    ├── AuthPage (/auth)
    └── ProtectedRoute
        └── Dashboard (/dashboard)
            ├── CustomerEntry
            ├── CustomerRankings
            └── BusinessProfile
```

### State Management Strategy

#### Global State (Context)
- **AuthContext**: User authentication state
  - Current user session
  - Authentication methods
  - Loading states

#### Local State (useState)
- **Dashboard**: Profile data, customers list, loading states
- **CustomerEntry**: Form states for new/returning customers
- **CustomerRankings**: Date filters, sorted customer data
- **BusinessProfile**: Form data for business information

#### Data Flow Pattern
```
User Action → Component State Update → Supabase API Call → 
Database Update → Callback to Parent → Re-fetch Data → UI Update
```

---

## Security Architecture

### Authentication Flow
1. User registers/logs in via Supabase Auth
2. JWT token stored in browser
3. Token automatically included in API requests
4. ProtectedRoute validates authentication
5. Database RLS enforces data isolation

### Data Security
- Row Level Security (RLS) on all tables
- User data isolation at database level
- Secure API endpoints via Supabase
- Client-side route protection

### Input Validation
- Form validation on frontend
- Database constraints for data integrity
- SQL injection prevention via Supabase client
- XSS prevention through React's built-in escaping

---

## Performance Considerations

### Frontend Optimization
- React functional components with hooks
- Efficient re-rendering through proper dependency arrays
- Minimal bundle size with tree shaking
- Fast development builds with Vite

### Database Optimization
- Indexed columns for common queries
- Efficient queries with proper filtering
- Real-time subscriptions for live updates
- Connection pooling via Supabase

### Caching Strategy
- React Query client setup (for future use)
- Browser caching of static assets
- Supabase built-in query caching

---

## Error Handling Architecture

### Frontend Error Boundaries
- Try-catch blocks around async operations
- Toast notifications for user feedback
- Graceful degradation for failed operations
- Console logging for debugging

### Backend Error Handling
- Supabase error responses
- Database constraint violations
- Authentication errors
- Network connectivity issues

### User Experience
- Loading states during operations
- Clear error messages
- Fallback UI for missing data
- Retry mechanisms where appropriate

---

## Deployment Architecture

### Frontend Deployment
- Static site generation via Vite build
- CDN distribution via Lovable platform
- Environment variable management
- Automatic deployments from git

### Backend Infrastructure
- Supabase managed infrastructure
- PostgreSQL database hosting
- Authentication service
- Real-time WebSocket connections

### Environment Management
- Development: Local development server
- Production: Lovable hosting platform
- Environment variables for API keys
- Separate database environments

---

## Scalability Considerations

### Database Scalability
- Horizontal scaling via Supabase
- Connection pooling
- Query optimization
- Indexing strategy

### Frontend Scalability
- Component-based architecture
- Code splitting potential
- Lazy loading opportunities
- Bundle optimization

### Feature Scalability
- Modular component structure
- Consistent patterns for new features
- Type-safe development
- Reusable UI components

---

## Integration Points

### External Services
- **Supabase**: Database, auth, real-time
- **Lovable**: Hosting and deployment
- **Tailwind CSS**: Styling framework

### API Integration
- RESTful patterns via Supabase client
- Real-time subscriptions
- File upload capabilities (future)
- Email services (via Supabase)

---

## Monitoring and Debugging

### Development Tools
- React Developer Tools
- Browser DevTools
- Supabase Dashboard
- Console logging strategy

### Production Monitoring
- Supabase built-in monitoring
- Error tracking via console
- Performance metrics
- User analytics (future consideration)

---

## Future Architecture Considerations

### Potential Enhancements
1. **Offline Support**: PWA capabilities for offline use
2. **Real-time Updates**: WebSocket integration for live data
3. **Mobile App**: React Native implementation
4. **Advanced Analytics**: Reporting and dashboard features
5. **Multi-tenant**: Support for multiple businesses per user

### Migration Strategy
- Database migration files
- Component refactoring approach
- Backwards compatibility
- Data preservation during updates

This architecture provides a solid foundation for current needs while maintaining flexibility for future growth and feature additions.
