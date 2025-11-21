# Vynspire Blogs - Blogging Platform

A modern, responsive blogging platform built with React, TypeScript, and Vite. Create, edit, and manage your blog posts with a beautiful dark-themed UI and seamless user experience.

**Created by Bishal Bhatta**

## 🌟 Features

- **User Authentication**: Secure login and registration system
- **Blog Management**: Create, read, update, and delete blog posts
- **Rich Text Editor**: React Quill editor for creating formatted content
- **Image Upload**: Upload and preview featured images for posts
- **Category Management**: Organize posts with categories and create new ones
- **Search & Filter**: Search posts by title, content, or category
- **Pagination**: Navigate through blog posts efficiently
- **Responsive Design**: Fully responsive design with mobile hamburger menu
- **Dark Theme**: Beautiful gradient dark theme with glassmorphism effects

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-blog-hub-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar with mobile menu
│   ├── BlogSection.tsx # Blog listing with search/filter
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
│   ├── Index.tsx       # Home page with hero section
│   ├── Auth.tsx        # Login/Signup page
│   ├── Dashboard.tsx   # User dashboard
│   ├── CreatePost.tsx  # Create new blog post
│   └── EditPost.tsx    # Edit existing blog post
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   └── usePosts.tsx    # Blog post management
├── store/              # Redux store
│   ├── index.ts        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.ts    # Authentication state
│       └── postsSlice.ts   # Posts state
└── utils/              # Utility functions
    ├── mockStorage.ts  # LocalStorage-based mock API
    └── api.ts          # API configuration
```

## 🔐 Authentication System

### How Authentication Works

The application uses a **mock authentication system** that stores user data in browser localStorage. This is perfect for development and prototyping.

#### Registration Process

1. User fills out the registration form with:
   - Email address
   - Password
   - Full Name
   - Confirm Password

2. The system:
   - Validates the form (email format, password match)
   - Checks if the email already exists
   - Creates a new user in localStorage
   - Generates a mock JWT token
   - Stores user data and token in localStorage
   - Redirects to the dashboard

#### Login Process

1. User enters email and password
2. The system:
   - Validates credentials against stored users
   - Generates a mock JWT token
   - Stores authentication data in localStorage
   - Redirects to the dashboard

#### Default Demo Account

For testing purposes, a default user is created:
- **Email**: `demo@example.com`
- **Password**: `demo123`

#### Authentication State Management

- Uses Redux Toolkit for state management
- Token and user data stored in localStorage
- Protected routes check authentication status
- Automatic logout on token expiration (handled by interceptors)

## 📡 API System

### Mock API Architecture

The application uses a **localStorage-based mock API** instead of a real backend. This allows the app to work completely offline and doesn't require any server setup.

#### How API Calls Work

1. **Data Storage**: All data (users, posts) is stored in browser localStorage
2. **API Simulation**: The `mockStorage.ts` utility simulates API calls with delays
3. **State Management**: Redux handles all data operations
4. **Persistence**: Data persists across browser sessions

#### API Operations

**Posts API:**
- `getPosts()` - Fetch all posts
- `addPost()` - Create a new post
- `updatePost()` - Update existing post
- `deletePost()` - Delete a post
- `getPostById()` - Get single post

**Users API:**
- `getUsers()` - Fetch all users
- `findUserByEmail()` - Find user by email
- `findUserById()` - Find user by ID
- `addUser()` - Create new user

#### Data Structure

**Post Structure:**
```typescript
{
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  image: string | null;      // Base64 encoded image
  category: string | null;
}
```

**User Structure:**
```typescript
{
  id: string;
  email: string;
  password: string;          // Plain text (mock only)
  full_name: string | null;
  created_at: string;
}
```

## ✍️ How to Post a Blog

### Creating a New Blog Post

1. **Navigate to Create Post**
   - If authenticated, click "Create Blog" in the navbar
   - Or go to `/create` route
   - Or click "Write a Post" button on the dashboard

2. **Fill Out the Form**
   - **Title** (required): Enter your blog post title (max 200 characters)
   - **Excerpt** (optional): Brief summary of your post (max 300 characters)
   - **Category** (required): Select from existing categories or create a new one
   - **Featured Image** (required): Upload an image file (max 5MB)
     - Click the upload area or drag and drop
     - Preview appears immediately
     - Image is converted to base64 and stored
   - **Content** (required): Use the rich text editor to write your post
     - Formatting options: headers, bold, italic, lists, links, images
     - Minimum height: 400px for comfortable writing

3. **Publish**
   - Click "Publish Post" button
   - Post is saved to localStorage
   - You're redirected to the dashboard
   - Success notification appears

### Editing a Blog Post

1. **Access Edit Page**
   - Go to Dashboard
   - Click "Edit" button on any of your posts
   - Or navigate to `/edit/{post-id}`

2. **Modify Content**
   - All fields are pre-filled with existing data
   - Make your changes
   - Upload a new image if needed

3. **Save Changes**
   - Click "Save Changes"
   - Post is updated in localStorage
   - Redirected to dashboard

### Deleting a Blog Post

1. **From Dashboard**
   - Click the trash icon on any post card
   - Confirm deletion in the popup dialog
   - Post is permanently removed

## 📍 Where Blogs Appear

### Home Page (`/`)

The home page displays all published blog posts in the **Blog Section** below the hero section.

**Features:**
- **Search Bar**: Search posts by title, excerpt, or category
- **Category Filters**: Filter posts by category
  - Categories are dynamically generated from actual posts
  - "All Articles" shows all posts
- **Blog Grid**: Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Pagination**: Navigate through pages (6 posts per page)
- **Post Cards**: Each card shows:
  - Featured image
  - Category badge
  - Post title
  - Publication date
  - Excerpt/preview

### Dashboard (`/dashboard`)

The dashboard shows **only your own posts** (filtered by `author_id`).

**Features:**
- Grid layout of your posts
- Quick actions: Edit and Delete buttons
- "Create Your First Post" message if no posts exist
- Post cards with title, date, and excerpt

### Blog Data Flow

1. **Creation**: Post created → Stored in localStorage → Available immediately
2. **Display**: Posts fetched from localStorage → Displayed on home page and dashboard
3. **Filtering**: Client-side filtering by category and search query
4. **Pagination**: Client-side pagination for better performance

## 🎨 Design System

### Color Scheme

- **Primary Background**: Dark purple gradient (`#1a0b2e` → `#2d1b4e`)
- **Glassmorphism**: White/10 opacity with backdrop blur
- **Accents**: Blue borders (`#blue-400`), Red for delete actions
- **Text**: White with varying opacity levels

