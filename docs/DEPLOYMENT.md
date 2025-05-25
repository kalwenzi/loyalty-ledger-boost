
# Deployment and Setup Documentation

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Modern web browser

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd loyalty-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Environment Configuration
- No environment variables needed for basic setup
- Supabase connection configured via integration
- All secrets managed through Lovable platform

---

## Production Deployment

### Lovable Platform Deployment
1. **Automatic Deployment**: Changes pushed to main branch trigger automatic deployment
2. **Build Process**: Vite builds optimized production bundle
3. **CDN Distribution**: Static assets served via CDN
4. **Custom Domain**: Available through Lovable platform settings

### Build Configuration
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## Supabase Backend Setup

### Database Initialization
Required SQL migrations for initial setup:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  total_purchases NUMERIC NOT NULL DEFAULT 0,
  visit_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, business_name, owner_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'business_name', ''),
    COALESCE(new.raw_user_meta_data->>'owner_name', ''),
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own customers" ON public.customers
  FOR ALL USING (auth.uid() = user_id);
```

### Authentication Configuration
1. **Email Settings**: Configure SMTP in Supabase dashboard
2. **URL Configuration**: Set site URL and redirect URLs
3. **Email Templates**: Customize signup/login email templates
4. **Security Settings**: Configure password requirements

---

## Configuration Management

### Supabase Integration
- Project connected via Lovable's native Supabase integration
- Automatic environment variable injection
- Real-time schema synchronization
- Built-in type generation

### Security Configuration
- Row Level Security enabled on all tables
- API keys managed through Lovable platform
- CORS configured for production domains
- JWT token expiration settings

---

## Monitoring and Maintenance

### Performance Monitoring
- Supabase built-in database monitoring
- Query performance analysis
- Real-time connection monitoring
- Storage usage tracking

### Backup Strategy
- Automatic daily backups via Supabase
- Point-in-time recovery available
- Database migration history
- Code versioning through Git

### Update Process
1. **Development**: Test changes locally
2. **Staging**: Deploy to Lovable staging environment
3. **Review**: Test functionality in staging
4. **Production**: Deploy to production via Lovable
5. **Monitor**: Watch for errors and performance issues

---

## Troubleshooting

### Common Issues

#### Database Connection
- **Issue**: RLS policy denying access
- **Solution**: Verify user authentication and policy configuration

#### Authentication Problems
- **Issue**: User registration failing
- **Solution**: Check email configuration and site URL settings

#### Build Failures
- **Issue**: TypeScript compilation errors
- **Solution**: Verify all imports and type definitions

#### Performance Issues
- **Issue**: Slow query performance
- **Solution**: Add database indexes and optimize queries

### Debug Tools
- Browser Developer Tools
- Supabase Dashboard SQL Editor
- Network tab for API requests
- Console logs for error tracking

---

## Scaling Considerations

### Database Scaling
- Monitor connection usage
- Optimize queries with proper indexing
- Consider read replicas for heavy read workloads
- Database connection pooling

### Frontend Scaling
- CDN caching for static assets
- Code splitting for large applications
- Lazy loading for components
- Bundle size optimization

### Cost Optimization
- Monitor Supabase usage metrics
- Optimize query patterns
- Implement efficient caching
- Regular performance audits

---

## Security Checklist

### Pre-deployment Security
- [ ] Row Level Security enabled on all tables
- [ ] API keys properly configured
- [ ] Authentication flows tested
- [ ] Input validation implemented
- [ ] Error handling doesn't expose sensitive data

### Post-deployment Security
- [ ] Monitor authentication logs
- [ ] Regular security updates
- [ ] Database access auditing
- [ ] SSL/TLS certificates valid
- [ ] CORS properly configured

This deployment guide ensures a secure, scalable, and maintainable production environment for the LoyaltyTracker application.
