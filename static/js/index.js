// URL do nosso arquivo JSON (deve estar no mesmo diretório)
const URL_DADOS = './cooperados.json';
// const URL_DADOS = './goldcooper.json';
const URL_LOG_ACESSO = 'https://caio12faculdade.pythonanywhere.com/api/log_acesso/';
// Variável global para armazenar os dados carregados
let listaCooperados = [];
const resultadoDiv = document.getElementById('resultado');

/**
 * Função para carregar o JSON assim que a página é aberta.
 */
async function carregarDados() {
    try {
        resultadoDiv.textContent = "Carregando lista de cooperados...";
        
        // 1. Fazer a requisição para obter o arquivo JSON
        const response = await fetch(URL_DADOS);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar o arquivo: ${response.status}`);
        }
        
        // 2. Converter a resposta para objeto JavaScript
        listaCooperados = await response.json();
        
        // 3. Atualiza o status na tela
        resultadoDiv.textContent = `Lista de ${listaCooperados.length} cooperados carregada. Pronto para buscar!`;
        resultadoDiv.className = 'aviso';
        
    } catch (error) {
        console.error("Erro no carregamento:", error);
        resultadoDiv.textContent = `ERRO: Não foi possível carregar o arquivo de dados. Verifique o console.`;
        resultadoDiv.className = 'erro';
    }
}

async function enviarLogAcesso(cooperado) {
    console.log("Tentando enviar log de acesso para o servidor...");
    try {
        const response = await fetch(URL_LOG_ACESSO, {
            method: 'POST',
            headers: {
                // Configuração padrão para enviar JSON
                'Content-Type': 'application/json',
                // Se estiver usando Django, você pode precisar do CSRF Token aqui
            },
            body: JSON.stringify({
                matricula: cooperado.matricula,
                nome: cooperado.nome,
                data_acesso: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            console.error(`Erro ao enviar log (status: ${response.status}). Verifique se sua URL de log está correta e funcional.`);
        } else {
            console.log("Log de acesso enviado com sucesso.");
        }
    } catch (error) {
        console.error("Erro de rede ao enviar log:", error);
    }
}

/**
 * Função principal chamada pelo botão no HTML (onclick="buscarEExibir()").
 * Busca o cooperado verificando a combinação exata de Matrícula e Nome.
 */
window.buscarEExibir = function() {
    const matriculaInput = document.getElementById('inputMatricula');
    const nomeInput = document.getElementById('inputNome');
    
    // Limpa a formatação anterior
    resultadoDiv.className = 'aviso';
    sessionStorage.removeItem('authenticated'); // Limpeza defensiva
    sessionStorage.removeItem('cooperadoData');

    // 1. Obter e limpar os valores dos inputs
    const matriculaBusca = Number(matriculaInput.value.trim()); 
    const nomeBusca = nomeInput.value.trim();

    // 2. Validação inicial
    if (listaCooperados.length === 0) {
        resultadoDiv.textContent = "A lista de dados não foi carregada.";
        resultadoDiv.className = 'erro';
        return;
    }
    
    if (!matriculaBusca || nomeBusca === '') {
        resultadoDiv.textContent = "Por favor, preencha AMBOS os campos: Matrícula e Nome.";
        return;
    }

    // 3. Fazer a busca combinada: Encontra o PRIMEIRO item que satisfaça AMBAS as condições
    const cooperadoEncontrado = listaCooperados.find(c => {
        // Verifica se a matrícula é igual
        const matchMatricula = c.matricula === matriculaBusca;
        
        // Verifica se o nome é igual (sem case-sensitive para facilitar)
        // const matchNome = c.nome.trim().toLowerCase() === nomeBusca.toLowerCase();
        
        // Retorna verdadeiro SOMENTE se ambos forem verdadeiros
        // return matchMatricula && matchNome;
        return matchMatricula;
    });
    
    if (cooperadoEncontrado) {
        // NOVIDADE: Crio um objeto para o log que usa o nome digitado, 
        // mas a matrícula validada do cooperado.
        const logData = {
            matricula: cooperadoEncontrado.matricula, // Matrícula validada do JSON
            nome: nomeBusca // <-- USA O NOME DIGITADO PELO COOPERADO
        };

        resultadoDiv.textContent = `SUCESSO! Cooperado Encontrado: ${cooperadoEncontrado.nome} (Matrícula: ${cooperadoEncontrado.matricula})`;
        resultadoDiv.className = 'sucesso';

        // 1. Persistência de Autenticação
        // Mantemos o nome do JSON no sessionStorage
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('cooperadoData', JSON.stringify({
            nome: cooperadoEncontrado.nome, 
            matricula: cooperadoEncontrado.matricula
        }));

        // 2. Rastreio de Login (GOAL 2)
        // Envia o log para o seu backend
        enviarLogAcesso(logData);
        setTimeout(() => {
              window.location.href = 'goldcooper.html';
        }, 500); // Pequeno atraso de 500ms para o usuário ver a mensagem de sucesso
         // -------------------------

    } else {
        resultadoDiv.textContent = `ERRO: A combinação de Matrícula e Nome digitada NÃO FOI ENCONTRADA na lista.`;
         resultadoDiv.className = 'erro';
     }
};

// ===============================================
// CHAMA A FUNÇÃO DE CARREGAMENTO AO INICIAR O SCRIPT
// ===============================================
carregarDados();




