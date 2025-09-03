# Business Platform - Authentication UI

A modern, responsive authentication system for a business platform that connects Investors with Idea Holders.

## Features

### Login Screen
- Clean, modern design with gradient background
- Email and password authentication
- Remember me functionality
- Forgot password link
- Smooth transitions and hover effects
- Responsive design for all devices

### Register Screen
- Role selection (Investor or Idea Holder)
- Comprehensive form with all required fields:
  - Full Name
  - Email Address (with confirmation)
  - Password (with validation)
  - Phone Numbers (primary and secondary)
  - Category selection dropdown
  - Profile image upload
- Form validation with error messages
- Professional startup theme

## Design Features

- **Modern UI**: Glassmorphism design with backdrop blur effects
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Professional Theme**: Purple to pink gradient with clean typography
- **Interactive Elements**: Hover effects, focus states, and smooth transitions
- **Accessibility**: Proper labels, focus management, and keyboard navigation

## Technology Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Modern CSS** features (backdrop-filter, gradients)
- **Responsive Design** principles

## Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   Or use the provided batch file:
   ```bash
   start-app.bat
   ```

4. Open your browser to `http://localhost:3000`

## Component Structure

- `AuthContainer.tsx` - Main container that manages Login/Register switching
- `Login.tsx` - Login form component
- `Register.tsx` - Registration form component

## Form Validation

The registration form includes comprehensive validation:
- Required field validation
- Email format validation
- Email confirmation matching
- Password strength requirements (minimum 8 characters)
- Phone number validation
- Category selection requirement

## Styling

- Uses Tailwind CSS utility classes
- Custom gradient backgrounds
- Glassmorphism effects with backdrop blur
- Responsive grid layouts
- Smooth transitions and animations
- Professional color scheme (purple/pink gradients)

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Backdrop-filter support for glassmorphism effects
- Responsive design works on all screen sizes

## Future Enhancements

- Integration with backend API
- Real-time form validation
- Social media authentication
- Two-factor authentication
- Password strength indicator
- File upload progress bar 