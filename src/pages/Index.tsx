import { Dashboard } from '@/components/dashboard/Dashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Fuel Efficiency Monitor | AI-Powered Dashboard</title>
        <meta name="description" content="Real-time AI-powered fuel efficiency monitoring system with mileage prediction, gear shift recommendations, and comprehensive vehicle telemetry." />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default Index;
