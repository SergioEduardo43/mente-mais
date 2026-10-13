
"use strict";

// ========================================
// 1. NAVEGAÇÃO ENTRE AS PÁGINAS
// ========================================

const paginas = document.querySelectorAll("[data-screen]");
const botoesPagina = document.querySelectorAll("[data-page]");
const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menuToggle");

function abrirPagina(nome) {
  const destino = document.getElementById(nome);

  if (!destino || !destino.matches("[data-screen]")) {
    return;
  }

  paginas.forEach((pagina) => {
    pagina.classList.toggle("ativa", pagina.id === nome);
  });

  botoesPagina.forEach((botao) => {
    const ativo = botao.dataset.page === nome;

    if (botao.classList.contains("nav-link")) {
      botao.classList.toggle("ativo", ativo);

      if (ativo) {
        botao.setAttribute("aria-current", "page");
      } else {
        botao.removeAttribute("aria-current");
      }
    }
  });

  menu.classList.remove("aberto");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");

  if (location.hash !== `#${nome}`) {
    history.replaceState(null, "", `#${nome}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

botoesPagina.forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirPagina(botao.dataset.page);
  });
});

menuToggle.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");

  menuToggle.setAttribute("aria-expanded", String(aberto));
  menuToggle.setAttribute(
    "aria-label",
    aberto ? "Fechar menu" : "Abrir menu"
  );
});

const paginaInicial = location.hash.replace("#", "");
const paginasValidas = ["inicio", "quiz", "aprender", "ajuda"];

abrirPagina(
  paginasValidas.includes(paginaInicial) ? paginaInicial : "inicio"
);


// ========================================
// 2. QUIZ DE REFLEXÃO
// ========================================

const perguntas = [
  {
    pergunta: "Como você tem se sentido ultimamente?",
    opcoes: [
      "Bem e com disposição",
      "Mais ou menos, com altos e baixos",
      "Cansado ou sobrecarregado",
      "Triste ou desanimado"
    ]
  },
  {
    pergunta: "Como tem sido seu sono?",
    opcoes: [
      "Tenho conseguido descansar",
      "Às vezes tenho dificuldade",
      "Tenho dormido mal com frequência",
      "Meu sono está bastante irregular"
    ]
  },
  {
    pergunta: "Como você lida com as tarefas do dia a dia?",
    opcoes: [
      "Consigo organizar minhas tarefas",
      "Às vezes fico um pouco perdido",
      "Sinto que tenho coisas demais para fazer",
      "Está difícil encontrar motivação"
    ]
  },
  {
    pergunta: "Com que frequência você consegue relaxar?",
    opcoes: [
      "Consigo ter momentos tranquilos",
      "De vez em quando",
      "Raramente, minha mente fica ocupada",
      "Tenho sentido muita tensão"
    ]
  },
  {
    pergunta: "Como está sua vontade de fazer coisas de que gosta?",
    opcoes: [
      "Continuo gostando das minhas atividades",
      "Tenho variado bastante",
      "Tenho tido menos vontade",
      "Quase não tenho sentido vontade ultimamente"
    ]
  },
  {
    pergunta: "Como você se sente ao conversar com outras pessoas?",
    opcoes: [
      "Consigo conversar e me sentir à vontade",
      "Depende do dia e da pessoa",
      "Às vezes prefiro ficar sozinho",
      "Tenho sentido falta de alguém com quem conversar"
    ]
  },
  {
    pergunta: "Quando algo dá errado, como você costuma reagir?",
    opcoes: [
      "Tento resolver com calma",
      "Fico chateado, mas depois melhoro",
      "Fico pensando muito no que aconteceu",
      "Tenho dificuldade para lidar com isso"
    ]
  },
  {
    pergunta: "Você sente que tem alguém com quem pode contar?",
    opcoes: [
      "Sim, tenho pessoas de confiança",
      "Acho que sim, embora nem sempre converse",
      "Não tenho certeza",
      "Tenho sentido falta de apoio"
    ]
  }
];

let perguntaAtual = 0;
let respostas = Array(perguntas.length).fill(null);

const quizContador = document.getElementById("quizContador");
const quizPercentual = document.getElementById("quizPercentual");
const quizBarra = document.getElementById("quizBarra");
const perguntaTexto = document.getElementById("perguntaTexto");
const opcoesQuiz = document.getElementById("opcoesQuiz");
const quizVoltar = document.getElementById("quizVoltar");
const quizProximo = document.getElementById("quizProximo");
const quizConteudo = document.getElementById("quizConteudo");
const quizAcoes = document.getElementById("quizAcoes");
const quizResultado = document.getElementById("quizResultado");

function mostrarPergunta() {
  const pergunta = perguntas[perguntaAtual];
  const numero = perguntaAtual + 1;
  const percentual = Math.round((numero / perguntas.length) * 100);

  quizContador.textContent = `Pergunta ${numero} de ${perguntas.length}`;
  quizPercentual.textContent = `${percentual}%`;
  quizBarra.style.width = `${percentual}%`;
  perguntaTexto.textContent = pergunta.pergunta;

  opcoesQuiz.replaceChildren();

  pergunta.opcoes.forEach((texto, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao-quiz";
    botao.textContent = texto;

    if (respostas[perguntaAtual] === indice) {
      botao.classList.add("selecionada");
      botao.setAttribute("aria-pressed", "true");
    } else {
      botao.setAttribute("aria-pressed", "false");
    }

    botao.addEventListener("click", () => {
      respostas[perguntaAtual] = indice;
      mostrarPergunta();
    });

    opcoesQuiz.appendChild(botao);
  });

  quizVoltar.disabled = perguntaAtual === 0;
  quizProximo.disabled = respostas[perguntaAtual] === null;

  quizProximo.textContent =
    perguntaAtual === perguntas.length - 1
      ? "Ver reflexão →"
      : "Próxima →";
}

function mostrarResultado() {
  const respostasDificeis = respostas.filter((resposta) => resposta >= 2).length;

  quizConteudo.classList.add("escondido");
  quizAcoes.classList.add("escondido");
  quizResultado.classList.remove("escondido");

  quizContador.textContent = "Reflexão concluída";
  quizPercentual.textContent = "100%";
  quizBarra.style.width = "100%";

  const titulo = document.getElementById("resultadoTitulo");
  const texto = document.getElementById("resultadoTexto");

  titulo.textContent = "Obrigado por reservar esse momento para você.";

  if (respostasDificeis <= 2) {
    texto.textContent =
      "Pelas suas respostas, você indicou algumas experiências tranquilas " +
      "e outras que podem variar. Continue percebendo suas emoções e " +
      "reserve tempo para aquilo que faz bem a você.";
  } else if (respostasDificeis <= 5) {
    texto.textContent =
      "Suas respostas mostram que alguns aspectos da rotina podem estar " +
      "exigindo mais de você. Tente identificar o que mais pesa, fazer " +
      "pequenas pausas e conversar com alguém de confiança se precisar.";
  } else {
    texto.textContent =
      "Você indicou que várias áreas podem estar difíceis neste momento. " +
      "Você merece acolhimento e apoio. Considere conversar com alguém " +
      "de confiança ou procurar um profissional de saúde para receber orientação.";
  }
}

quizVoltar.addEventListener("click", () => {
  if (perguntaAtual > 0) {
    perguntaAtual--;
    mostrarPergunta();
  }
});

quizProximo.addEventListener("click", () => {
  if (respostas[perguntaAtual] === null) return;

  if (perguntaAtual < perguntas.length - 1) {
    perguntaAtual++;
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
});

document.getElementById("refazerQuiz").addEventListener("click", () => {
  perguntaAtual = 0;
  respostas = Array(perguntas.length).fill(null);

  quizConteudo.classList.remove("escondido");
  quizAcoes.classList.remove("escondido");
  quizResultado.classList.add("escondido");

  mostrarPergunta();
});

mostrarPergunta();


// ========================================
// 3. FLASHCARDS DE SAÚDE MENTAL
// ========================================

const flashcards = [
  {
    titulo: "Ansiedade",
    simbolo: "☁",
    verso:
      "A ansiedade é uma reação que pode aparecer diante de preocupações " +
      "ou situações incertas. Quando fica intensa ou atrapalha a rotina, " +
      "conversar com um profissional pode ajudar."
  },
  {
    titulo: "Depressão",
    simbolo: "🌧",
    verso:
      "A depressão é uma condição de saúde que pode afetar o humor, " +
      "a disposição, o sono e o interesse pelas atividades. Não é falta " +
      "de força de vontade, e existe tratamento."
  },
  {
    titulo: "Estresse",
    simbolo: "〰",
    verso:
      "O estresse pode surgir quando sentimos que as exigências são " +
      "maiores que nossos recursos naquele momento. Pausas, organização " +
      "e apoio podem ajudar a lidar com ele."
  },
  {
    titulo: "Sono",
    simbolo: "☾",
    verso:
      "Dormir bem ajuda a memória, a atenção e a regulação das emoções. " +
      "Uma rotina regular e um ambiente tranquilo podem favorecer o descanso."
  },
  {
    titulo: "Autoestima",
    simbolo: "♡",
    verso:
      "Autoestima envolve como percebemos e valorizamos a nós mesmos. " +
      "Errar ou ter dificuldades não diminui seu valor como pessoa."
  },
  {
    titulo: "Redes sociais",
    simbolo: "✧",
    verso:
      "Nas redes sociais, vemos apenas parte da vida das pessoas. Comparações " +
      "constantes podem pesar no humor; fazer pausas e escolher o que seguir " +
      "pode ajudar."
  },
  {
    titulo: "Emoções",
    simbolo: "☀",
    verso:
      "Alegria, medo, tristeza e raiva são emoções humanas. Perceber o que " +
      "sentimos sem nos julgar pode ajudar a entender nossas necessidades."
  },
  {
    titulo: "Pedir ajuda",
    simbolo: "🌱",
    verso:
      "Pedir apoio não é sinal de fraqueza. Conversar com alguém de confiança " +
      "ou procurar um profissional de saúde pode ser um passo importante."
  }
];

let cardAtual = 0;

const flashcardElemento = document.getElementById("flashcard");
const flashcardInterno = document.getElementById("flashcardInterno");
const cardAnterior = document.getElementById("cardAnterior");
const cardProximo = document.getElementById("cardProximo");
const cardBolinhas = document.getElementById("cardBolinhas");

function mostrarFlashcard() {
  const card = flashcards[cardAtual];

  flashcardElemento.classList.remove("virado");

  document.getElementById("flashcardContador").textContent =
    `Cartão ${cardAtual + 1} de ${flashcards.length}`;

  document.getElementById("cardNumero").textContent =
    `${String(cardAtual + 1).padStart(2, "0")} / ${String(flashcards.length).padStart(2, "0")}`;

  document.getElementById("cardSimbolo").textContent = card.simbolo;
  document.getElementById("cardTitulo").textContent = card.titulo;
  document.getElementById("cardVerso").textContent = card.verso;

  cardAnterior.disabled = cardAtual === 0;
  cardProximo.disabled = cardAtual === flashcards.length - 1;

  cardBolinhas.replaceChildren();

  flashcards.forEach((item, indice) => {
    const bolinha = document.createElement("button");
    bolinha.type = "button";
    bolinha.className = "bolinha-card";
    bolinha.setAttribute("aria-label", `Abrir cartão ${indice + 1}: ${item.titulo}`);

    if (indice === cardAtual) {
      bolinha.classList.add("ativo");
      bolinha.setAttribute("aria-current", "step");
    }

    bolinha.addEventListener("click", () => {
      cardAtual = indice;
      mostrarFlashcard();
    });

    cardBolinhas.appendChild(bolinha);
  });
}

function virarFlashcard() {
  flashcardElemento.classList.toggle("virado");
}

function avancarCard() {
  if (cardAtual < flashcards.length - 1) {
    cardAtual++;
    mostrarFlashcard();
  }
}

function voltarCard() {
  if (cardAtual > 0) {
    cardAtual--;
    mostrarFlashcard();
  }
}

flashcardElemento.addEventListener("click", virarFlashcard);
flashcardElemento.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault();
    virarFlashcard();
  }
});

cardAnterior.addEventListener("click", voltarCard);
cardProximo.addEventListener("click", avancarCard);

document.getElementById("proximoFlashcard").addEventListener("click", () => {
  if (cardAtual === flashcards.length - 1) {
    cardAtual = 0;
    mostrarFlashcard();
  } else {
    avancarCard();
  }
});

mostrarFlashcard();


// ========================================
// 4. EXERCÍCIO DE RESPIRAÇÃO
// ========================================

const respiracaoCirculo = document.getElementById("respiracaoCirculo");
const respiracaoTexto = document.getElementById("respiracaoTexto");
const respiracaoInstrucao = document.getElementById("respiracaoInstrucao");
const respiracaoBotao = document.getElementById("respiracaoBotao");

let respiracaoAtiva = false;
let temporizadorRespiracao = null;
let etapaRespiracao = 0;
let inicioRespiracao = 0;

const etapasRespiracao = [
  {
    texto: "Inspire",
    instrucao: "Inspire suavemente, sem puxar o ar à força.",
    duracao: 4000
  },
  {
    texto: "Solte o ar",
    instrucao: "Expire devagar, apenas até onde for confortável.",
    duracao: 4000
  }
];

function atualizarEtapaRespiracao() {
  if (!respiracaoAtiva) return;

  const etapa = etapasRespiracao[etapaRespiracao];

  respiracaoTexto.textContent = etapa.texto;
  respiracaoInstrucao.textContent = etapa.instrucao;

  temporizadorRespiracao = setTimeout(() => {
    if (!respiracaoAtiva) return;

    etapaRespiracao = (etapaRespiracao + 1) % etapasRespiracao.length;
    atualizarEtapaRespiracao();
  }, etapa.duracao);
}

function pararRespiracao() {
  respiracaoAtiva = false;

  if (temporizadorRespiracao !== null) {
    clearTimeout(temporizadorRespiracao);
    temporizadorRespiracao = null;
  }

  respiracaoCirculo.classList.remove("ativo");
  respiracaoTexto.textContent = "Pronto?";
  respiracaoInstrucao.textContent =
    "Encontre uma posição confortável e respire normalmente.";
  respiracaoBotao.textContent = "Começar novamente";
}

function iniciarRespiracao() {
  if (respiracaoAtiva) {
    pararRespiracao();
    respiracaoBotao.textContent = "Continuar quando quiser";
    return;
  }

  respiracaoAtiva = true;
  etapaRespiracao = 0;

  respiracaoCirculo.classList.add("ativo");
  respiracaoBotao.textContent = "Encerrar exercício";

  atualizarEtapaRespiracao();
}

respiracaoBotao.addEventListener("click", iniciarRespiracao);


// ========================================
// 5. ALONGAMENTOS
// ========================================

const alongamentos = [
  {
    emoji: "🙆",
    titulo: "Solte os ombros",
    descricao:
      "Eleve os ombros suavemente em direção às orelhas e depois relaxe. " +
      "Repita algumas vezes, sem forçar.",
  },
  {
    emoji: "🙋",
    titulo: "Alongue os braços",
    descricao:
      "Estenda um braço suavemente à frente e depois troque de lado. " +
      "Faça apenas o movimento que for confortável.",
  },
  {
    emoji: "🧘",
    titulo: "Faça uma pausa",
    descricao:
      "Sente-se de forma confortável, relaxe as mãos e perceba sua respiração " +
      "por alguns instantes.",
  }
];

let alongamentoAtual = 0;

const alongamentoAnterior = document.getElementById("alongamentoAnterior");
const alongamentoProximo = document.getElementById("alongamentoProximo");

function mostrarAlongamento() {
  const alongamento = alongamentos[alongamentoAtual];

  document.getElementById("alongamentoIlustracao").textContent = alongamento.emoji;
  document.getElementById("alongamentoPasso").textContent =
    `Exercício ${alongamentoAtual + 1} de ${alongamentos.length}`;
  document.getElementById("alongamentoTitulo").textContent = alongamento.titulo;
  document.getElementById("alongamentoDescricao").textContent = alongamento.descricao;

  alongamentoAnterior.disabled = alongamentoAtual === 0;
  alongamentoProximo.textContent =
    alongamentoAtual === alongamentos.length - 1 ? "Recomeçar ↻" : "Próximo →";
}

alongamentoAnterior.addEventListener("click", () => {
  if (alongamentoAtual > 0) {
    alongamentoAtual--;
    mostrarAlongamento();
  }
});

alongamentoProximo.addEventListener("click", () => {
  alongamentoAtual = (alongamentoAtual + 1) % alongamentos.length;
  mostrarAlongamento();
});

mostrarAlongamento();


// ========================================
// 6. MENSAGENS DE APOIO
// ========================================

const mensagens = [
  "Você merece cuidado, inclusive nos dias difíceis.",
  "Não precisa resolver tudo de uma vez. Um passo já é alguma coisa.",
  "Descansar também faz parte de cuidar de si.",
  "Seus sentimentos merecem ser ouvidos, sem julgamentos.",
  "Pedir ajuda pode ser um passo importante.",
  "Tente falar consigo mesmo com a mesma gentileza que teria com um amigo.",
  "Você pode fazer uma pausa e retomar as coisas quando estiver pronto."
];

let mensagemAtual = 0;

document.getElementById("novaMensagem").addEventListener("click", () => {
  mensagemAtual = (mensagemAtual + 1) % mensagens.length;
  document.getElementById("mensagemApoio").textContent = mensagens[mensagemAtual];
});


// ========================================
// 7. FINALIZAÇÃO
// ========================================

console.log("Mente+ carregado com sucesso.");