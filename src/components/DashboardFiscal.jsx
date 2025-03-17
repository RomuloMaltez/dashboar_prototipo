import React, { useState, useEffect } from 'react';

const DashboardFiscal = () => {
  // Estados para dados dinâmicos
  const [arrecadacaoData, setArrecadacaoData] = useState([
    { tributo: 'ISS', meta: 258196651, realizado: 190000000, percentual: 73.6 },
    { tributo: 'IPTU', meta: 40976191, realizado: 32000000, percentual: 78.1 },
    { tributo: 'ITBI', meta: 24882600, realizado: 18500000, percentual: 74.3 },
    { tributo: 'TRSD', meta: 35760432, realizado: 22800000, percentual: 63.8 },
    { tributo: 'ITR', meta: 3395740, realizado: 2100000, percentual: 61.8 },
  ]);

  const [acoesFiscaisData, setAcoesFiscaisData] = useState([
    { status: 'Concluídas', quantidade: 32 },
    { status: 'Em andamento', quantidade: 57 },
    { status: 'Atrasadas', quantidade: 18 },
    { status: 'Não iniciadas', quantidade: 25 },
  ]);

  const [tributosPrioritarios, setTributosPrioritarios] = useState([
    { 
      tributo: 'IPTU Usinas Rio Madeira', 
      potencial: 'R$ 40 milhões/ano', 
      status: 'Em análise',
      progresso: 30 
    },
    { 
      tributo: 'Taxa Fiscalização (4.516 contrib.)', 
      potencial: 'R$ 0,5 milhão/ano', 
      status: 'Em execução',
      progresso: 45 
    },
    { 
      tributo: 'ITBI (Observatório Imobiliário)', 
      potencial: 'R$ 5 milhões/ano', 
      status: 'Em desenvolvimento',
      progresso: 20 
    },
  ]);

  const [alertas, setAlertas] = useState([
    {
      nivel: 'critico',
      titulo: 'Arrecadação TRSD abaixo da meta',
      mensagem: 'Realizado apenas 63.8% da meta anual. Recomenda-se intensificar fiscalização.'
    },
    {
      nivel: 'critico',
      titulo: 'Cobrança IPTU Usinas em risco',
      mensagem: 'Processo de avaliação atrasado. Potencial de R$ 40 milhões em risco para 2025.'
    },
    {
      nivel: 'aviso',
      titulo: '18 ações fiscais atrasadas',
      mensagem: 'Necessária redistribuição de recursos ou revisão de prazos.'
    },
    {
      nivel: 'aviso',
      titulo: 'Alto volume de impugnações IPTU',
      mensagem: '63 processos de impugnação pendentes, número crescente.'
    }
  ]);

  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());
  const [atualizando, setAtualizando] = useState(false);
  const [intervaloAtivo, setIntervaloAtivo] = useState(true);
  const [tempoRestante, setTempoRestante] = useState(60);

  // Formatar valores em reais
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Função para determinar a cor baseada no percentual
  const getColorByPercentage = (percentage) => {
    if (percentage < 65) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Gerar dados aleatórios realistas para arrecadação
  const gerarDadosArrecadacao = () => {
    return arrecadacaoData.map(item => {
      // Variação aleatória entre -2% e +3% do valor realizado atual
      const variacao = item.realizado * (Math.random() * 0.05 - 0.02);
      const novoRealizado = Math.max(item.realizado + Math.round(variacao), 0);
      const novoPercentual = parseFloat(((novoRealizado / item.meta) * 100).toFixed(1));
      
      return {
        ...item,
        realizado: novoRealizado,
        percentual: novoPercentual
      };
    });
  };

  // Gerar dados aleatórios realistas para ações fiscais
  const gerarDadosAcoesFiscais = () => {
    // Copiar o estado atual
    const novosDados = [...acoesFiscaisData];
    
    // Alterações possíveis:
    // 1. Concluir algumas ações em andamento
    // 2. Iniciar algumas ações não iniciadas
    // 3. Algumas ações podem ficar atrasadas
    
    // Concluir ações (de "Em andamento" para "Concluídas")
    const concluidas = Math.floor(Math.random() * 3); // 0 a 2 ações concluídas
    if (concluidas > 0 && novosDados[1].quantidade > concluidas) {
      novosDados[0].quantidade += concluidas;
      novosDados[1].quantidade -= concluidas;
    }
    
    // Iniciar ações (de "Não iniciadas" para "Em andamento")
    const iniciadas = Math.floor(Math.random() * 2); // 0 a 1 ações iniciadas
    if (iniciadas > 0 && novosDados[3].quantidade > iniciadas) {
      novosDados[1].quantidade += iniciadas;
      novosDados[3].quantidade -= iniciadas;
    }
    
    // Atrasar ações (de "Em andamento" para "Atrasadas")
    const atrasadas = Math.random() < 0.3 ? 1 : 0; // 30% de chance de atrasar uma ação
    if (atrasadas > 0 && novosDados[1].quantidade > atrasadas) {
      novosDados[2].quantidade += atrasadas;
      novosDados[1].quantidade -= atrasadas;
    }
    
    return novosDados;
  };

  // Gerar dados aleatórios para projetos prioritários
  const gerarDadosProjetos = () => {
    return tributosPrioritarios.map(projeto => {
      // Aumenta o progresso em 0-5%
      const incrementoProgresso = Math.floor(Math.random() * 6);
      const novoProgresso = Math.min(projeto.progresso + incrementoProgresso, 100);
      
      // Atualiza o status conforme o progresso
      let novoStatus = projeto.status;
      if (novoProgresso > 80 && projeto.status !== 'Concluído') {
        novoStatus = 'Fase final';
      } else if (novoProgresso > 50 && projeto.status === 'Em análise') {
        novoStatus = 'Em execução';
      } else if (novoProgresso > 30 && projeto.status === 'Em desenvolvimento') {
        novoStatus = 'Em execução';
      }
      
      return {
        ...projeto,
        progresso: novoProgresso,
        status: novoStatus
      };
    });
  };

  // Atualizar alertas com base nas mudanças nos dados
  const atualizarAlertas = (novaArrecadacao, novasAcoes) => {
    const novosAlertas = [...alertas];
    
    // Verificar TRSD
    const trsdData = novaArrecadacao.find(item => item.tributo === 'TRSD');
    if (trsdData) {
      const indexAlertaTRSD = novosAlertas.findIndex(a => a.titulo.includes('TRSD'));
      if (indexAlertaTRSD >= 0) {
        if (trsdData.percentual >= 65) {
          // Remover alerta se percentual melhorou
          novosAlertas.splice(indexAlertaTRSD, 1);
        } else {
          // Atualizar mensagem
          novosAlertas[indexAlertaTRSD].mensagem = `Realizado apenas ${trsdData.percentual}% da meta anual. Recomenda-se intensificar fiscalização.`;
        }
      } else if (trsdData.percentual < 65) {
        // Adicionar novo alerta
        novosAlertas.push({
          nivel: 'critico',
          titulo: 'Arrecadação TRSD abaixo da meta',
          mensagem: `Realizado apenas ${trsdData.percentual}% da meta anual. Recomenda-se intensificar fiscalização.`
        });
      }
    }
    
    // Verificar ações atrasadas
    const acoesAtrasadas = novasAcoes.find(item => item.status === 'Atrasadas');
    if (acoesAtrasadas) {
      const indexAlertaAcoes = novosAlertas.findIndex(a => a.titulo.includes('ações fiscais atrasadas'));
      if (indexAlertaAcoes >= 0) {
        if (acoesAtrasadas.quantidade <= 15) {
          // Remover alerta se quantidade de atrasadas diminuiu
          novosAlertas.splice(indexAlertaAcoes, 1);
        } else {
          // Atualizar mensagem
          novosAlertas[indexAlertaAcoes].mensagem = `Necessária redistribuição de recursos ou revisão de prazos.`;
          novosAlertas[indexAlertaAcoes].titulo = `${acoesAtrasadas.quantidade} ações fiscais atrasadas`;
        }
      } else if (acoesAtrasadas.quantidade > 15) {
        // Adicionar novo alerta
        novosAlertas.push({
          nivel: 'aviso',
          titulo: `${acoesAtrasadas.quantidade} ações fiscais atrasadas`,
          mensagem: 'Necessária redistribuição de recursos ou revisão de prazos.'
        });
      }
    }
    
    return novosAlertas;
  };

  // Função para simular uma atualização de dados
  const atualizarDados = () => {
    if (atualizando) return;
    
    setAtualizando(true);
    
    // Timeout para dar a sensação de carregamento
    setTimeout(() => {
      const novosArrecadacao = gerarDadosArrecadacao();
      const novasAcoes = gerarDadosAcoesFiscais();
      const novosProjetos = gerarDadosProjetos();
      const novosAlertas = atualizarAlertas(novosArrecadacao, novasAcoes);
      
      setArrecadacaoData(novosArrecadacao);
      setAcoesFiscaisData(novasAcoes);
      setTributosPrioritarios(novosProjetos);
      setAlertas(novosAlertas);
      setUltimaAtualizacao(new Date());
      setAtualizando(false);
      setTempoRestante(60);
    }, 1000);
  };

  // Alternar atualização automática
  const toggleAtualizacaoAutomatica = () => {
    setIntervaloAtivo(!intervaloAtivo);
  };

  // Configurar o intervalo de atualização automática
  useEffect(() => {
    let intervalId;
    let countdownId;
    
    if (intervaloAtivo) {
      // Intervalo para atualização de dados
      intervalId = setInterval(() => {
        atualizarDados();
      }, 60000); // Atualiza a cada 60 segundos
      
      // Contador regressivo
      countdownId = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) return 60;
          return prev - 1;
        });
      }, 1000);
    }
    
    // Limpar os intervalos ao desmontar o componente
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (countdownId) clearInterval(countdownId);
    };
  }, [intervaloAtivo]);

  // Formatar data e hora
  const formatarDataHora = (data) => {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Gestão Fiscal - Porto Velho</h1>
              <p className="text-sm">Departamento de Fiscalização (DEF) - 2025</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${atualizando ? 'text-yellow-300' : 'text-white'}`}>
                <span className="text-sm">
                  Última atualização: {formatarDataHora(ultimaAtualizacao)}
                </span>
                {atualizando && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className={`bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-all ${atualizando ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={atualizarDados}
                  disabled={atualizando}
                >
                  {atualizando ? 'Atualizando...' : 'Atualizar dados'}
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm transition-all ${intervaloAtivo ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  onClick={toggleAtualizacaoAutomatica}
                >
                  Auto: {intervaloAtivo ? 'ON' : 'OFF'}
                </button>
                {intervaloAtivo && !atualizando && (
                  <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
                    {tempoRestante}s
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className={`container mx-auto p-4 flex-grow transition-opacity duration-300 ${atualizando ? 'opacity-70' : 'opacity-100'}`}>
        {/* Cards com resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow transition-all duration-500 hover:shadow-lg">
            <h3 className="text-gray-500 text-sm">Arrecadação Total</h3>
            <p className="text-2xl font-bold transform transition-all duration-500">
              {formatCurrency(arrecadacaoData.reduce((sum, item) => sum + item.realizado, 0))}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">
                Meta: {formatCurrency(arrecadacaoData.reduce((sum, item) => sum + item.meta, 0))}
              </span>
              <span className="ml-2 text-sm text-yellow-600">
                {(arrecadacaoData.reduce((sum, item) => sum + item.realizado, 0) / 
                 arrecadacaoData.reduce((sum, item) => sum + item.meta, 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow transition-all duration-500 hover:shadow-lg">
            <h3 className="text-gray-500 text-sm">Ações Fiscais</h3>
            <p className="text-2xl font-bold transform transition-all duration-500">
              {acoesFiscaisData.reduce((sum, item) => sum + item.quantidade, 0)}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">
                {acoesFiscaisData[0].quantidade} concluídas
              </span>
              <span className="ml-2 text-sm text-red-600">
                {acoesFiscaisData[2].quantidade} atrasadas
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow transition-all duration-500 hover:shadow-lg">
            <h3 className="text-gray-500 text-sm">Processos de Impugnação</h3>
            <p className="text-2xl font-bold">217</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">
                154 resolvidos
              </span>
              <span className="ml-2 text-sm text-yellow-600">
                63 pendentes
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow transition-all duration-500 hover:shadow-lg">
            <h3 className="text-gray-500 text-sm">Potencial Adicional</h3>
            <p className="text-2xl font-bold">R$ 45,5 milhões</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-blue-600">
                Usinas + Taxas não cobradas
              </span>
            </div>
          </div>
        </div>

        {/* Gráficos e tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Arrecadação por tributo */}
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4">Arrecadação por Tributo</h2>
            
            <div className="space-y-4">
              {arrecadacaoData.map((item) => (
                <div key={item.tributo} className="transition-all duration-500">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.tributo}</span>
                    <span className="transition-all duration-500">{item.percentual}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-4">
                    <div 
                      className={`h-4 rounded ${getColorByPercentage(item.percentual)} transition-all duration-1000 ease-in-out`} 
                      style={{ width: `${item.percentual}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span className="transition-all duration-500">Realizado: {formatCurrency(item.realizado)}</span>
                    <span>Meta: {formatCurrency(item.meta)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status das ações fiscais */}
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4">Status das Ações Fiscais</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-green-100 rounded transition-all duration-500 hover:bg-green-200">
                <span className="text-3xl font-bold text-green-600 transition-all duration-500">{acoesFiscaisData[0].quantidade}</span>
                <span className="text-sm text-green-800">Concluídas</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-blue-100 rounded transition-all duration-500 hover:bg-blue-200">
                <span className="text-3xl font-bold text-blue-600 transition-all duration-500">{acoesFiscaisData[1].quantidade}</span>
                <span className="text-sm text-blue-800">Em andamento</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-red-100 rounded transition-all duration-500 hover:bg-red-200">
                <span className="text-3xl font-bold text-red-600 transition-all duration-500">{acoesFiscaisData[2].quantidade}</span>
                <span className="text-sm text-red-800">Atrasadas</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded transition-all duration-500 hover:bg-gray-200">
                <span className="text-3xl font-bold text-gray-600 transition-all duration-500">{acoesFiscaisData[3].quantidade}</span>
                <span className="text-sm text-gray-800">Não iniciadas</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t">
              <h3 className="font-medium mb-2">Distribuição de Responsáveis</h3>
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-sm">Auditores ativos: 15</span>
                <span className="text-sm transition-all duration-500">
                  Média: {(acoesFiscaisData.reduce((sum, item) => sum + item.quantidade, 0) / 15).toFixed(1)} ações/auditor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações prioritárias */}
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-all duration-300 mb-6">
          <h2 className="text-lg font-semibold mb-4">Projetos Estratégicos Prioritários</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Projeto</th>
                  <th className="p-2 text-left">Potencial de Arrecadação</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {tributosPrioritarios.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-2 font-medium">{item.tributo}</td>
                    <td className="p-2 text-green-700 font-medium">{item.potencial}</td>
                    <td className="p-2 transition-all duration-500">{item.status}</td>
                    <td className="p-2">
                      <div className="w-full bg-gray-200 rounded h-2.5">
                        <div 
                          className="h-2.5 rounded bg-blue-600 transition-all duration-1000 ease-in-out" 
                          style={{ width: `${item.progresso}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel de alertas */}
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Alertas e Notificações</h2>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm transition-all duration-500">
              {alertas.filter(a => a.nivel === 'critico').length} alertas críticos
            </span>
          </div>
          
          <div className="space-y-2">
            {alertas.map((alerta, index) => (
              <div 
                key={index} 
                className={`p-3 rounded border-l-4 transition-all duration-500 transform hover:translate-x-1 ${
                  alerta.nivel === 'critico' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <h3 className="font-medium">{alerta.titulo}</h3>
                <p className="text-sm text-gray-600">{alerta.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
        <p>Sistema de Gestão Fiscal - Secretaria Municipal de Fazenda</p>
        <p>Departamento de Fiscalização (DEF) - SUREM - 2025</p>
      </footer>
    </div>
  );
};

export default DashboardFiscal;
