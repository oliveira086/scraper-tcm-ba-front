import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Zap
} from 'lucide-react';
import { faker } from '@faker-js/faker';

const Monitoring = () => {
  const [crawlerInstances, setCrawlerInstances] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Generate mock crawler instances
  useEffect(() => {
    const instances = Array.from({ length: 12 }, () => ({
      id: faker.string.uuid(),
      name: `Crawler-${faker.number.int({ min: 1, max: 100 })}`,
      status: faker.helpers.arrayElement(['online', 'offline', 'error', 'maintenance']),
      location: faker.location.city(),
      cpu: faker.number.int({ min: 10, max: 95 }),
      memory: faker.number.int({ min: 20, max: 90 }),
      storage: faker.number.int({ min: 15, max: 85 }),
      uptime: faker.number.int({ min: 1, max: 720 }),
      tasksRunning: faker.number.int({ min: 0, max: 8 }),
      lastSeen: faker.date.recent(),
    }));
    setCrawlerInstances(instances);
  }, []);

  // Generate mock logs
  useEffect(() => {
    const generateLogs = () => {
      const newLogs = Array.from({ length: 50 }, () => ({
        id: faker.string.uuid(),
        timestamp: faker.date.recent().toISOString(),
        level: faker.helpers.arrayElement(['info', 'warning', 'error', 'success']),
        source: `Crawler-${faker.number.int({ min: 1, max: 100 })}`,
        message: faker.helpers.arrayElement([
          'Task execution completed successfully',
          'Connection timeout while fetching data',
          'Rate limit exceeded, retrying in 30 seconds',
          'New data pattern detected',
          'Storage quota warning: 85% used',
          'Crawler instance started',
          'Failed to parse HTML content',
          'Successfully processed 1,250 items',
        ]),
      }));
      setLogs(newLogs);
    };

    generateLogs();
    const interval = setInterval(generateLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'offline':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'maintenance':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Monitoramento em Tempo Real</h1>
        <p className="text-gray-600">Acompanhe o status e performance de todas as instâncias dos crawlers</p>
      </motion.div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Online', count: crawlerInstances.filter(c => c.status === 'online').length, color: 'green' },
          { label: 'Offline', count: crawlerInstances.filter(c => c.status === 'offline').length, color: 'gray' },
          { label: 'Com Erro', count: crawlerInstances.filter(c => c.status === 'error').length, color: 'red' },
          { label: 'Manutenção', count: crawlerInstances.filter(c => c.status === 'maintenance').length, color: 'yellow' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`h-3 w-3 rounded-full bg-${stat.color}-500`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Crawler Instances Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Instâncias dos Crawlers</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crawlerInstances.map((instance, index) => (
              <motion.div
                key={instance.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedInstance(instance)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(instance.status)}
                    <h4 className="font-medium text-gray-900">{instance.name}</h4>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(instance.status)}`}>
                    {instance.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Localização:</span>
                    <span className="text-gray-900">{instance.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Tarefas Ativas:</span>
                    <span className="text-gray-900">{instance.tasksRunning}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Uptime:</span>
                    <span className="text-gray-900">{instance.uptime}h</span>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Cpu className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-500">CPU</span>
                    </div>
                    <span className="text-gray-900">{instance.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${getUsageColor(instance.cpu)}`}
                      style={{ width: `${instance.cpu}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-500">RAM</span>
                    </div>
                    <span className="text-gray-900">{instance.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${getUsageColor(instance.memory)}`}
                      style={{ width: `${instance.memory}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Real-time Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Logs em Tempo Real</h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {logs.slice(0, 20).map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getLogLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{log.source}</span>
                  </div>
                  <p className="text-sm text-gray-600">{log.message}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Monitoring;
