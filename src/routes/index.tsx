import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import WelcomeCard from '../components/WelcomeCard';
import { PageNavButtons } from '../components/PageNavButtons';

// Lazy load components
const Categories = lazy(() => import('../pages/Categories'));
const Customer = lazy(() => import('../pages/Customer'));
const POS = lazy(() => import('../pages/POS'));
const Sales = lazy(() => import('../pages/Sales'));
const Receipt = lazy(() => import('../pages/Receipt'));
const ReceiptHistory = lazy(() => import('../pages/ReceiptHistory'));
const LastReceipt = lazy(() => import('../pages/LastReceipt'));
const Products = lazy(() => import('../pages/Products'));
const Wholesalers = lazy(() => import('../pages/Wholesalers'));
const SalesHistory = lazy(() => import('../pages/SalesHistory'));
const Shop = lazy(() => import('../pages/Shop'));

// Helper component to wrap page with navigation buttons
const withPageNav = (Component: React.ComponentType) => () => (
  <>
    <Component />
    <PageNavButtons />
  </>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <WelcomeCard />,
  },
  {
    path: '/shop',
    element: <>{withPageNav(Shop)()}</>,
  },
  {
    path: '/categories',
    element: <>{withPageNav(Categories)()}</>,
  },
  {
    path: '/customers',
    element: <>{withPageNav(Customer)()}</>,
  },
  {
    path: '/pos',
    element: <>{withPageNav(POS)()}</>,
  },
  {
    path: '/sales',
    element: <>{withPageNav(Sales)()}</>,
  },
  {
    path: '/receipt',
    element: <>{withPageNav(Receipt)()}</>,
  },
  {
    path: '/receipt-history',
    element: <>{withPageNav(ReceiptHistory)()}</>,
  },
  {
    path: '/last-receipt',
    element: <>{withPageNav(LastReceipt)()}</>,
  },
  {
    path: '/products',
    element: <>{withPageNav(Products)()}</>,
  },
  {
    path: '/wholesalers',
    element: <>{withPageNav(Wholesalers)()}</>,
  },
  {
    path: '/sales-history',
    element: <>{withPageNav(SalesHistory)()}</>,
  },
];

export const pageOrder = routes
  .filter(route => route.path !== '/' && route.path !== '/settings' && route.path !== '/products' && route.path !== '/wholesalers' && route.path !== '/sales-history')
  .map(route => route.path || '');