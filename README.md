# MediCare Plus Pharmacy - MERN Stack Website

A full-stack, bilingual (English/Telugu) medical shop website for "MediCare Plus Pharmacy" located in Kukatpally, Hyderabad.

## Features
- **Bilingual Support**: Instant toggle between English and Telugu.
- **AI Symptom Checker**: Integrated with Google Gemini API (gemini-2.0-flash) for health guidance.
- **Prescription Upload**: Securely upload prescriptions for advance preparation.
- **Medicine Reminder**: Browser-based tool with notifications.
- **Inventory & Health Tips**: Browse medicines and read wellness articles.
- **Admin Panel**: Manage products, tips, and view submissions.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Tools**: Multer (file upload), Nodemailer (email alerts), Anthropic API.

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd MediCare
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env file based on .env.example
# Run the seed script to populate data
node seed.js
# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
# Create .env file based on .env.example (Add VITE_ANTHROPIC_API_KEY)
# Start the frontend
npm run dev
```

## Admin Access
- **Route**: `/admin`
- **Password**: `admin123`

## Note
- This is an informational website for a physical store.
- **No online payments** or **home delivery** features are included.
- For AI Symptom Checker, ensure `VITE_ANTHROPIC_API_KEY` is set in the client's `.env` file.
