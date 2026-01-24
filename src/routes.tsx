import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/public/RegisterPage'
import LoginPage from './pages/public/LoginPage'
import GuideUtilisateur from './pages/public/GuideUtilisateur'
import { AdminLayout } from '@/layouts/admin/Layout.tsx'
import { StepSelectorMockupBuilder } from '@/pages/admin/StepSelectorMockupBuilder'
import SchemaBuilder from './pages/admin/SchemaBuilder'
import UserManager from './pages/admin/UserManager'
import DashBoard from './pages/admin/DashBoard'
import Account from './pages/admin/Account'
import ShopPage from './pages/admin/ShopPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import PicturesLibraryPage from './pages/admin/PicturesLibraryPage'
import NotFound from './pages/NotFound'
import 'bootstrap/dist/css/bootstrap.min.css' 
import './assets/css/admin.css'
import './assets/css/style.css'
import 'rsuite/TagPicker/styles/index.css'
import 'rsuite/Tag/styles/index.css'
import 'rsuite/Button/styles/index.css'
import 'rsuite/Drawer/styles/index.css'
import { ResetPassword } from './pages/public/ResetPassword'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='*' element={<NotFound />} />
        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path='/editeur-de-bon-plan' element={<StepSelectorMockupBuilder />} />
          <Route path='/createur-de-bon-plan' element={<SchemaBuilder />} />
          <Route path='/utilisateurs' element={<UserManager />} />
          <Route path='/tableau-de-bord' element={<DashBoard />}>
            <Route path='/tableau-de-bord/magasins' element={<ShopPage />} />
            <Route path='/tableau-de-bord/categories' element={<CategoriesPage />} />
            <Route path='/tableau-de-bord/phototheque' element={<PicturesLibraryPage />} />
            <Route path='/tableau-de-bord/utilisateurs' element={<UserManager />} />
          </Route>
          <Route path='/profile' element={<Account />} />
          <Route path='/guide-plv' element={<GuideUtilisateur />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
