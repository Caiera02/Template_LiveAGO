// URL do nosso arquivo JSON (deve estar no mesmo diretório)
const URL_DADOS = './cooperados.json';

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

/**
 * Função principal chamada pelo botão no HTML (onclick="buscarEExibir()").
 * Busca o cooperado verificando a combinação exata de Matrícula e Nome.
 */
window.buscarEExibir = function() {
    const matriculaInput = document.getElementById('inputMatricula');
    const nomeInput = document.getElementById('inputNome');
    
    // Limpa a formatação anterior
    resultadoDiv.className = 'aviso';

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
        const matchNome = c.nome.trim().toLowerCase() === nomeBusca.toLowerCase();
        
        // Retorna verdadeiro SOMENTE se ambos forem verdadeiros
        return matchMatricula && matchNome;
    });
    
    // 4. Exibir o resultado final
    if (cooperadoEncontrado) {
        resultadoDiv.textContent = `SUCESSO! Cooperado Encontrado: ${cooperadoEncontrado.nome} (Matrícula: ${cooperadoEncontrado.matricula})`;
        resultadoDiv.className = 'sucesso';

        // --- REDIRECIONAMENTO ---
        // A função window.location.href redireciona o navegador para a URL especificada.
        setTimeout(() => {
             window.location.href = 'live.html';
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