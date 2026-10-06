// Banco de perguntas: "correta" é o índice da opção certa
const perguntas = [
  {
    tema: "HTML",
    texto: "Qual tag HTML é usada para criar um link para outra página?",
    opcoes: ["<link>", "<a>", "<href>", "<url>"],
    correta: 1
  },
  {
    tema: "Git",
    texto: "Qual comando do Git salva as alterações preparadas (staged) no histórico do repositório?",
    opcoes: ["git add", "git push", "git commit", "git clone"],
    correta: 2
  },
  {
    tema: "MCP",
    texto: "O que é o MCP (Model Context Protocol)?",
    opcoes: [
      "Uma linguagem de programação para criar sites",
      "Um protocolo aberto que conecta modelos de IA a ferramentas e fontes de dados externas",
      "Um tipo de memória do computador",
      "Um editor de código da Microsoft"
    ],
    correta: 1
  },
  {
    tema: "Skills",
    texto: "Em assistentes de IA como o Claude, o que é uma skill?",
    opcoes: [
      "Um pacote de instruções e arquivos que ensina o assistente a fazer uma tarefa específica",
      "Um vírus que ataca o assistente",
      "A nota que o usuário dá para a resposta",
      "Um plano pago de internet"
    ],
    correta: 0
  },
  {
    tema: "GitHub",
    texto: "O que é um Pull Request no GitHub?",
    opcoes: [
      "Um comando para apagar um repositório",
      "Um pedido para baixar o GitHub no computador",
      "Uma cópia de segurança automática",
      "Um pedido para revisar e juntar alterações de uma branch em outra"
    ],
    correta: 3
  }
];

// Elementos da página
const elProgresso = document.getElementById("progresso");
const elPergunta = document.getElementById("pergunta");
const elOpcoes = document.getElementById("opcoes");
const elFeedback = document.getElementById("feedback");
const btnProxima = document.getElementById("proxima");

// Estado do quiz
let indiceAtual = 0;
let pontos = 0;
let respondida = false;
let terminou = false;

// Mostra a pergunta atual e cria os botões de opção
function mostrarPergunta() {
  const atual = perguntas[indiceAtual];
  respondida = false;

  elProgresso.textContent = `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;
  elPergunta.textContent = `${atual.tema}: ${atual.texto}`;
  elFeedback.textContent = "";
  elFeedback.className = "feedback";
  elOpcoes.innerHTML = "";

  atual.opcoes.forEach((textoOpcao, i) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao";
    botao.textContent = textoOpcao; // textContent evita interpretar "<a>" como HTML
    botao.addEventListener("click", () => responder(i));
    elOpcoes.appendChild(botao);
  });

  btnProxima.disabled = true;
  btnProxima.textContent =
    indiceAtual === perguntas.length - 1 ? "Ver resultado" : "Próxima";

  // Leva o foco para a nova pergunta (ajuda quem usa teclado ou leitor de tela)
  elPergunta.focus();
}

// Adiciona um texto visível ao botão, para não depender só da cor
function marcarOpcao(botao, classe, rotulo) {
  botao.classList.add(classe);
  const marca = document.createElement("span");
  marca.className = "marca";
  marca.textContent = ` ${rotulo}`;
  botao.appendChild(marca);
}

// Confere a resposta escolhida
function responder(escolhida) {
  if (respondida) return;
  respondida = true;

  const atual = perguntas[indiceAtual];
  const botoes = elOpcoes.querySelectorAll("button");
  const acertou = escolhida === atual.correta;

  // Marca a certa sempre e a errada só se o aluno errou
  marcarOpcao(botoes[atual.correta], "correta", "✓ (correta)");
  if (!acertou) {
    marcarOpcao(botoes[escolhida], "errada", "✗ (sua resposta)");
  }

  // Trava as opções para não responder de novo
  botoes.forEach((botao) => {
    botao.disabled = true;
  });

  if (acertou) {
    pontos++;
    elFeedback.textContent = "Correto! Muito bem.";
    elFeedback.classList.add("acerto");
  } else {
    elFeedback.textContent =
      `Incorreto. A resposta certa é: ${atual.opcoes[atual.correta]}`;
    elFeedback.classList.add("erro");
  }

  // Libera o botão e move o foco para ele (as opções ficaram desativadas)
  btnProxima.disabled = false;
  btnProxima.focus();
}

// Mostra a pontuação final
function mostrarResultado() {
  terminou = true;
  const total = perguntas.length;

  let mensagem;
  if (pontos === total) {
    mensagem = "Excelente! Você gabaritou o quiz!";
  } else if (pontos >= total / 2) {
    mensagem = "Bom trabalho! Você mandou bem.";
  } else {
    mensagem = "Continue estudando, você vai chegar lá!";
  }

  elProgresso.textContent = "Quiz finalizado";
  elPergunta.textContent = `Você acertou ${pontos} de ${total} perguntas.`;
  elOpcoes.innerHTML = "";
  elFeedback.textContent = mensagem;
  elFeedback.className = "feedback resultado";

  btnProxima.textContent = "Jogar novamente";
  btnProxima.disabled = false;

  elPergunta.focus();
}

// Volta tudo ao início
function reiniciar() {
  indiceAtual = 0;
  pontos = 0;
  terminou = false;
  mostrarPergunta();
}

// Botão "Próxima": avança, mostra o resultado ou reinicia
btnProxima.addEventListener("click", () => {
  if (terminou) {
    reiniciar();
  } else if (indiceAtual < perguntas.length - 1) {
    indiceAtual++;
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
});

// Começa o quiz
mostrarPergunta();
