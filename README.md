# 🌟 SalesSphere Frontend

<div align="center">
  <h3>One Platform, Infinite Sales Possibilities</h3>
  <p>A comprehensive sales management and field force automation platform built with modern web technologies.</p>
</div>

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Application Features](#application-features)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

**SalesSphere** is a modern, full-featured sales management and field force automation platform designed to streamline sales operations, track employee performance, manage customer relationships, and provide real-time analytics. The frontend application is built with React 19, TypeScript, and Vite, offering a fast, responsive, and intuitive user interface.

The platform empowers sales teams with tools for:
- Real-time employee tracking and attendance management
- Comprehensive order and inventory management
- Customer (Party) and prospect relationship management
- Beat planning and route optimization
- Advanced analytics and reporting
- Multi-site and multi-user support

---

## ✨ Key Features

### 📊 **Dashboard & Analytics**
- Comprehensive dashboard with key performance indicators (KPIs)
- Real-time sales analytics and visualization using Recharts
- Customizable reports and data exports (PDF, Excel)
- Performance trends and insights

### 👥 **Employee Management**
- Employee directory with detailed profiles
- Real-time location tracking on interactive maps
- Attendance tracking and management
- Performance monitoring and reporting

### 🗺️ **Live Tracking**
- Real-time GPS-based employee location tracking
- Interactive map interface using Leaflet and React-Leaflet
- Beat plan visualization on maps
- Historical tracking data and route replay

### 📦 **Order Management**
- Complete order lifecycle management
- Order creation, editing, and tracking
- Order status updates and notifications
- Detailed order views with customer information

### 🏢 **Party & Prospect Management**
- Comprehensive customer (Party) database
- Prospect tracking and conversion management
- Detailed party profiles with interaction history
- Site-wise customer organization

### 📍 **Beat Planning**
- Create and manage beat plans for sales routes
- Assign employees to specific beats
- Visual beat plan editor
- Beat performance tracking

### 🏭 **Site Management**
- Multi-site support for distributed operations
- Site-specific data and reporting
- Site hierarchy and organization

### 📝 **Product Management**
- Product catalog with detailed information
- Inventory tracking
- Product performance analytics

### ⚙️ **Settings & Administration**
- User preferences and configuration
- Organization settings
- Super admin panel for system-wide management
- Role-based access control

---

## 🛠️ Tech Stack

### **Frontend Core**
- **React 19.1.1** - Modern UI library with concurrent features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.1.7** - Next-generation frontend tooling with lightning-fast HMR

### **Routing & State Management**
- **React Router DOM 7.9.4** - Declarative routing for React
- **React Context API** - State management for modals and global state

### **UI Components & Styling**
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled component primitives
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Select, Separator, Slider, Tabs, Tooltip
- **Lucide React** - Beautiful & consistent icon toolkit
- **Heroicons** - Additional icon set by Tailwind Labs
- **React Icons** - Popular icon libraries collection

### **Data Visualization & Maps**
- **Recharts 3.2.1** - Composable charting library
- **Leaflet 1.9.4** - Interactive map library
- **React-Leaflet 5.0.0** - React components for Leaflet maps

### **Form Handling**
- **React Hook Form 7.55.0** - Performant form validation library

### **API & Data**
- **Axios 1.12.2** - Promise-based HTTP client
- **File-Saver 2.0.5** - Client-side file saving

### **Document Generation**
- **jsPDF 3.0.3** - PDF generation library
- **@react-pdf/renderer 4.3.1** - React components for PDF creation
- **XLSX 0.18.5** - Excel file generation and parsing

### **UI Enhancement**
- **Sonner 2.0.3** - Toast notifications
- **CMDK 1.1.1** - Command palette interface
- **Vaul 1.1.2** - Drawer component
- **Class Variance Authority** - CSS class management
- **clsx & tailwind-merge** - Utility class merging

### **Development Tools**
- **ESLint 9.36.0** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.x or higher recommended)
- **npm** (version 9.x or higher) or **yarn** (version 1.22.x or higher)
- **Git** (for version control)

