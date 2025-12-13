# M&A Stump Grinding Website

A modern, professional website for M&A Stump Grinding featuring a portfolio management system.

## Features

- **Home Page**: Services overview, customer reviews, and contact information
- **Portfolio Page**: Gallery of before/after images and standalone project photos/videos
- **Admin Panel**: Upload and manage portfolio items
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **File Upload**: Multer

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

### Running the Application

1. **Start the Backend Server** (Terminal 1)
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server** (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Project Structure

```
mna-stump/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── index.js        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── backend/
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded files (created automatically)
│   ├── server.js           # Express server
│   └── package.json
└── README.md
```

## Configuration

### Update Contact Information

Edit the following files to update contact details:
- `frontend/src/components/Hero.jsx` - Phone number and email
- `frontend/src/components/Contact.jsx` - Contact information
- `frontend/src/components/Header.jsx` - Phone number in header

### Add Logo

Place your logo file as `frontend/public/logo.png`

### Google Reviews

To embed Google Reviews:
1. Go to your Google Business Profile
2. Get the embed code
3. Replace the placeholder in `frontend/src/components/Reviews.jsx`

## Admin Access

Visit `http://localhost:3000/admin` to upload portfolio items.

You can upload:
- Standalone images or videos
- Before/after image pairs

## API Endpoints

- `GET /api/portfolio` - Get all portfolio items
- `POST /api/portfolio/upload` - Upload standalone image/video
- `POST /api/portfolio/upload-before-after` - Upload before/after images
- `DELETE /api/portfolio/:id` - Delete portfolio item

## Notes

- Portfolio data is stored in `backend/portfolio.json` (can be upgraded to a database later)
- Uploaded files are stored in `backend/uploads/`
- The backend creates necessary directories automatically

