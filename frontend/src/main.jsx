import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)



