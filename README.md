# Ontario Parks Website 🌲

A comprehensive camping and park reservation website designed specifically for first-time campers and newcomers to Ontario. Built with pure HTML, CSS, and JavaScript for maximum compatibility and performance.

## 🎯 **Project Overview**

This website provides a complete digital experience for discovering, planning, and booking camping experiences in Ontario Parks. The design focuses on accessibility, ease-of-use, and comprehensive guidance for first-time outdoor enthusiasts.

## 📋 **Pages & Features**

### **🏠 Homepage** (`index.html`)
- **Hero Section**: Welcoming introduction with carousel navigation
- **Featured Parks**: Handpicked beginner-friendly parks with amenities
- **Key Features**: Offline maps, cultural guides, family activities, simplified booking
- **Newsletter Signup**: Multi-language support mentioned

### **🗺️ Park Discovery** (`all-parks.html`)
- **Advanced Search**: Filter by amenities, activities, difficulty level
- **12 Park Grid**: Comprehensive park listings with details
- **Interactive Filters**: Real-time filtering and search functionality
- **Responsive Design**: Optimized for all device sizes

### **📍 Park Details** (`park-details.html`)
- **Photo Carousel**: Multiple park images with navigation
- **Interactive Map**: Clickable campground locations
- **Comprehensive Info**: Activities, amenities, campground details
- **Direct Booking**: Seamless transition to reservation system

### **📅 Booking System**
#### Main Booking (`booking.html`)
- **Date Selection**: Calendar-based date picker
- **Campsite Search**: Real-time availability checking
- **Map Integration**: Visual campsite selection
- **Filter Options**: By amenities, size, accessibility

#### Campsite Details (`booking-campsite.html`)
- **Site Selection**: Individual campsite cards with details
- **Reservation Modal**: Complete booking form
- **Pricing Calculator**: Real-time cost calculation
- **Guest Management**: Party size and vehicle tracking

### **⚠️ Safety & Alerts** (`acknowledge.html`)
- **Park Alerts Modal**: Important safety information
- **Acknowledgment System**: Required safety confirmations
- **Campsite Summary**: Booking confirmation display

### **📝 Reservation Review Flow**
#### Customer Details (`review-reservation-customer.html`)
- **Personal Information**: Complete contact form
- **Address Management**: Full address collection
- **Form Validation**: Real-time input validation
- **Data Persistence**: Local storage integration

#### Shopping Cart (`review-reservation-cart.html`)
- **Reservation Summary**: Complete booking details
- **Pricing Breakdown**: Itemized cost calculation
- **Modification Options**: Edit booking capabilities
- **Progress Tracking**: Clear workflow indication

#### Final Review (`review-reservation-final.html`)
- **Complete Summary**: All reservation details
- **Terms & Conditions**: Extensive legal requirements
- **Final Confirmation**: Secure booking completion
- **Confirmation System**: Booking number generation

### **🎒 Gear Planning**
#### Basic Guide (`gear-list.html`)
- **Shelter & Sleep**: Essential camping gear category
- **Interactive Items**: Clickable gear with descriptions
- **Checklist Mode**: Personal gear tracking

#### Complete Guide (`gear-list-complete.html`)
- **6 Categories**: Shelter, Hiking, Fishing, Winter, Biking, Birding
- **24 Total Items**: Comprehensive gear recommendations
- **Search Functionality**: Find specific gear quickly
- **Export Options**: Download personal checklists

## 🛠️ **Technical Implementation**

### **Frontend Stack**
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with Grid, Flexbox, animations
- **JavaScript ES6+**: Interactive functionality and state management
- **No Frameworks**: Pure web technologies for maximum compatibility

### **Key Technologies**
- **Responsive Design**: Mobile-first approach
- **CSS Grid & Flexbox**: Modern layout systems
- **Local Storage**: Client-side data persistence
- **Form Validation**: Real-time input validation
- **Modal Systems**: Interactive overlays and confirmations
- **State Management**: Cross-page data flow

### **Performance Features**
- **Optimized Images**: Placeholder system for fast loading
- **Efficient CSS**: Modular stylesheets for specific pages
- **Progressive Enhancement**: Works without JavaScript
- **Cached Data**: Local storage for improved UX

## 📁 **File Structure**

```
ontario-parks/
├── index.html                          # Homepage
├── all-parks.html                      # Park discovery
├── park-details.html                   # Park information
├── booking.html                        # Booking search
├── booking-campsite.html               # Campsite selection
├── acknowledge.html                    # Safety alerts
├── review-reservation-customer.html    # Customer form
├── review-reservation-cart.html        # Shopping cart
├── review-reservation-final.html       # Final review
├── gear-list.html                      # Basic gear guide
├── gear-list-complete.html             # Complete gear guide
├── css/
│   ├── styles.css                      # Base styles
│   ├── all-parks.css                   # Park listing styles
│   ├── park-details.css                # Park detail styles
│   ├── booking.css                     # Booking styles
│   ├── booking-campsite.css            # Campsite styles
│   ├── acknowledge.css                 # Alerts styles
│   ├── review-reservation.css          # Review flow styles
│   └── gear-list.css                   # Gear guide styles
├── js/
│   ├── script.js                       # Homepage functionality
│   ├── all-parks.js                    # Search and filtering
│   ├── park-details.js                 # Park interactions
│   ├── booking.js                      # Booking functionality
│   ├── booking-campsite.js             # Site selection
│   ├── acknowledge.js                  # Alert system
│   ├── review-reservation.js           # Review workflow
│   └── gear-list.js                    # Gear checklist
├── SITE_MAP.md                         # Complete navigation map
└── README.md                           # This file
```