You can verify your installations by running:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AsimAftab/SalesSphere-Frontend.git
   cd SalesSphere-Frontend
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   touch .env
   ```

   Add the following environment variables (adjust values as needed):

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

   See the [Environment Variables](#environment-variables) section for more details.

---

## 🏃 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized production build will be created in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

---

## 📁 Project Structure

```
SalesSphere-Frontend/
├── public/                      # Static assets
│   └── vite.svg
├── src/
│   ├── api/                     # API service layer
│   │   ├── api.ts               # Axios instance with interceptors
│   │   ├── analyticsService.ts  # Analytics API calls
│   │   ├── attendanceService.ts # Attendance management
│   │   ├── authService.ts       # Authentication services
│   │   ├── beatPlanService.ts   # Beat planning APIs
│   │   ├── dashboardService.ts  # Dashboard data APIs
│   │   ├── liveTrackingService.ts # Real-time tracking
│   │   ├── orderService.ts      # Order management
│   │   ├── organizationService.ts # Organization APIs
│   │   ├── partyService.ts      # Party/Customer APIs
│   │   ├── productService.ts    # Product management
│   │   ├── prospectService.ts   # Prospect management
│   │   ├── settingService.ts    # Settings APIs
│   │   └── siteService.ts       # Site management
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable UI components
│   │   ├── UI/                  # Basic UI components
│   │   ├── cards/               # Card components
│   │   ├── layout/              # Layout components (Navbar, Footer)
│   │   ├── maps/                # Map-related components
│   │   ├── modals/              # Modal dialogs
│   │   ├── sections/            # Page sections
│   │   └── uix/                 # UI/UX components
│   ├── context/                 # React Context providers
│   │   └── ModalContext.tsx     # Modal state management
│   ├── Pages/                   # Page components (routes)
│   │   ├── AnalyticsPage/
│   │   ├── AttendancePage/
│   │   ├── BeatPlanPage/
│   │   ├── CreateBeatPlanPage/
│   │   ├── DashboardPage/
│   │   ├── EditBeatPlanPage/
│   │   ├── EmployeeDetailsPage/
│   │   ├── EmployeePage/
│   │   ├── HomePage/
│   │   ├── LiveTrackingPage/
│   │   ├── LoginPage/
│   │   ├── OrderDetailsPage/
│   │   ├── OrderListPage/
│   │   ├── PartyDetailsPage/
│   │   ├── PartyPage/
│   │   ├── Products/
│   │   ├── ProspectDetailsPage/
│   │   ├── ProspectPage/
│   │   ├── SettingPage/
│   │   ├── SiteDetailsPage/
│   │   ├── SitePage/
│   │   └── SuperAdminPage.tsx
│   ├── types/                   # TypeScript type definitions
│   ├── App.tsx                  # Main App component with routing
│   ├── App.css                  # App-level styles
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── .env                         # Environment variables (not in repo)
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TypeScript config
├── tsconfig.node.json           # Node-specific TypeScript config
└── vite.config.ts               # Vite configuration
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Compiles TypeScript and builds for production |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run preview` | Previews the production build locally |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Add other environment-specific variables as needed
# VITE_MAP_API_KEY=your_map_api_key_here
# VITE_ANALYTICS_ID=your_analytics_id_here
```

**Note:** All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client-side code.

### Important Environment Variable Notes:

- **Never commit `.env` files** with sensitive data to version control
- Use different `.env` files for different environments (development, staging, production)
- The `.env` file is already added to `.gitignore` for security

---

## 🎨 Application Features

### **Authentication & Authorization**
- Secure JWT-based authentication
- Token management with automatic injection in API requests
- Protected routes with role-based access control

### **Responsive Design**
- Mobile-first approach
- Fully responsive across all device sizes
- Touch-optimized UI components

### **Real-time Updates**
- Live employee location tracking
- Real-time notifications using Sonner
- Dynamic data updates

### **Data Export & Reporting**
- Export data to PDF format
- Export data to Excel (.xlsx) format
- Customizable report generation
- Print-friendly layouts

### **Interactive Maps**
- Interactive maps powered by Leaflet
- Real-time location markers
- Route visualization
- Geofencing capabilities

### **Rich UI Components**
- Accessible components using Radix UI
- Custom-styled with Tailwind CSS
- Consistent design system
- Dark mode support (if implemented)

---

## 🔌 API Integration

The application uses Axios for HTTP requests with a centralized API configuration:

### **API Setup**

All API calls go through the `src/api/api.ts` file, which:
- Sets the base URL from environment variables
- Automatically adds JWT tokens to requests
- Handles request/response interceptors
- Manages error handling

### **API Services**

Each feature has its dedicated service file:
- `authService.ts` - Login, logout, user authentication
- `dashboardService.ts` - Dashboard data and KPIs
- `employeeService.ts` - Employee CRUD operations
- `orderService.ts` - Order management
- `partyService.ts` - Customer management
- And more...

### **Making API Calls**

Example of an API call:

```typescript
import api from './api';

// GET request
const fetchEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

// POST request
const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
```

---

## 🤝 Contributing

We welcome contributions to SalesSphere Frontend! Here's how you can help:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### **Code Style Guidelines**

- Use TypeScript for type safety
- Follow React best practices and hooks rules
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Write self-documenting code
- Add TypeScript types/interfaces for props

### **Commit Message Guidelines**

Follow conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👥 Team

Developed and maintained by the SalesSphere development team.

---

## 📞 Support

For support, questions, or feedback:
- Open an issue on GitHub
- Contact the development team

---

## 🙏 Acknowledgments

- React Team for the amazing React library
- Vite Team for the blazing-fast build tool
- Tailwind Labs for Tailwind CSS and Heroicons
- Radix UI for accessible component primitives
- All open-source contributors

---

<div align="center">
  <p>Made with ❤️ by the SalesSphere Team</p>
  <p>⭐ Star us on GitHub if you find this project useful!</p>
</div>
