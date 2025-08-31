import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  Zap,
  Settings,
  Play,
  Pause,
  X,
  Eye,
  FileArchiveIcon,
  ArchiveIcon,
  CheckCircle2,
  CircleXIcon
} from 'lucide-react';

import { getAllCrawlers, editCrawler, pauseCrawler, gerarzip } from '../services/crawlerServices'

const CrawlerList = () => {
  const [crawlerInstances, setCrawlerInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showInformationsModal, setShowInformationsModal] = useState(false);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [cidade, setCidade] = useState('');
  const [codigoMunicipio, setCodigoMunicipio] = useState('');
  const [codigoEntidade, setCodigoEntidade] = useState('');
  const [nomeEntidade, setNomeEntidade] = useState('');
  const [paginaInicial, setPaginaInicial] = useState(0);
  const [paginaFinal, setPaginaFinal] = useState(0);
  const [ano, setAno] = useState(0);
  const [cookieSession, setCookieSession] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [userSessionToken, setUserSessionToken] = useState('');

  const [crawlerInformations, setCrawlerInformations] = useState('');

  useEffect(() => {
    (async () => {
      const data = await getAllCrawlers()
      console.log(data)
      setCrawlerInstances(data);
    })()

    
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

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredCrawlers = crawlerInstances.filter(crawler => {
    const matchesSearch = crawler.name.toLowerCase().includes(searchTerm.toLowerCase()) || crawler.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || crawler.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async () => {
    try {

      await editCrawler({
        id: id,
        name: name,
        cidade: cidade,
        codigo_municipio: codigoMunicipio,
        codigo_entidade: codigoEntidade,
        nome_entidade: nomeEntidade,
        ano: ano,
        pagina_inicial: paginaInicial,
        pagina_final: paginaFinal,
        cookie_session: cookieSession,
        session_token: sessionToken,
        user_session_token: userSessionToken
    });

    window.location.reload();
      
    } catch (error) {
      console.error(error)
    }
  };

  const pauseCrawlerInstance = async (crawler) => {
    try {
      await pauseCrawler({ id: crawler.id, pause: crawler.pause })
      window.location.reload();
    } catch (error) {
      console.error(error)
    }
  }

  const generateZipHandler = async (crawler) => {
    try {
      await gerarzip({ id: crawler.id })
      window.location.reload();
    } catch (error) {
      console.error(error)
    }
  }

  const openModal = (params) => {
    try {
      setShowConfigModal(true);

      setId(params.id);
      setName(params.name);
      setCidade(params.cidade);
      setCodigoMunicipio(params.codigo_municipio);
      setCodigoEntidade(params.codigo_entidade);
      setNomeEntidade(params.nome_entidade);
      setPaginaInicial(parseInt(params.pagina_inicial));
      setPaginaFinal(parseInt(params.pagina_final));
      setAno(parseInt(params.ano));
      setCookieSession(params.cookie_session);
      setSessionToken(params.session_token);
      setUserSessionToken(params.user_session_token);
    } catch (error) {
      console.error(error);
    }
  };

  const openInformationsModal = (params) => {
    setShowInformationsModal(true);
    setCrawlerInformations(params)
  }

  const statusCounts = {
    online: crawlerInstances.filter(c => c.status === 'online').length,
    offline: crawlerInstances.filter(c => c.status === 'offline').length,
    error: crawlerInstances.filter(c => c.status === 'error').length,
    maintenance: crawlerInstances.filter(c => c.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Crawlers</h1>
            <p className="text-gray-600">Gerencie e monitore todas as instâncias dos seus crawlers</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Online', count: statusCounts.online, color: 'green', icon: CheckCircle },
          { label: 'Offline', count: statusCounts.offline, color: 'gray', icon: XCircle },
          { label: 'Com Erro', count: statusCounts.error, color: 'red', icon: AlertTriangle },
          { label: 'Manutenção', count: statusCounts.maintenance, color: 'yellow', icon: Clock },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
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
                <div className={`h-12 w-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar crawlers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="error">Com Erro</option>
              <option value="maintenance">Manutenção</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Crawler Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredCrawlers.map((crawler, index) => (
          <motion.div
            key={crawler.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white border ${(crawler.pagina_final - crawler.pagina_atual) == 0 ? 'border-red-500' : 'border-gray-200'}  rounded-lg p-6 hover:shadow-lg transition-all duration-200`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(crawler.status)}
                <h3 className="font-semibold text-gray-900">{crawler.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(crawler.status)}`}>
                {crawler.status}
              </span>
            </div>

            {/* Basic Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Prefeitura</span>
                <span className="text-gray-900">{crawler.cidade}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Ano</span>
                <span className="text-gray-900">{crawler.ano}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Pagina Atual</span>
                <span className="text-gray-900">{crawler.pagina_atual}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Paginas faltantes:</span>
                <span className="text-gray-900">{crawler.pagina_final - crawler.pagina_atual}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Quantidade de páginas:</span>
                <span className="text-gray-900">{(crawler.pagina_final - crawler.pagina_inicial )+1}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Quantidade de arquivos:</span>
                <span className="text-gray-900">{crawler.files_consolidateds.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Dados:</span>
                <span className="text-gray-900">{Number(crawler.gbs).toFixed(2)} MB</span>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center space-x-1">
                    <Cpu className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500">CPU</span>
                  </div>
                  <span className="text-gray-900">{crawler.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getUsageColor(crawler.cpu)}`}
                    style={{ width: `${crawler.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500">RAM</span>
                  </div>
                  <span className="text-gray-900">{crawler.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getUsageColor(crawler.memory)}`}
                    style={{ width: `${crawler.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-gray-100">
              <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600
              hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" onClick={() => openInformationsModal(crawler)}>
                <Eye className="h-3 w-3" />
                <span>Visualizar</span>
              </button>
              {
                crawler.pause == 'true'
                ?
                  <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => pauseCrawlerInstance(crawler)}
                  >
                    <Play className="h-3 w-3" />
                    <span>Iniciar</span>
                  </button>
                :
                  <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                    onClick={() => pauseCrawlerInstance(crawler)}
                  >
                    <Pause className="h-3 w-3" />
                    <span>Pausar</span>
                  </button>
              }
              
              <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600
              hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => openModal(crawler)}>
                <Settings className="h-3 w-3" />
                <span>Configurar</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowConfigModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Configurar Crawler</h2>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Configuration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuração Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Crawler *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Crawler-Production-01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: São Paulo, Brasil"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Codigo cidade *
                      </label>
                      <input
                        type="text"
                        value={codigoMunicipio}
                        onChange={(e) => setCodigoMunicipio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="00000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Entidade *
                      </label>
                      <input
                        type="text"
                        value={nomeEntidade}
                        onChange={(e) => setNomeEntidade(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Prefeitura Municipal de enfim"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Codigo Entidade *
                      </label>
                      <input
                        type="text"
                        value={codigoEntidade}
                        onChange={(e) => setCodigoEntidade(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="111"
                      />
                    </div>

 
                  </div>
                </div>

                {/* Advanced Configuration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuração Avançada</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pagina Inicial *
                      </label>
                      <input
                        type="number"
                        value={paginaInicial}
                        onChange={(e) => setPaginaInicial(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pagina Final *
                      </label>
                      <input
                        type="number"
                        value={paginaFinal}
                        onChange={(e) => setPaginaFinal(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano a ser processado *
                      </label>
                      <input
                        type="number"
                        value={ano}
                        onChange={(e) => setAno(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuração de Sessão</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cookie Session *
                      </label>
                      <input
                        type="text"
                        value={cookieSession}
                        onChange={(e) => setCookieSession(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Token *
                      </label>
                      <input
                        type="text"
                        value={sessionToken}
                        onChange={(e) => setSessionToken(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User session token *
                      </label>
                      <input
                        type="text"
                        value={userSessionToken}
                        onChange={(e) => setUserSessionToken(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={() => handleSubmit()} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Salvar</span>
                  </button>


                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInformationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowInformationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Informações do Crawler</h2>
                {
                  crawlerInformations.send_file == "false" && crawlerInformations.pause == "true" ?
                  <button onClick={() => generateZipHandler(crawlerInformations)}
                   className='w-56 p-2 bg-green-400 rounded-md text-white shadow-xl'>Gerar zip</button>
                  :
                  <></>
                }
                


                <button
                  onClick={() => setShowInformationsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className='p-6 border-b border-gray-200'>
                <span>Dados do Crawler</span>
                <div className='flex flex-grow gap-x-2 mt-4'>
                  <div className='flex flex-col w-auto h-auto bg-gray-100 rounded-md p-2'>
                    <span className='text-sm font-semibold'>Cidade</span>
                    <span className='text-sm'>{crawlerInformations.cidade}</span>
                  </div>

                  <div className='flex flex-col w-auto h-auto bg-gray-100 rounded-md p-2'>
                    <span className='text-sm font-semibold'>Entidade</span>
                    <span className='text-sm'>{crawlerInformations.nome_entidade}</span>
                  </div>
                </div>

                <div className='flex flex-grow mt-2 gap-x-2'>
                  <div className='flex flex-col w-36 h-auto bg-gray-100 rounded-md p-2'>
                    <span className='text-sm font-semibold'>Pagina Inicial</span>
                    <span className='text-sm'>{crawlerInformations.pagina_inicial}</span>
                  </div>

                  <div className='flex flex-col w-36 h-auto bg-gray-100 rounded-md p-2'>
                    <span className='text-sm font-semibold'>Pagina Final</span>
                    <span className='text-sm'>{crawlerInformations.pagina_final}</span>
                  </div>

                  <div className='flex flex-col w-36 h-auto bg-gray-100 rounded-md p-2'>
                    <span className='text-sm font-semibold'>Ano</span>
                    <span className='text-sm'>{crawlerInformations.ano}</span>
                  </div>
                </div>
              </div>
              <div className='p-6 border-b border-gray-200'>
                <span>Arquivos Gerados (Armazenados Localmente)</span>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6 max-h-56 overflow-auto"
                >
                  {
                    crawlerInformations.files_consolidateds.map(file => {
                      return (
                        <div className='flex w-auto h-auto bg-gray-100 p-2 rounded-md'>
                          <FileArchiveIcon />
                          <span className='ml-4 text-sm'>{String(file.name).replace('-consolidated.json', '')}</span>
                        </div>
                      )
                    })
                  }

                </motion.div>
              </div>

              <div className='p-6'>
                <span>Processamento das páginas</span>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6 max-h-56 overflow-auto'>
                  {
                    crawlerInformations.paginas.map(page => {
                      return (
                        <div className='flex w-auto h-auto bg-gray-100 p-2 rounded-md justify-between'>
                          <ArchiveIcon  />
                          <span className='ml-4 text-sm'>{page.id}</span>
                          { page.state == 1 ? <><CheckCircle2  color='#4ADE80' /></> : <><CircleXIcon color='#F87171' /></>}
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrawlerList;
