import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

/**
 * Status indicator component showing backend connectivity
 * Displays a green/red orb at the top right of the page
 */
const StatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');

  const checkConnection = async () => {
    try {
      await apiClient.healthCheck();
      setStatus('connected');
    } catch (error) {
      setStatus('disconnected');
    }
  };

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Poll connection status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusTooltip = () => {
    switch (status) {
      case 'connected':
        return 'Backend connected';
      case 'disconnected':
        return 'Backend disconnected';
      case 'checking':
        return 'Checking connection...';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="relative group">
      <div
        className={`w-4 h-4 rounded-full ${getStatusColor()} shadow-lg transition-colors duration-300 cursor-pointer hover:scale-110`}
        title={getStatusTooltip()}
        aria-label={getStatusTooltip()}
        role="status"
      />
      {/* Optional: Add a pulsing animation for checking state */}
      {status === 'checking' && (
        <span className="absolute inset-0 w-4 h-4 rounded-full bg-yellow-500 animate-ping opacity-75" />
      )}
      {/* Tooltip on hover */}
      <div className="absolute top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {getStatusTooltip()}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
