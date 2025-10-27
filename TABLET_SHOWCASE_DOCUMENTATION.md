# Tablet-Optimized Website Documentation

## Overview

A comprehensive tablet-optimized website featuring an animated custom cursor, professional photo gallery, QR code integration for mobile app downloads, and stylus-optimized input components.

## Features Implemented

### 1. Custom Animated Cursor System (`AnimatedCursor.tsx`)

**Features:**
- Sparkling particle effects that follow cursor movement
- Velocity-based particle generation
- Dynamic cursor states: idle, hover, click, and drag
- Smooth trail effects with fade-out animation
- Contextual animations for interactive elements
- 60fps performance optimization

**Usage:**
```tsx
import { AnimatedCursor } from './components/AnimatedCursor';

// Add to your page component
<AnimatedCursor />
```

**States:**
- **Idle**: Default circular cursor with subtle pulse animation
- **Hover**: Enlarged cursor with glow effect when over interactive elements
- **Drag**: Smaller cursor with accent color when clicking/dragging
- **Motion**: Particle trail that follows rapid cursor movement

### 2. Tablet Gallery Component (`TabletGallery.tsx`)

**Features:**
- Responsive grid layout optimized for tablets (768px-1024px)
- Category-based filtering system
- Smooth lightbox with full-screen image viewing
- Keyboard navigation support (Arrow keys, Escape)
- Image metadata display (title, description, date)
- Favorites/like functionality
- Lazy loading for performance optimization
- Touch-optimized navigation controls

**Categories:**
- All Photos
- Clinic
- Team
- Equipment
- Results
- Events

**Database Integration:**
The gallery loads images from the `gallery_images` Supabase table with automatic fallback to placeholder images.

**Usage:**
```tsx
import { TabletGallery } from './components/TabletGallery';

<TabletGallery />
```

**Keyboard Shortcuts:**
- `→` Next image
- `←` Previous image
- `Esc` Close lightbox

### 3. QR Code Display Component (`QRCodeDisplay.tsx`)

**Features:**
- Dynamic QR code generation using QR Server API
- Two display variants: embedded and floating
- Auto-generated QR codes linking to mobile app
- Animated glow effects every 5 seconds
- Step-by-step download instructions
- Direct app store links (iOS & Android)
- Responsive sizing options (small, medium, large)

**Variants:**

#### Embedded Mode
Full-featured display with instructions and app store buttons.

```tsx
<QRCodeDisplay
  size="large"
  showInstructions={true}
  variant="embedded"
/>
```

#### Floating Mode
Compact QR code that floats in the bottom-right corner.

```tsx
<QRCodeDisplay
  variant="floating"
  size="small"
  showInstructions={false}
/>
```

**Customization:**
- `size`: 'small' | 'medium' | 'large'
- `showInstructions`: boolean
- `variant`: 'floating' | 'embedded'

### 4. Stylus-Optimized Input (`StylusInput.tsx`)

**Features:**
- Dual input modes: text and drawing
- Pressure-sensitive drawing with stylus support
- Palm rejection for natural writing experience
- Customizable pen tools (pen, eraser)
- Adjustable stroke width and color
- Canvas export to PNG
- Touch-optimized interface
- Minimum 44px touch targets

**Tools:**
- **Pen Tool**: Draw with customizable color and width
- **Eraser Tool**: Remove unwanted strokes
- **Clear Canvas**: Reset entire drawing
- **Download**: Export drawing as PNG image

**Usage:**
```tsx
import { StylusInput } from './components/StylusInput';

const handleSubmit = (imageData: string, text: string) => {
  console.log('Feedback received:', { imageData, text });
};

<StylusInput
  onSubmit={handleSubmit}
  placeholder="Write your feedback..."
/>
```

### 5. Tablet Showcase Page (`TabletShowcase.tsx`)

**Main Features:**
- Welcome screen with clinic statistics
- Integrated gallery browser
- QR code section for app downloads
- Feedback/review submission interface
- Quick action navigation
- Floating QR code widget
- Smooth page transitions

**Sections:**
1. **Welcome**: Statistics, quick actions, contact information
2. **Gallery**: Photo browser with categories
3. **QR Code**: Mobile app download section
4. **Feedback**: Text/drawing input for reviews

**Navigation:**
The page uses section-based navigation with smooth transitions between views.

## Technical Specifications

### Responsive Design

**Target Devices:**
- iPad (768x1024)
- iPad Pro (834x1112, 1024x1366)
- Android Tablets (768x1024 and up)
- Surface tablets

**Breakpoints:**
```css
/* Tablet-specific: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  /* Tablet optimizations */
}
```

### Touch & Stylus Optimization

**Touch Targets:**
All interactive elements have minimum 44x44px touch areas as per accessibility guidelines.

```css
.stylus-target {
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
}
```

**Palm Rejection:**
```css
@media (pointer: coarse) {
  input, textarea, canvas {
    touch-action: none;
  }
}
```

**Pressure Sensitivity:**
The drawing canvas detects stylus pressure for variable stroke width.

### Performance Optimizations

**Implemented Techniques:**
1. **Lazy Loading**: Images load on-demand
2. **RequestAnimationFrame**: Smooth 60fps animations
3. **Will-change**: GPU acceleration for transforms
4. **Debouncing**: Optimized event handlers
5. **Code Splitting**: Dynamic imports for better load times

### Animations

**Cursor Effects:**
- Particle generation: 70% probability on fast movement
- Particle lifecycle: 60 frames
- Trail fadeout: 0.05 opacity per frame

**Page Transitions:**
- Slide transitions: 500ms ease-out
- Scale transitions: 500ms ease-out
- Opacity fades: 300ms

