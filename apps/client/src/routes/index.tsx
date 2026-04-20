import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import LeadsPage from '@/pages/LeadsPage';
import AddLeadPage from '@/pages/AddLeadPage';
import LeadDetailPage from '@/pages/LeadDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'leads/new', element: <AddLeadPage /> },
      { path: 'leads/:id', element: <LeadDetailPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
