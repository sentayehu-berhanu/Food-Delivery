import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import { LocationProvider } from './context/LocationContext'
import { WalletProvider } from './context/WalletContext'
import { GroupOrderProvider } from './context/GroupOrderContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <LocationProvider>
            <CartProvider>
              <GroupOrderProvider>
                <SubscriptionProvider>
                  <WalletProvider>
                    <ThemeProvider>
                      <App />
                      <ToastContainer />
                    </ThemeProvider>
                  </WalletProvider>
                </SubscriptionProvider>
              </GroupOrderProvider>
            </CartProvider>
          </LocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
