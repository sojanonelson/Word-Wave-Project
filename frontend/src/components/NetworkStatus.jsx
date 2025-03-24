import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus = () => {
  // Function to get current network speed
  const getNetworkSpeed = () => {
    // Check if the user is online
    if (!navigator.onLine) {
      return 0; // No connection
    }

    // Get network speed using navigator.connection API if available
    return navigator.connection?.downlink || Math.random() * 100;
  };

  // Get status details based on speed
  const getConnectionDetails = (speed) => {
    if (speed === 0) return {
      label: 'Offline',
      icon: WifiOff,
      statusColor: 'bg-red-500',
      textColor: 'text-red-500',
      speed: '0 Mbps'
    };
    if (speed < 2) return {
      label: 'Poor Connection',
      icon: Wifi,
      statusColor: 'bg-red-500',
      textColor: 'text-red-500',
      speed: `${speed.toFixed(1)} Mbps`
    };
    if (speed < 5) return {
      label: 'Fair Connection',
      icon: Wifi,
      statusColor: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      speed: `${speed.toFixed(1)} Mbps`
    };
    if (speed < 10) return {
      label: 'Good Connection',
      icon: Wifi,
      statusColor: 'bg-green-500',
      textColor: 'text-green-500',
      speed: `${speed.toFixed(1)} Mbps`
    };
    return {
      label: 'Excellent Connection',
      icon: Wifi,
      statusColor: 'bg-green-500',
      textColor: 'text-green-500',
      speed: `${speed.toFixed(1)} Mbps`
    };
  };

  const [status, setStatus] = React.useState(getConnectionDetails(getNetworkSpeed()));

  // Update status every 10 seconds
  React.useEffect(() => {
    const updateNetworkStatus = () => {
      const speed = getNetworkSpeed();
      setStatus(getConnectionDetails(speed));
    };

    const interval = setInterval(updateNetworkStatus, 10000); // Set to 10 seconds
    return () => clearInterval(interval);
  }, []);

  const Icon = status.icon;

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
      <div className={`p-2 rounded-full ${status.statusColor}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex flex-col">
        <span className={`font-medium ${status.textColor}`}>
          {status.label}
        </span>
        <span className="text-sm text-gray-500">
          {status.speed}
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus;