### Typography

- **Headings**: Urbanist font family
- **Body Text**: Poppins font family
- **Sizes**: Responsive typography scales

### Components

- **Cards**: Glassmorphism effect with rounded corners
- **Buttons**: Multiple variants (default, outline, destructive)
- **Forms**: Consistent styling with validation states
- **Navigation**: Fixed navbar with mobile hamburger menu

## 🔧 Technology Stack

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Yup validation
- **Rich Text Editor**: React Quill
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Notifications**: Sonner (toast notifications)
- **Styling**: Tailwind CSS

## 📱 Responsive Design

### Mobile Features

- **Hamburger Menu**: Slide-out menu for navigation
- **Icon-Only Buttons**: Space-saving design on small screens
- **Smaller Logo**: Reduced size for mobile
- **Touch-Friendly**: Large tap targets and spacing
- **Responsive Grid**: Adapts to screen size

### Breakpoints

- **Mobile**: < 768px (md breakpoint)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🛡️ Protected Routes

Certain routes require authentication:

- `/dashboard` - User dashboard
- `/create` - Create new post
- `/edit/:id` - Edit existing post

Unauthenticated users are redirected to `/auth` when accessing protected routes.

## 📝 Notes

### Development vs Production

- **Current Setup**: Uses mock API (localStorage)
- **Production Ready**: Can be easily migrated to a real backend
- **Data Persistence**: Data persists in browser localStorage
- **No Backend Required**: Works completely offline

### Future Enhancements

- Real backend API integration
- User profile pages
- Comments system
- Image upload to cloud storage
- Social sharing
- SEO optimization
- Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Posts not appearing:**
- Check browser localStorage
- Clear localStorage and create new posts
- Verify you're logged in

**Images not uploading:**
- Check file size (max 5MB)
- Ensure file is an image format
- Check browser console for errors

**Authentication issues:**
- Clear localStorage
- Use demo account: `demo@example.com` / `demo123`
- Check browser console for errors

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Built by Bishal Bhatta**

**Technologies**: React, TypeScript, and Vite
