import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles.css';
import { setupWorkerIfNeeded } from './api/msw';
import { seedIfEmpty } from './db/seed';

const queryClient = new QueryClient();

async function bootstrap() {
  // Start MSW (worker) and seed DB before rendering so initial requests can succeed.
  await setupWorkerIfNeeded();
  await seedIfEmpty();

  const root = createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

bootstrap();
