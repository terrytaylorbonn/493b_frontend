# Agent Chat Frontend

A Next.js frontend for the multi-tool agent chat application.

## Features

- Real-time chat interface with AI agent
- API proxy to handle CORS issues with backend
- Ready for deployment to Vercel or Render

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push this repo to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variable:
   - `BACKEND_URL`: Your backend API URL (e.g., `https://your-backend.render.com`)
4. Deploy automatically

### Render

1. Push this repo to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repo
4. Set:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment variable: `BACKEND_URL` = your backend URL
5. Deploy

## Environment Variables

- `BACKEND_URL`: The URL of your backend API (without trailing slash)

## API

The frontend includes a proxy API route at `/api/chat` that forwards requests to your backend to avoid CORS issues.

## Backend Integration

Update the `pages/api/chat.js` file to point to your deployed backend URL instead of `localhost:8000`.