## 🚀 **Getting Started**

### **Local Development**
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ontario-parks
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 3000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:3000
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Production Deployment**
- **Static Hosting**: Deploy to Netlify, Vercel, GitHub Pages
- **Web Server**: Upload to any web hosting service
- **CDN**: Distribute via content delivery network

## 🎨 **Design System**

### **Color Palette**
- **Primary Green**: `#2c5530` (Ontario Parks brand)
- **Secondary Green**: `#3a6b3f` (Gradient accent)
- **Purple**: `#5b21b6` (Call-to-action buttons)
- **Grays**: `#f9fafb`, `#e5e7eb`, `#374151` (Backgrounds, borders)

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales from mobile to desktop

### **Components**
- **Buttons**: Primary, secondary, disabled states
- **Cards**: Park cards, gear items, campsite options
- **Forms**: Input fields, dropdowns, validation states
- **Modals**: Overlays for alerts, confirmations, details

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### **Mobile Optimizations**
- Touch-friendly buttons (44px minimum)
- Simplified navigation patterns
- Optimized form layouts
- Compressed content spacing

## ♿ **Accessibility Features**

### **WCAG 2.1 Compliance**
- **Keyboard Navigation**: Full site accessible via keyboard
- **Screen Readers**: Semantic HTML and ARIA labels
- **Color Contrast**: AAA contrast ratios
- **Focus Indicators**: Clear focus states

### **Inclusive Design**
- **Multi-language Support**: Mentioned for newcomers
- **Simple Language**: Clear, beginner-friendly content
- **Visual Hierarchy**: Logical content organization
- **Alternative Text**: Descriptive image alternatives

## 🔄 **User Workflows**

### **Complete Booking Journey**
1. **Discover** → Homepage → All Parks
2. **Research** → Park Details → Activities & Amenities
3. **Plan** → Gear Guide → Create Checklist
4. **Book** → Search Campsites → Select Site
5. **Confirm** → Safety Alerts → Customer Details
6. **Review** → Shopping Cart → Final Confirmation
7. **Receive** → Confirmation Email → Prepare for Trip

### **Gear Planning Journey**
1. **Browse** → Gear Categories → Item Details
2. **Select** → Add to Checklist → Export List
3. **Shop** → External retailers → Prepare for Trip

## 🧪 **Testing Strategy**

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Device Testing**
- ✅ iOS Safari (iPhone/iPad)
- ✅ Android Chrome
- ✅ Desktop browsers
- ✅ Tablet landscape/portrait

### **Performance Metrics**
- ⚡ First Contentful Paint < 2s
- ⚡ Largest Contentful Paint < 3s
- ⚡ Cumulative Layout Shift < 0.1
- ⚡ First Input Delay < 100ms

## 🔧 **Configuration**

### **Local Storage Keys**
- `customerData`: Customer form information
- `reservationData`: Booking details and pricing
- `gearChecklist`: Selected gear items
- `selectedGearCategory`: Active filter state

### **Customization Options**
- **Colors**: Update CSS custom properties
- **Content**: Modify HTML content directly
- **Features**: Enable/disable JavaScript modules
- **Layout**: Adjust CSS Grid/Flexbox layouts

## 📈 **Future Enhancements**

### **Phase 2 Features**
- [ ] **Real API Integration**: Connect to actual Ontario Parks data
- [ ] **Payment Processing**: Secure payment gateway
- [ ] **User Accounts**: Login system and saved preferences
- [ ] **Real-time Availability**: Live campsite availability

### **Phase 3 Features**
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Offline Support**: Service worker for offline functionality
- [ ] **Advanced Maps**: GPS integration and trail tracking
- [ ] **Social Features**: Reviews, photos, community

## 🤝 **Contributing**

### **Development Guidelines**
1. **Code Style**: Follow existing HTML/CSS/JS patterns
2. **Accessibility**: Maintain WCAG 2.1 compliance
3. **Performance**: Keep bundle sizes minimal
4. **Testing**: Test across multiple devices/browsers

### **Submission Process**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is created for educational and demonstration purposes. All content and design elements are original or used under appropriate licenses.

## 📞 **Contact**

For questions, suggestions, or contributions:
- **Project Lead**: [Your Name]
- **Email**: [your-email@domain.com]
- **Repository**: [GitHub repository URL]

---

**Made with 💚 for Ontario's outdoor enthusiasts**