### Database Schema

**Table: `gallery_images`**

```sql
CREATE TABLE gallery_images (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL,
  metadata jsonb,
  display_order integer,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
);
```

**Indexes:**
- `idx_gallery_images_category`
- `idx_gallery_images_active`
- `idx_gallery_images_order`

**Security:**
- Public read access for active images
- Authenticated write access for admin users

## Installation & Setup

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# The migration file is already created at:
# supabase/migrations/20251006200000_tablet_gallery_system.sql

# Apply migration through Supabase dashboard or CLI
```

### 4. Environment Variables
Ensure your `.env` file contains:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Development
```bash
npm run dev
```

### 6. Production Build
```bash
npm run build
```

## Accessing the Tablet Showcase

Navigate to: `https://your-domain.com/tablet`

## Customization Guide

### 1. Change Cursor Colors

Edit `AnimatedCursor.tsx`:
```tsx
// Change particle colors
className="bg-gradient-to-r from-primary to-accent"

// Change cursor border color
className="border-primary"
```

### 2. Add New Gallery Categories

Edit `TabletGallery.tsx`:
```tsx
const categories = [
  { id: 'all', label: 'All Photos' },
  { id: 'your-category', label: 'Your Category' },
  // Add more categories...
];
```

### 3. Customize QR Code Link

Edit `QRCodeDisplay.tsx`:
```tsx
const appUrl = 'https://your-app-link.com';
```

### 4. Adjust Touch Target Sizes

Edit `index.css`:
```css
.stylus-target {
  min-width: 52px;  /* Increase for larger targets */
  min-height: 52px;
}
```

### 5. Modify Animation Speed

Edit `index.css`:
```css
@keyframes slideInFromRight {
  /* Adjust duration in component or here */
}

.animate-slide-in-right {
  animation: slideInFromRight 0.3s ease-out; /* Faster */
}
```

## Adding Images to Gallery

### Method 1: Through Supabase Dashboard

1. Navigate to Supabase Dashboard
2. Select `gallery_images` table
3. Click "Insert row"
4. Fill in required fields:
   - `title`: Image title
   - `description`: Image description
   - `image_url`: Full URL to image
   - `category`: One of: clinic, team, equipment, results, events
   - `is_active`: true
   - `display_order`: Number for ordering

### Method 2: Through Admin Interface

Future enhancement: Add admin UI for image management.

### Method 3: Programmatically

```typescript
import { supabase } from './utils/supabase';

const addImage = async () => {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      title: 'New Image',
      description: 'Image description',
      image_url: 'https://example.com/image.jpg',
      category: 'clinic',
      is_active: true,
      display_order: 1
    });
};
```

## Yandex Disk Integration

To use images from Yandex Disk:

1. Upload images to Yandex Disk
2. Make folder/files public
3. Copy public link
4. Use link in `image_url` field

**Note:** Yandex Disk public links work directly as image URLs.

## Browser Compatibility

**Fully Supported:**
- Safari 14+
- Chrome 90+
- Firefox 88+
- Edge 90+

**Partial Support:**
- Older iPads may have reduced animation performance
- Stylus pressure sensitivity requires hardware support

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support for lightbox
2. **Touch Targets**: 44px minimum size
3. **Focus Indicators**: Visible focus states
4. **Screen Reader**: Semantic HTML with ARIA labels
5. **High Contrast**: Optimized for visibility

## Performance Metrics

**Target Performance:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

**Optimization Tips:**
1. Use WebP images where possible
2. Compress images to < 200KB
3. Enable CDN for image delivery
4. Use loading="lazy" for off-screen images

## Troubleshooting

### Issue: Cursor not appearing
**Solution:** Ensure you're using a device with mouse/trackpad. Touch devices won't show custom cursor.

### Issue: Gallery images not loading
**Solution:**
1. Check Supabase connection
2. Verify `gallery_images` table exists
3. Ensure images have `is_active = true`
4. Check image URLs are accessible

### Issue: QR code not generating
**Solution:**
1. Check internet connection (requires external API)
2. Verify QR Server API is accessible
3. Check browser console for errors

### Issue: Stylus input not working
**Solution:**
1. Ensure browser supports touch events
2. Check canvas initialization
3. Verify touch-action CSS is applied
4. Test with different stylus/device

## Future Enhancements

1. **Admin Panel**: Upload and manage gallery images
2. **Image Editing**: Crop, rotate, and adjust images
3. **Analytics**: Track which images get the most views
4. **Social Sharing**: Share images directly to social media
5. **Slideshow Mode**: Auto-play gallery images
6. **Video Support**: Add video content to gallery
7. **3D Touch**: Enhanced pressure sensitivity
8. **Offline Mode**: Cache images for offline viewing
9. **Multi-language**: Support for multiple languages
10. **Advanced Filters**: Search, date range, tags

## Security Best Practices

1. **Image Validation**: Validate image URLs before insertion
2. **Content Moderation**: Review user-submitted drawings
3. **Rate Limiting**: Limit API calls to prevent abuse
4. **HTTPS Only**: Always use secure connections
5. **Input Sanitization**: Sanitize all user inputs
6. **RLS Policies**: Use Supabase Row Level Security

## Support & Contact

For questions or issues:
- Email: support@zubst.ru
- Phone: +7 (961) 978-54-54
- Website: https://zubst.ru

## License

© 2024 Зубная Станция. All rights reserved.

---

**Built with:**
- React 18.3
- TypeScript 5.5
- Vite 5.4
- Tailwind CSS 3.4
- Framer Motion 11.0
- Supabase 2.39
