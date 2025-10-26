# Migration Guide - Admin Panel v2.0

## Overview

This guide helps you migrate from the old admin panel to the new enhanced version with role-based authentication, notifications, and activity logging.

## Prerequisites

- Supabase project is set up
- Database connection is working
- Admin panel is accessible at `/admin`

## Step 1: Database Migration

### Apply Migration

The migration has already been created and applied:
- **File**: `supabase/migrations/admin_system_improvements.sql`
- **Status**: ✅ Applied

### What the Migration Does

1. Creates 4 new tables:
   - `admin_users` - Admin user accounts with roles
   - `admin_activity_logs` - History of all admin actions
   - `admin_notifications` - Real-time notifications
   - `dashboard_widgets` - User-customized dashboard widgets

2. Enables Row Level Security (RLS) on all tables

3. Creates RLS policies for secure access

4. Adds database indexes for performance

5. Creates a default super admin user

### Verify Migration

Check that tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'admin_users',
  'admin_activity_logs',
  'admin_notifications',
  'dashboard_widgets'
);
```

Expected result: All 4 tables should be listed.

## Step 2: Update Dependencies

All required dependencies are already in `package.json`:

- `@supabase/supabase-js` - Database and realtime
- `framer-motion` - Animations
- `lucide-react` - Icons
- `react`, `react-dom` - Framework

No additional packages needed!

## Step 3: Code Changes

### New Files Created

#### Hooks
- ✅ `src/hooks/useAdminAuth.ts`
- ✅ `src/hooks/useAdminNotifications.ts`

#### Components
- ✅ `src/components/Admin/NotificationCenter.tsx`
- ✅ `src/components/Admin/BulkActions.tsx`
- ✅ `src/components/Admin/AdvancedFilters.tsx`
- ✅ `src/components/Admin/ActivityLogViewer.tsx`
- ✅ `src/components/Admin/DashboardWidgets.tsx`

#### Utilities
- ✅ `src/utils/exportData.ts`

### Modified Files
- ✅ `src/components/Admin/AdminPage.tsx` - Enhanced with new features
- ✅ `src/components/Admin/AdminDashboard.tsx` - Integrated widgets
- ✅ `src/components/Admin/index.ts` - Export new components

## Step 4: Using New Features

### Authentication

Old way (localStorage only):
```typescript
const isAuthenticated = localStorage.getItem('admin-auth') === 'true';
```

New way (database-backed):
```typescript
import { useAdminAuth } from '../../hooks/useAdminAuth';

const { adminUser, login, logout, hasPermission } = useAdminAuth();

// Check permission
if (hasPermission('delete_service')) {
  // Allow deletion
}
```

### Activity Logging

Automatically log admin actions:

```typescript
const { logActivity } = useAdminAuth();

// After any action
await logActivity('create', 'service', serviceId, {
  name: 'New Service',
  price: 1000
});
```

### Notifications

Display notifications:

```typescript
import { NotificationCenter } from './NotificationCenter';

<NotificationCenter adminUserId={adminUser.id} />
```

Create notification:

```typescript
await supabase
  .from('admin_notifications')
  .insert({
    admin_user_id: adminUserId,
    type: 'new_order',
    title: 'Новый заказ',
    message: 'Поступил новый заказ #123',
    data: { order_id: 123 }
  });
```

### Bulk Actions

Add to any list component:

```typescript
import { BulkActions } from './BulkActions';

<BulkActions
  selectedCount={selectedItems.length}
  onDelete={handleBulkDelete}
  onActivate={handleBulkActivate}
  onExport={handleBulkExport}
/>
```

### Advanced Filters

Add filtering to lists:

```typescript
import { AdvancedFilters } from './AdvancedFilters';

const filters = [
  {
    id: 'status',
    label: 'Статус',
    type: 'select',
    options: [
      { value: 'active', label: 'Активный' },
      { value: 'inactive', label: 'Неактивный' }
    ]
  },
  {
    id: 'created_at',
    label: 'Дата создания',
    type: 'dateRange'
  }
];

<AdvancedFilters
  filters={filters}
  onApplyFilters={handleApply}
  onClearFilters={handleClear}
/>
```

### Data Export

Export data to CSV or JSON:

```typescript
import { exportToCSV, exportToJSON } from '../../utils/exportData';

// Export to CSV
exportToCSV(data, 'my-data');

