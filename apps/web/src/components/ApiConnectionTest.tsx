import React, { useState, useEffect } from 'react';
import { apiClient, type HealthResponse } from '../services/api';

interface ConnectionStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  data?: HealthResponse;
  error?: string;
}

/**
 * Component to test API connectivity
 * Displays connection status and test results
 */
const ApiConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Ready to test',
  });

  const testConnection = async () => {
    setConnectionStatus({
      status: 'testing',
      message: 'Testing API connection...',
    });

    try {
      const healthData = await apiClient.healthCheck();
      setConnectionStatus({
        status: 'success',
        message: '✅ API connection successful!',
        data: healthData,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setConnectionStatus({
        status: 'error',
        message: '❌ API connection failed',
        error: errorMessage,
      });
    }
  };

  // Auto-test on mount
  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'testing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-4 ${getStatusColor()}`}
      data-testid="api-connection-test"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">API Connection Test</h3>
        <button
          onClick={testConnection}
          disabled={connectionStatus.status === 'testing'}
          className="px-3 py-1 text-xs font-medium rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connectionStatus.status === 'testing' ? 'Testing...' : 'Test Again'}
        </button>
      </div>

      <p className="text-sm mb-2">{connectionStatus.message}</p>

      {connectionStatus.status === 'testing' && (
        <div className="text-xs text-gray-500 animate-pulse">
          Connecting to backend...
        </div>
      )}

      {connectionStatus.status === 'success' && connectionStatus.data && (
        <div className="mt-2 text-xs">
          <div className="font-mono bg-white/50 p-2 rounded border">
            <div>
              <strong>Status:</strong> {connectionStatus.data.status}
            </div>
            <div>
              <strong>Environment:</strong> {connectionStatus.data.environment}
            </div>
            <div>
              <strong>Timestamp:</strong> {connectionStatus.data.timestamp}
            </div>
          </div>
        </div>
      )}

      {connectionStatus.status === 'error' && connectionStatus.error && (
        <div className="mt-2 text-xs">
          <div className="font-mono bg-white/50 p-2 rounded border">
            <strong>Error:</strong> {connectionStatus.error}
          </div>
          <div className="mt-2 text-gray-600">
            <p>Make sure:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Firebase emulators are running</li>
              <li>Backend API is accessible</li>
              <li>CORS is properly configured</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;