// Export to JSON
exportToJSON(data, 'my-data');
```

## Step 5: Testing

### Test Authentication

1. Navigate to `/admin`
2. Enter password: `zubst2024admin`
3. Verify login works
4. Check that `admin_activity_logs` has login entry

### Test Notifications

1. Manually insert a notification:
```sql
INSERT INTO admin_notifications (
  admin_user_id,
  type,
  title,
  message,
  data
) VALUES (
  (SELECT id FROM admin_users LIMIT 1),
  'info',
  'Test',
  'This is a test notification',
  '{}'
);
```

2. Check notification center (bell icon)
3. Verify real-time update

### Test Activity Log

1. Perform any action (create, update, delete)
2. Navigate to "Журнал активности"
3. Verify action is logged
4. Test filters and search
5. Test export to CSV

### Test Widgets

1. On dashboard, click "Настроить"
2. Add/remove widgets
3. Toggle visibility
4. Verify settings persist after refresh

### Test Mobile

1. Open admin panel on mobile device
2. Test hamburger menu
3. Verify responsive layout
4. Test touch interactions

## Step 6: Rollback (If Needed)

If you need to rollback:

### Database Rollback

```sql
-- Drop new tables
DROP TABLE IF EXISTS dashboard_widgets CASCADE;
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

### Code Rollback

1. Restore `AdminPage.tsx` from backup
2. Remove new hook files
3. Remove new component files
4. Clear localStorage

## Step 7: Post-Migration

### Configure Roles

Add additional admin users:

```sql
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES
  ('editor@example.com', 'Editor Name', 'editor', true),
  ('viewer@example.com', 'Viewer Name', 'viewer', true);
```

### Set Up Notifications

Create notification triggers for important events:

```sql
-- Example: Notify on new order
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (
    admin_user_id,
    type,
    title,
    message,
    data
  )
  SELECT
    id,
    'new_order',
    'Новый заказ',
    'Поступил новый заказ #' || NEW.id,
    jsonb_build_object('order_id', NEW.id)
  FROM admin_users
  WHERE role IN ('super_admin', 'admin');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_notification
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order();
```

### Monitor Activity

Regular tasks:

1. Check activity log weekly
2. Review user permissions monthly
3. Archive old notifications (90+ days)
4. Export activity logs for compliance

## Troubleshooting

### Issue: Login not working

**Solution:**
1. Check that migration was applied
2. Verify `admin_users` table exists
3. Check for super admin user:
```sql
SELECT * FROM admin_users WHERE role = 'super_admin';
```
4. Clear localStorage and try again

### Issue: Notifications not appearing

**Solution:**
1. Check Supabase Realtime is enabled
2. Verify RLS policies:
```sql
SELECT * FROM admin_notifications WHERE admin_user_id = 'YOUR_USER_ID';
```
3. Check browser console for errors
4. Refresh page

### Issue: Activity log empty

**Solution:**
1. Perform an action (create/update/delete)
2. Check if `logActivity` is being called
3. Verify RLS policies allow insert
4. Check database for entries:
```sql
SELECT * FROM admin_activity_logs ORDER BY created_at DESC LIMIT 10;
```

### Issue: Widgets not saving

**Solution:**
1. Check `dashboard_widgets` table exists
2. Verify user ID is correct
3. Check RLS policies
4. Clear browser cache

## Best Practices

### Security

1. **Never commit passwords** to version control
2. **Use environment variables** for sensitive data
3. **Rotate passwords regularly**
4. **Review activity logs** for suspicious activity
5. **Keep RLS policies** strict

### Performance

1. **Use indexes** on frequently queried columns
2. **Limit query results** with pagination
3. **Cache dashboard statistics** for 5 minutes
4. **Use bulk operations** instead of loops
5. **Archive old logs** periodically

### Maintenance

1. **Backup database** before major changes
2. **Test in development** first
3. **Monitor error logs**
4. **Keep documentation** updated
5. **Review permissions** quarterly

## Support

### Documentation

- User Guide: [ADMIN_GUIDE_RU.md](./ADMIN_GUIDE_RU.md)
- Technical Docs: [ADMIN_IMPROVEMENTS.md](./ADMIN_IMPROVEMENTS.md)
- Changelog: [CHANGELOG_ADMIN.md](./CHANGELOG_ADMIN.md)

### Common Commands

```bash
# Check migration status
supabase db diff

# Reset database (development only!)
supabase db reset

# Run migrations
supabase db push

# View logs
supabase logs
```

## Conclusion

The migration adds powerful enterprise features to your admin panel:

✅ Role-based authentication
✅ Real-time notifications
✅ Complete activity logging
✅ Advanced filtering
✅ Bulk operations
✅ Data export
✅ Customizable widgets
✅ Mobile-responsive design

All while maintaining backward compatibility with existing functionality.

**Migration Status: Complete** ✨

For questions or issues, refer to the documentation or check the activity log for debugging information.
