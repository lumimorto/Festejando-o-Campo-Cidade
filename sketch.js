// Variáveis globais
let solY = 0;
let nuvens = [];
let casas = [];
let arvores = [];
let pessoasCampo = [];
let festaAtiva = false;
let contadorFesta = 0;
let coresFesta = [];
let efeitosFesta = {
  fogos: [],
  luzes: [],
  ultimoFogo: 0
};
let velocidadeNuvens = 0.3;
let estadoJogo = "cutscene"; // cutscene, tutorial, menu, jogando, fazenda, final, gameover
let botaoIniciar;
let botaoGuia;
let guiaVisivel = false;
let creditosVisiveis = false;
let fadeOpacity = 255;
let tempoDia = 0;
let estrelas = [];
let cutsceneFrame = 0;
let tutorialFrame = 0;
let cutsceneTexto = [
  "Pedro, um jovem da cidade, chegou à aldeia!",
  "Ele veio buscar uma nova vida no campo.",
  "Ajude Pedro a se conectar e cultivar um futuro!"
];
let tutorialTexto = [
  "Use as SETAS para mover Pedro pela aldeia.",
  "Pressione E para conversar e escolher opções de diálogo.",
  "Na fazenda, use A para arar, P para plantar, W para regar!",
  "Cuidado com os corvos na fazenda! Use ESPAÇO para espantá-los."
];
let enxadaEquipada = false;
let regadorEquipado = false;
let fazendaPlantada = [];
let npcFazenda = null;
let lotesArados = 0;
let lotesPlantados = 0;
let lotesRegados = 0;
let objetivoConcluido = false;
let empatia = 50;
let dialogoOpcao = null;
let fireworksTriggered = false;
let corvos = [];
let minigameAtivo = false;
let minigameAcao = null;
let minigameLote = null;
let missaoAtiva = false;
let tempoMissao = 0;
let errosArar = 0;
let maxErrosArar = 3;
let sementes = 5; // Aumentado para a missão
let maxSementes = 5;
let agua = 100; // Porcentagem
let particulas = []; // Para efeitos visuais

let jogador = {
  x: 100,
  y: 400,
  velocidade: 3,
  conexoes: 0,
  conexoesNecessarias: 5,
  dialogoAtivo: null,
  tempoDialogo: 0
};

function getEmpathyLevel() {
  if (empatia >= 70) return "alta";
  if (empatia >= 40) return "media";
  return "baixa";
}

// --- DIÁLOGOS MELHORADOS ---
let dialogos = [{ // João, agricultor
    nome: "João",
    conexao: {
      texto: "Olá! Sou o João. A terra por aqui é generosa. O que te traz à nossa aldeia?",
      opcoes: [{
        texto: "Busco uma vida mais conectada com a natureza.",
        empatia: 15
      }, {
        texto: "A cidade grande já não era para mim.",
        empatia: -15
      }]
    },
    fazenda: { // Diálogos durante a fase da fazenda, baseados na empatia
      alta: "Pedro, sua dedicação é inspiradora! Você trata a terra com o respeito que ela merece.",
      media: "Seu campo está progredindo bem. Continue assim e terá uma ótima colheita.",
      baixa: "A terra precisa de mais que trabalho, precisa de sentimento. Tente ouvir o que ela diz."
    }
  }, { // Ana, pastora (Nome alterado para diversificar)
    nome: "Ana",
    conexao: {
      texto: "Oi, sou a Ana. Minhas ovelhas são minha família. Você gosta de animais?",
      opcoes: [{
        texto: "Amo! Eles trazem tanta alegria para a vida.",
        empatia: 15
      }, {
        texto: "Não muito. São barulhentos e fazem bagunça.",
        empatia: -15
      }]
    },
    fazenda: {
      alta: "Assim como cuido das minhas ovelhas, você cuida do seu milho. A vida floresce com carinho!",
      media: "O campo exige paciência, seja com plantas ou animais. Você está aprendendo.",
      baixa: "Suas plantas parecem solitárias... talvez precisem de mais da sua presença."
    }
  }, { // Antônio, carpinteiro
    nome: "Antônio",
    conexao: {
      texto: "Sou Antônio, o carpinteiro. Cada peça de madeira tem uma história. O que você gosta de construir?",
      opcoes: [{
        texto: "Gosto de construir relações e um bom futuro.",
        empatia: 15
      }, {
        texto: "Não sou de construir, prefiro coisas prontas.",
        empatia: -15
      }]
    },
    fazenda: {
      alta: "Vejo que você está construindo um belo futuro aqui, Pedro. Essa plantação é a fundação!",
      media: "Um bom trabalho, assim como uma boa cadeira, precisa de uma base sólida. Continue firme.",
      baixa: "Parece que sua estrutura está um pouco frágil. Cuidado para não desmoronar."
    }
  }, { // Clara, artesã
    nome: "Clara",
    conexao: {
      texto: "Olá, sou a Clara. Eu transformo o que a natureza me dá em arte. O que te inspira?",
      opcoes: [{
        texto: "A beleza das coisas simples, como o nascer do sol.",
        empatia: 15
      }, {
        texto: "Dinheiro e sucesso, para ser sincero.",
        empatia: -15
      }]
    },
    fazenda: {
      alta: "Sua plantação é uma obra de arte! As cores e a vida... é lindo de ver!",
      media: "Há potencial na sua fazenda. Com um pouco mais de cor e vida, ficará perfeita.",
      baixa: "Falta alma nesse campo. A arte, e a agricultura, precisam de paixão."
    }
  }, { // Helena, professora (Nome alterado)
    nome: "Helena",
    conexao: {
      texto: "Bem-vindo! Sou Helena, a professora. Acredito que sempre há algo novo para aprender. E você?",
      opcoes: [{
        texto: "Concordo! Estou aqui para aprender a viver de um novo jeito.",
        empatia: 15
      }, {
        texto: "Acho que já sei tudo o que preciso.",
        empatia: -15
      }]
    },
    fazenda: {
      alta: "Você aprendeu a lição mais importante, Pedro: a da cooperação e do respeito. Nota 10!",
      media: "Sua dedicação é um bom exemplo para todos. Continue estudando os ciclos da natureza.",
      baixa: "Parece que você faltou a algumas aulas sobre cultivo. Quer uma ajuda para recuperar?"
    }
  },
  // NPC da Missão - MARIA
  {
    nome: "Maria",
    conexao: {
      texto: "Oi, Pedro! Sou a Maria. A época do plantio chegou e eu precisaria de uma grande ajuda. Poderia me ajudar na plantação?",
      opcoes: [{
        texto: "Sim, ficaria muito feliz em ajudar!",
        empatia: 20
      }, {
        texto: "Não, não quero me sujar.",
        empatia: -50
      }]
    },
    fazenda: {
      alta: "Você tem um dom para a terra, Pedro! Obrigada por ser essa pessoa incrível!",
      media: "O milho está crescendo forte, graças a você. Continue com o bom trabalho.",
      baixa: "Hmm... as plantas precisam de mais carinho. Elas sentem quando não são prioridade."
    }
  }
];

function setup() {
  createCanvas(1220, 800);

  botaoIniciar = {
    x: width / 2 - 100,
    y: height / 2 + 60, // Posição ajustada
    largura: 200,
    altura: 50,
    texto: "INICIAR JOGO",
    cor: color(100, 200, 100),
    corHover: color(120, 220, 120),
    hover: false,
    scale: 1
  };

  botaoGuia = {
    x: width / 2 - 100,
    y: height / 2 + 120, // Posição ajustada para baixo
    largura: 200,
    altura: 50,
    texto: "GUIA",
    cor: color(100, 100, 200),
    corHover: color(120, 120, 220),
    hover: false,
    scale: 1
  };

  for (let i = 0; i < 50; i++) {
    estrelas.push({
      x: random(width),
      y: random(350),
      tamanho: random(2, 4),
      brilho: random(100, 255)
    });
  }

  inicializarElementos();
}

function inicializarElementos() {
  nuvens = [];
  for (let i = 0; i < 6; i++) {
    nuvens.push({
      x: random(width),
      y: random(50, 180),
      velocidade: random(0.1, 0.5),
      tamanho: random(80, 120),
      partes: []
    });

    for (let j = 0; j < 3; j++) {
      nuvens[i].partes.push({
        offsetX: random(-20, 20),
        offsetY: random(-10, 10),
        tamanhoX: random(nuvens[i].tamanho * 0.7, nuvens[i].tamanho),
        tamanhoY: random(nuvens[i].tamanho * 0.4, nuvens[i].tamanho * 0.6)
      });
    }
  }

  casas = [];
  for (let i = 0; i < 8; i++) {
    let janelasPorAndar = floor(random(2, 4));
    let andares = floor(random(1, 3));
    let larguraCasa = janelasPorAndar * 20 + 20;

    casas.push({
      x: 100 + i * (larguraCasa + 30),
      y: 350,
      altura: andares * 40 + 40,
      largura: larguraCasa,
      janelas: [],
      estadoNormal: [],
      fumaca: random() > 0.5
    });

    for (let a = 0; a < andares; a++) {
      casas[i].janelas[a] = [];
      casas[i].estadoNormal[a] = [];
      for (let j = 0; j < janelasPorAndar; j++) {
        let acesa = random() > (tempoDia < 500 ? 0.6 : 0.2);
        casas[i].janelas[a][j] = {
          acesa: acesa,
          cor: acesa ? color(255, 255, 150 + random(-50, 0)) : color(70, 70, 70)
        };
        casas[i].estadoNormal[a][j] = {
          acesa: acesa,
          cor: acesa ? color(255, 255, 150 + random(-50, 0)) : color(70, 70, 70)
        };
      }
    }
  }

  arvores = [];
  for (let i = 0; i < 15; i++) {
    let x, y, posicaoValida;
    let tentativas = 0;

    do {
      posicaoValida = true;
      x = random(width);
      y = 380 + random(150);

      for (let arvore of arvores) {
        if (dist(x, y, arvore.x, arvore.y) < 60) {
          posicaoValida = false;
          break;
        }
      }

      if (y > 460 && y < 580 && x > 250 && x < 650) {
        posicaoValida = false;
      }

      tentativas++;
    } while (!posicaoValida && tentativas < 100);

    if (posicaoValida) {
      arvores.push({
        x: x,
        y: y,
        tamanhoCopa: random(40, 70),
        alturaTronco: random(50, 80),
        temFrutos: random() > 0.7,
        tipo: random() > 0.5 ? 'folhagem' : 'pinheiro',
        oscilacao: random(TWO_PI),
        folhas: []
      });

      if (arvores[arvores.length - 1].tipo === 'folhagem') {
        for (let j = 0; j < 10; j++) {
          arvores[arvores.length - 1].folhas.push({
            offsetX: random(-arvores[arvores.length - 1].tamanhoCopa / 2, arvores[arvores.length - 1].tamanhoCopa / 2),
            offsetY: random(-arvores[arvores.length - 1].tamanhoCopa / 2, arvores[arvores.length - 1].tamanhoCopa / 2),
            tamanho: random(4, 8),
            velocidade: random(0.005, 0.02)
          });
        }
      }
    }
  }

  pessoasCampo = [];
  for (let i = 0; i < 5; i++) { // Ajustado para 5 NPCs na vila
    let x, y, posicaoValida;
    let tentativas = 0;

    do {
      posicaoValida = true;
      x = random(50, 800);
      y = 400 + random(150);

      if (y > 460 && y < 580 && x > 250 && x < 650) {
        posicaoValida = false;
      }

      for (let pessoa of pessoasCampo) {
        if (dist(x, y, pessoa.x, pessoa.y) < 50) {
          posicaoValida = false;
          break;
        }
      }

      tentativas++;
    } while (!posicaoValida && tentativas < 100);

    if (posicaoValida) {
      pessoasCampo.push({
        x: x,
        y: y,
        velocidade: random(0.5, 1.5),
        direcao: random([-1, 1]),
        corRoupa: color(random(100, 200), random(100, 200), random(100, 200)),
        dialogo: dialogos[i],
        conversado: false
      });
    }
  }

  npcFazenda = {
    x: 800,
    y: 400,
    corRoupa: color(220, 100, 120),
    dialogo: dialogos[5], // Maria é o 6º diálogo (índice 5)
    conversado: false
  };

  fazendaPlantada = [];
  for (let i = 0; i < 9; i++) {
    fazendaPlantada.push({
      x: 200 + (i % 3) * 60,
      y: 400 + floor(i / 3) * 60,
      arado: false,
      plantado: false,
      regado: false,
      growthStage: 0,
      tipoPlanta: 'milho',
      growthTimer: 0,
      corvo: null,
      ocupada: false,
      tempoOcupada: 0
    });
  }

  corvos = [];
  for (let i = 0; i < 3; i++) {
    corvos.push(criarCorvo());
  }

  coresFesta = [
    color(255, 120, 120), color(120, 255, 120),
    color(120, 120, 255), color(255, 255, 120),
    color(255, 120, 255), color(120, 255, 255)
  ];
}

// Função para criar corvos, facilitando a reposição
function criarCorvo() {
  return {
    x: random(-50, width + 50),
    y: random(-20, -100),
    vx: 0,
    vy: 0,
    velocidade: random(1, 2),
    estado: 'voando', // voando, pousando, pousado, fugindo
    alvoLote: null,
    tempoNoLote: 0,
    direcaoVoando: random(TWO_PI)
  };
}


function draw() {
  if (estadoJogo === "cutscene") {
    desenharCutscene();
  } else if (estadoJogo === "tutorial") {
    desenharTutorial();
  } else if (estadoJogo === "menu") {
    desenharMenu();
  } else if (estadoJogo === "jogando") {
    background(150, 200, 255);
    desenharCeu();
    desenharSol();
    atualizarNuvens();
    desenharPaisagem();
    desenharAldeia();
    desenharCampo();
    atualizarNPCs();
    desenharAldeoes();
    desenharJogador();
    if (jogador.dialogoAtivo !== null) {
      desenharDialogo();
    }
    desenharHUDVila();
  } else if (estadoJogo === "fazenda") {
    background(150, 200, 255);
    desenharCeu();
    desenharSol();
    atualizarNuvens();
    desenharFazenda();
    atualizarCorvos();
    desenharCorvos();
    desenharAldeoesFazenda();
    desenharJogador();
    if (jogador.dialogoAtivo !== null) {
      desenharDialogo();
    }
    if (minigameAtivo) {
      desenharMinigame();
    }
    desenharEfeitosFazenda();
    atualizarCrescimentoPlantas();
    desenharHUDFazenda();
    if (objetivoConcluido && !fireworksTriggered) {
      fireworksTriggered = true;
      efeitosFesta.ultimoFogo = frameCount;
    }
    if (fireworksTriggered) {
      desenharFogos();
      if (efeitosFesta.fogos.length === 0 && frameCount - efeitosFesta.ultimoFogo > 120) {
        estadoJogo = "final";
        fadeOpacity = 255;
      }
    }
  } else if (estadoJogo === "final") {
    desenharFinal();
  } else if (estadoJogo === "gameover") {
    desenharGameOver();
  }

  // Atualizar e desenhar partículas
  for (let i = particulas.length - 1; i >= 0; i--) {
    let p = particulas[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vida--;
    if (p.vida <= 0) {
      particulas.splice(i, 1);
    } else {
      fill(139, 69, 19, p.vida * 5);
      noStroke();
      ellipse(p.x, p.y, 5, 5);
    }
  }

  if (fadeOpacity > 0) {
    fill(0, fadeOpacity);
    rect(0, 0, width, height);
    fadeOpacity -= 5;
  }

  tempoDia = (tempoDia + 1) % 1000;
}

function atualizarNPCs() {
  for (let pessoa of pessoasCampo) {
    if (pessoa.dialogoAtivo) continue;

    pessoa.x += pessoa.velocidade * pessoa.direcao;
    let pertoDoRio = pessoa.x > 250 && pessoa.x < 650 && pessoa.y > 460 && pessoa.y < 580;

    if (pertoDoRio || pessoa.x < 50 || pessoa.x > width - 50) {
      pessoa.direcao *= -1;
    }
  }
}

function desenharGameOver() {
  background(50, 50, 50);
  fill(255, 230);
  rect(50, height / 2 - 100, width - 100, 200, 10);
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("FIM DE JOGO", width / 2, height / 2 - 60);
  fill(0);
  textSize(18);
  text("Infelizmente, você não conseguiu se conectar com a aldeia.", width / 2, height / 2);
  textSize(16);
  text("Pressione R para voltar ao menu e tentar novamente.", width / 2, height / 2 + 50);
}

function atualizarCrescimentoPlantas() {
  for (let lote of fazendaPlantada) {
    if (lote.plantado && lote.regado && lote.growthStage < 2 && !lote.corvo) {
      lote.growthTimer++;
      if (lote.growthTimer >= 300) {
        lote.growthStage++;
        lote.growthTimer = 0;
      }
    }
  }
}

function desenharFogos() {
  if (frameCount - efeitosFesta.ultimoFogo > 30 && efeitosFesta.fogos.length < 10) {
    efeitosFesta.fogos.push({
      x: random(200, 700),
      y: random(50, 200),
      cor: random(coresFesta),
      particulas: []
    });
    efeitosFesta.ultimoFogo = frameCount;
  }

  for (let i = efeitosFesta.fogos.length - 1; i >= 0; i--) {
    let fogo = efeitosFesta.fogos[i];
    if (fogo.particulas.length === 0) { // Ainda não explodiu
      fill(255);
      ellipse(fogo.x, height - (frameCount % 60) * 10, 5, 10);
      if (height - (frameCount % 60) * 10 < fogo.y) {
        for (let j = 0; j < 100; j++) {
          fogo.particulas.push({
            x: fogo.x,
            y: fogo.y,
            vx: random(-5, 5),
            vy: random(-5, 5),
            vida: 60,
            cor: fogo.cor
          });
        }
      }
    } else { // Explosão
      let todasMortas = true;
      for (let p of fogo.particulas) {
        if (p.vida > 0) {
          todasMortas = false;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1; // Gravidade
          p.vida--;
          fill(p.cor, p.vida * 4);
          noStroke();
          ellipse(p.x, p.y, 5, 5);
        }
      }
      if (todasMortas) {
        efeitosFesta.fogos.splice(i, 1);
      }
    }
  }
}

function desenharCutscene() {
  background(0);

  if (cutsceneFrame < 450) {
    let onibusX = map(cutsceneFrame, 0, 200, -200, 300);
    if (cutsceneFrame > 200) onibusX = 300;

    fill(200, 100, 0);
    rect(onibusX, height / 2, 150, 80, 10);
    fill(50);
    rect(onibusX + 20, height / 2 + 10, 40, 30);
    rect(onibusX + 80, height / 2 + 10, 40, 30);
    fill(0);
    ellipse(onibusX + 30, height / 2 + 80, 20, 20);
    ellipse(onibusX + 120, height / 2 + 80, 20, 20);
  }

  if (cutsceneFrame >= 250 && cutsceneFrame <= 450) {
    let pedroX = map(cutsceneFrame, 250, 450, 300 + 75, 400);
    let pedroY = height / 2 + 40;
    desenharPessoa(pedroX, pedroY, color(220, 180, 140), color(200, 200, 200));
  }

  fill(255, 230);
  rect(50, height - 120, width - 100, 100, 10);
  fill(0);
  textSize(22);
  textAlign(CENTER, CENTER);
  let textoIndex = floor(cutsceneFrame / 200) % cutsceneTexto.length;
  text(cutsceneTexto[textoIndex], width / 2, height - 70);

  cutsceneFrame++;
  if (cutsceneFrame > 600) {
    fadeOpacity = 255;
    estadoJogo = "tutorial";
    cutsceneFrame = 0;
  }
}

function desenharTutorial() {
  background(150, 200, 255);
  desenharCeu();
  desenharSol();
  desenharPaisagem();

  fill(255, 230);
  rect(50, height / 2 - 100, width - 100, 200, 10);
  fill(0);
  textSize(22);
  textAlign(CENTER, CENTER);
  let textoIndex = floor(tutorialFrame / 200) % tutorialTexto.length;
  text(tutorialTexto[textoIndex], width / 2, height / 2);

  tutorialFrame++;
  if (tutorialFrame > 800) {
    fadeOpacity = 255;
    estadoJogo = "menu";
    tutorialFrame = 0;
  }
}

function desenharMenu() {
  // Fundo gradiente do céu
  for (let y = 0; y <= height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(30, 60, 120), color(150, 200, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
  noStroke();

  // Nuvens animadas
  atualizarNuvens();

  // Chão de grama
  fill(80, 180, 80);
  rect(0, height - 100, width, 100);

  // Personagem andando no menu
  desenharPessoa(150, height - 80, color(220, 180, 140), color(50, 100, 180), true);

  // Título do Jogo com estilo
  fill(255, 255, 200);
  stroke(40, 50, 30);
  strokeWeight(6);
  textSize(72);
  textFont('Georgia');
  textAlign(CENTER, CENTER);
  text("Conexões na Aldeia", width / 2, height / 3);
  textFont('sans-serif');
  noStroke();

  // Subtítulo
  fill(255);
  textSize(18);
  text("Ajude Pedro a construir uma vida no campo", width / 2, height / 2 - 60);

  // Botões com animação de hover
  let hoverScale = 1.05;
  let normalScale = 1.0;

  botaoIniciar.scale = lerp(botaoIniciar.scale, botaoIniciar.hover ? hoverScale : normalScale, 0.1);
  botaoGuia.scale = lerp(botaoGuia.scale, botaoGuia.hover ? hoverScale : normalScale, 0.1);

  // Botão Iniciar
  push();
  translate(botaoIniciar.x + botaoIniciar.largura / 2, botaoIniciar.y + botaoIniciar.altura / 2);
  scale(botaoIniciar.scale);
  fill(botaoIniciar.hover ? botaoIniciar.corHover : botaoIniciar.cor);
  rect(-botaoIniciar.largura / 2, -botaoIniciar.altura / 2, botaoIniciar.largura, botaoIniciar.altura, 10);
  fill(255);
  textSize(22);
  text(botaoIniciar.texto, 0, 0);
  pop();

  // Botão Guia
  push();
  translate(botaoGuia.x + botaoGuia.largura / 2, botaoGuia.y + botaoGuia.altura / 2);
  scale(botaoGuia.scale);
  fill(botaoGuia.hover ? botaoGuia.corHover : botaoGuia.cor);
  rect(-botaoGuia.largura / 2, -botaoGuia.altura / 2, botaoGuia.largura, botaoGuia.altura, 10);
  fill(255);
  textSize(22);
  text(botaoGuia.texto, 0, 0);
  pop();

  let creditoHover = mouseX > 20 && mouseX < 120 && mouseY > height - 50 && mouseY < height - 20;
  fill(creditoHover ? color(180, 180, 180, 200) : color(200, 200, 200, 150));
  rect(20, height - 50, 100, 30, 5);
  fill(0);
  textSize(14);
  text("CRÉDITOS", 70, height - 35);

  // Pop-ups
  if (guiaVisivel) {
    fill(0, 0, 0, 200);
    rect(width / 2 - 250, height / 2 - 200, 500, 350, 10);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("GUIA DO JOGO", width / 2, height / 2 - 150);
    textSize(18);
    textAlign(LEFT, TOP);
    for (let i = 0; i < tutorialTexto.length; i++) {
      text(tutorialTexto[i], width / 2 - 230, height / 2 - 120 + i * 40, 460, 100);
    }
    let voltarHover = mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 120 && mouseY < height / 2 + 160;
    fill(voltarHover ? color(255, 140, 140) : color(255, 120, 120));
    rect(width / 2 - 50, height / 2 + 120, 100, 40, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Voltar", width / 2, height / 2 + 140);
  }

  if (creditosVisiveis) {
    fill(0, 0, 0, 200);
    rect(width / 2 - 200, height / 2 - 150, 400, 300, 10);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("CRÉDITOS", width / 2, height / 2 - 100);
    textSize(16);
    text("Desenvolvido por: Lucas Miguel Suenaga", width / 2, height / 2 - 75);
    text("Professor: Leandro", width / 2, height / 2 - 50);
    text("Escola: Colégio Cívico-Militar Do Paraná", width / 2, height / 2 - 25);
    let voltarHover = mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 80 && mouseY < height / 2 + 120;
    fill(voltarHover ? color(255, 140, 140) : color(255, 120, 120));
    rect(width / 2 - 50, height / 2 + 80, 100, 40, 5);
    fill(255);
    text("Voltar", width / 2, height / 2 + 100);
  }
}


function mouseMoved() {
  if (estadoJogo === "menu") {
    botaoIniciar.hover = mouseX > botaoIniciar.x && mouseX < botaoIniciar.x + botaoIniciar.largura &&
      mouseY > botaoIniciar.y && mouseY < botaoIniciar.y + botaoIniciar.altura;
    botaoGuia.hover = mouseX > botaoGuia.x && mouseX < botaoGuia.x + botaoGuia.largura &&
      mouseY > botaoGuia.y && mouseY < botaoGuia.y + botaoGuia.altura;
  }
}

function mousePressed() {
  if (guiaVisivel) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
      mouseY > height / 2 + 120 && mouseY < height / 2 + 160) {
      guiaVisivel = false;
      return; // Impede que o clique "vaze" para os botões do menu
    }
  }

  if (creditosVisiveis) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
      mouseY > height / 2 + 80 && mouseY < height / 2 + 120) {
      creditosVisiveis = false;
      return; // Impede que o clique "vaze"
    }
  }

  if (estadoJogo === "menu") {
    if (botaoIniciar.hover) {
      estadoJogo = "jogando";
      fadeOpacity = 255;
    } else if (botaoGuia.hover) {
      guiaVisivel = true;
    } else if (mouseX > 20 && mouseX < 120 && mouseY > height - 50 && mouseY < height - 20) {
      creditosVisiveis = true;
    }
  }
}

function keyPressed() {
  if ((estadoJogo === "jogando" || estadoJogo === "fazenda") && jogador.dialogoAtivo !== null) {
    if (dialogoOpcao === null && (keyCode === 49 || keyCode === 50)) { // Tecla '1' ou '2'
      dialogoOpcao = keyCode === 49 ? 0 : 1;

      let pessoa = (jogador.dialogoAtivo < pessoasCampo.length) ? pessoasCampo[jogador.dialogoAtivo] : npcFazenda;
      empatia = constrain(empatia + pessoa.dialogo.conexao.opcoes[dialogoOpcao].empatia, 0, 100);

      if (empatia <= 0) {
        estadoJogo = "gameover";
        fadeOpacity = 255;
        return;
      }

      if (pessoa === npcFazenda && !missaoAtiva) {
        if (dialogoOpcao === 0) { // Aceitou ajudar
          enxadaEquipada = true;
          regadorEquipado = true;
          missaoAtiva = true;
        } else { // Recusou ajudar
          // *** MUDANÇA APLICADA AQUI ***
          estadoJogo = "gameover"; // Vai para a tela de Game Over
          objetivoConcluido = false;
          fadeOpacity = 255;
          return;
        }
      }

      if (estadoJogo === "jogando" && jogador.dialogoAtivo < pessoasCampo.length) {
        jogador.conexoes++;
        pessoasCampo[jogador.dialogoAtivo].conversado = true;
        if (jogador.conexoes >= jogador.conexoesNecessarias) {
          estadoJogo = "fazenda";
          fadeOpacity = 255;
          jogador.x = 100;
          jogador.y = 400;
        }
      }

      jogador.tempoDialogo = 180;
    } else if (keyCode === 32 || keyCode === 69) { // Espaço ou E para fechar diálogo
      jogador.dialogoAtivo = null;
      dialogoOpcao = null;
    }
  } else if (estadoJogo === "fazenda" && !minigameAtivo) {
    if (keyCode === 65 && enxadaEquipada) { // 'A' para Arar
      for (let lote of fazendaPlantada) {
        if (!lote.arado && dist(jogador.x, jogador.y, lote.x + 15, lote.y + 15) < 30) {
          minigameAtivo = true;
          minigameAcao = 'arar';
          minigameLote = lote;
          break;
        }
      }
    } else if (keyCode === 80 && enxadaEquipada && sementes > 0) { // 'P' para Plantar
      for (let lote of fazendaPlantada) {
        if (lote.arado && !lote.plantado && dist(jogador.x, jogador.y, lote.x + 15, lote.y + 15) < 30) {
          minigameAtivo = true;
          minigameAcao = 'plantar';
          minigameLote = lote;
          break;
        }
      }
    } else if (keyCode === 87 && regadorEquipado && agua > 0) { // 'W' para Regar
      for (let lote of fazendaPlantada) {
        if (lote.plantado && !lote.regado && dist(jogador.x, jogador.y, lote.x + 15, lote.y + 15) < 30) {
          minigameAtivo = true;
          minigameAcao = 'regar';
          minigameLote = lote;
          break;
        }
      }
    } else if (keyCode === 32) { // Espaço para espantar
      for (let corvo of corvos) {
        if (corvo.estado === 'pousado' && dist(jogador.x, jogador.y, corvo.x, corvo.y) < 70) {
          corvo.estado = 'fugindo';
          corvo.alvoLote.corvo = null; // Libera o lote
          corvo.alvoLote.ocupada = true;
          corvo.alvoLote.tempoOcupada = 180;
          corvo.alvoLote = null;
          break;
        }
      }
    }
  } else if (estadoJogo === "fazenda" && minigameAtivo && keyCode === 32) {
    let indicatorPos = 100 + 100 * sin(frameCount * 0.1);
    let indicatorX = (width / 2 - 100) + indicatorPos;
    let targetLeft = width / 2 - 20;
    let targetRight = width / 2 + 20;

    if (indicatorX >= targetLeft && indicatorX <= targetRight) { // Sucesso
      if (minigameAcao === 'arar') {
        minigameLote.arado = true;
        lotesArados++;
        for (let i = 0; i < 20; i++) particulas.push({
          x: minigameLote.x + 15,
          y: minigameLote.y + 15,
          vx: random(-2, 2),
          vy: random(-3, 0),
          vida: 30
        });
      } else if (minigameAcao === 'plantar') {
        minigameLote.plantado = true;
        lotesPlantados++;
        sementes--;
        if (lotesPlantados >= 5) objetivoConcluido = true;
      } else if (minigameAcao === 'regar') {
        minigameLote.regado = true;
        lotesRegados++;
        agua -= 10;
      }
    } else { // Falha
      if (minigameAcao === 'arar') errosArar++;
      else if (minigameAcao === 'plantar') sementes--;
      else if (minigameAcao === 'regar') agua -= 5;
      if (errosArar >= maxErrosArar) {
        estadoJogo = "gameover";
        fadeOpacity = 255;
      }
    }
    minigameAtivo = false;
  } else if ((estadoJogo === "final" || estadoJogo === "gameover") && keyCode === 82) { // 'R' para Resetar
    resetGame();
  }
}


function resetGame() {
  empatia = 50;
  jogador.conexoes = 0;
  lotesArados = 0;
  lotesPlantados = 0;
  lotesRegados = 0;
  objetivoConcluido = false;
  fireworksTriggered = false;
  enxadaEquipada = false;
  regadorEquipado = false;
  estadoJogo = "menu"; // Volta para o menu
  fadeOpacity = 255;
  jogador.x = 100;
  jogador.y = 400;
  jogador.dialogoAtivo = null;
  dialogoOpcao = null;
  minigameAtivo = false;
  missaoAtiva = false;
  errosArar = 0;
  sementes = 5;
  agua = 100;

  // Reinicia estado dos NPCs
  for (let pessoa of pessoasCampo) {
    pessoa.conversado = false;
  }
  npcFazenda.conversado = false;

  // Limpa a fazenda
  for (let lote of fazendaPlantada) {
    lote.arado = false;
    lote.plantado = false;
    lote.regado = false;
    lote.growthStage = 0;
    lote.corvo = null;
    lote.ocupada = false;
  }

  // Reinicia corvos
  corvos = [];
  for (let i = 0; i < 3; i++) {
    corvos.push(criarCorvo());
  }
}

function desenharCeu() {
  let isNoite = tempoDia > 500;
  let inter = map(sin((tempoDia / 1000) * PI - PI / 2), -1, 1, 0, 1);
  let corManha = color(255, 230, 200);
  let corDia = color(150, 200, 255);
  let corNoite = color(20, 40, 80);

  let corCeu;
  if (inter < 0.5) {
    corCeu = lerpColor(corNoite, corManha, inter * 2);
  } else {
    corCeu = lerpColor(corManha, corDia, (inter - 0.5) * 2);
  }
  background(corCeu);

  if (isNoite || inter < 0.2 || inter > 0.8) {
    let starAlpha = (1 - (abs(inter - 0.5) * 2)) * 255;
    for (let estrela of estrelas) {
      fill(255, starAlpha * (0.5 + 0.5 * sin(frameCount * 0.05 + estrela.x)));
      noStroke();
      ellipse(estrela.x, estrela.y, estrela.tamanho, estrela.tamanho);
    }
  }
}

function desenharSol() {
  let solX = map(tempoDia, 0, 1000, 0, width);
  let solY = height / 2 - sin((tempoDia / 1000) * PI) * (height / 2 - 50);

  let solCor = color(255, 255, 0);
  let luaCor = color(240, 240, 255);

  if (tempoDia < 500) { // Dia
    fill(solCor);
    ellipse(solX, solY, 80, 80);
  } else { // Noite
    fill(luaCor);
    ellipse(solX, solY, 60, 60);
    fill(20, 40, 80, 200);
    ellipse(solX + 10, solY - 10, 60, 60);
  }
}

function atualizarNuvens() {
  for (let nuvem of nuvens) {
    nuvem.x += nuvem.velocidade * velocidadeNuvens;
    if (nuvem.x > width + nuvem.tamanho) {
      nuvem.x = -nuvem.tamanho;
    }
    fill(255, 255, 255, tempoDia < 500 ? 200 : 100);
    noStroke();
    for (let parte of nuvem.partes) {
      ellipse(nuvem.x + parte.offsetX, nuvem.y + parte.offsetY, parte.tamanhoX, parte.tamanhoY);
    }
  }
}

function desenharPaisagem() {
  noStroke();
  fill(70, 110, 70);
  beginShape();
  vertex(0, 350);
  bezierVertex(100, 350, 150, 250, 200, 300);
  bezierVertex(250, 350, 350, 200, 450, 350);
  bezierVertex(550, 500, 700, 180, 800, 300);
  vertex(width, 350);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  fill(tempoDia < 500 ? color(80, 180, 80) : color(50, 120, 50));
  rect(0, 350, width, height - 350);

  fill(100, 180, 220, 150);
  beginShape();
  vertex(0, 500);
  bezierVertex(200, 480, 400, 520, 700, 490);
  vertex(700, 550);
  bezierVertex(400, 580, 200, 540, 0, 560);
  endShape(CLOSE);

  fill(120, 80, 40);
  rect(350, 480, 200, 20);
  for (let i = 0; i < 5; i++) {
    rect(350 + i * 40, 460, 10, 20);
  }
}

function desenharFazenda() {
  noStroke();
  fill(tempoDia < 500 ? color(80, 180, 80) : color(50, 120, 50));
  rect(0, 350, width, height - 350);

  fill(178, 34, 34);
  rect(600, 350, 120, 100);
  fill(255);
  rect(600, 390, 120, 10, 5);
  fill(100, 80, 60);
  triangle(590, 350, 730, 350, 660, 300);

  for (let lote of fazendaPlantada) {
    fill(139, 69, 19, 150);
    rect(lote.x, lote.y, 30, 30, 5);
  }
}


function atualizarCorvos() {
  for (let i = corvos.length - 1; i >= 0; i--) {
    let corvo = corvos[i];

    switch (corvo.estado) {
      case 'voando':
        corvo.x += cos(corvo.direcaoVoando) * corvo.velocidade;
        corvo.y += sin(corvo.direcaoVoando) * corvo.velocidade;

        if (corvo.y > height || corvo.x < -50 || corvo.x > width + 50) {
          corvo.x = random(width);
          corvo.y = -20;
          corvo.direcaoVoando = random(PI / 4, 3 * PI / 4);
        }

        if (random() < 0.005) {
          let lotesDisponiveis = fazendaPlantada.filter(l => l.plantado && !l.ocupada && !l.corvo);
          if (lotesDisponiveis.length > 0) {
            corvo.alvoLote = random(lotesDisponiveis);
            corvo.alvoLote.corvo = corvo;
            corvo.estado = 'pousando';
          }
        }
        break;

      case 'pousando':
        let dx = corvo.alvoLote.x + 15 - corvo.x;
        let dy = corvo.alvoLote.y + 15 - corvo.y;
        let distToTarget = sqrt(dx * dx + dy * dy);
        corvo.x += (dx / distToTarget) * corvo.velocidade;
        corvo.y += (dy / distToTarget) * corvo.velocidade;

        if (distToTarget < 5) {
          corvo.estado = 'pousado';
          corvo.tempoNoLote = 0;
        }
        break;

      case 'pousado':
        corvo.tempoNoLote++;
        if (corvo.tempoNoLote > 360) { // 6 segundos
          corvo.alvoLote.plantado = false;
          corvo.alvoLote.regado = false;
          corvo.alvoLote.growthStage = 0;
          lotesPlantados = max(0, lotesPlantados - 1);
          corvo.alvoLote.corvo = null;
          corvo.estado = 'voando';
          corvo.direcaoVoando = random(TWO_PI);
        }
        break;

      case 'fugindo':
        corvo.y -= 4; // Voa para cima
        corvo.x += random(-1, 1);
        if (corvo.y < -50) {
          corvos.splice(i, 1);
        }
        break;
    }
  }

  if (corvos.length < 3 && random() < 0.01) {
    corvos.push(criarCorvo());
  }

  for (let lote of fazendaPlantada) {
    if (lote.ocupada) {
      lote.tempoOcupada--;
      if (lote.tempoOcupada <= 0) {
        lote.ocupada = false;
      }
    }
  }
}

function desenharCorvos() {
  for (let corvo of corvos) {
    fill(0, 0, 0, 50);
    ellipse(corvo.x, corvo.y + 10, 20, 8);

    fill(20);
    push();
    translate(corvo.x, corvo.y);

    let angle = sin(frameCount * 0.3) * (PI / 6);
    if (corvo.estado !== 'pousado') {
      push();
      rotate(angle);
      triangle(-5, 0, -20, -5, -15, 5);
      pop();
      push();
      rotate(-angle);
      triangle(5, 0, 20, -5, 15, 5);
      pop();
    }

    ellipse(0, 0, 15, 20);
    ellipse(0, -8, 10, 12);

    fill(255, 200, 0);
    triangle(0, -12, 5, -10, 0, -8);

    pop();

    if (corvo.estado === 'pousado') {
      fill(255, 0, 0);
      textSize(24);
      text("!", corvo.x, corvo.y - 30);
    }
  }
}

function desenharMinigame() {
  let barX = width / 2 - 100;
  let barY = height / 2;
  let barWidth = 200;
  let barHeight = 20;

  fill(150, 150, 150, 220);
  rect(barX, barY, barWidth, barHeight, 5);

  let targetX = width / 2 - 20;
  let targetWidth = 40;
  fill(100, 255, 100, 220);
  rect(targetX, barY, targetWidth, barHeight);

  let indicatorPos = 100 + 100 * sin(frameCount * 0.1);
  let indicatorX = barX + indicatorPos;
  fill(255, 100, 100, 250);
  rect(indicatorX - 5, barY - 5, 10, barHeight + 10, 3);

  fill(255);
  textAlign(CENTER);
  textSize(18);
  text("Pressione ESPAÇO no momento certo!", width / 2, barY - 30);
}

function desenharAldeia() {
  for (let casa of casas) {
    fill(180, 150, 100);
    rect(casa.x, casa.y, casa.largura, -casa.altura);
    fill(100, 80, 60);
    triangle(casa.x, casa.y - casa.altura, casa.x + casa.largura, casa.y - casa.altura, casa.x + casa.largura / 2, casa.y - casa.altura - 20);
    if (casa.fumaca) {
      fill(80, 80, 80);
      rect(casa.x + 10, casa.y - casa.altura - 20, 15, -20);
      for (let i = 0; i < 3; i++) {
        fill(220, 220, 220, 80 - i * 20);
        ellipse(casa.x + 17 + cos(frameCount * 0.05 + i) * 5, casa.y - casa.altura - 40 - i * 15, 20 + i * 5, 15 + i * 5);
      }
    }
    for (let a = 0; a < casa.janelas.length; a++) {
      for (let j = 0; j < casa.janelas[a].length; j++) {
        let xJanela = casa.x + 10 + j * (casa.largura - 20) / (casa.janelas[a].length || 1);
        let yJanela = casa.y - 20 - a * 25;
        if (tempoDia > 500 && !casa.janelas[a][j].acesa && random() > 0.995) {
          casa.janelas[a][j].acesa = true;
          casa.janelas[a][j].cor = color(255, 255, 150);
        } else if (tempoDia < 500 && casa.janelas[a][j].acesa && random() > 0.995) {
          casa.janelas[a][j].acesa = false;
        }
        fill(casa.janelas[a][j].acesa ? casa.janelas[a][j].cor : color(70, 70, 70));
        rect(xJanela, yJanela, 8, 12);
      }
    }
  }
}

function desenharCampo() {
  arvores.sort((a, b) => a.y - b.y);
  for (let arvore of arvores) {
    fill(100, 70, 40);
    rect(arvore.x - 7, arvore.y, 14, -arvore.alturaTronco);
    if (arvore.tipo === 'folhagem') {
      let offsetX = cos(frameCount * 0.01 + arvore.oscilacao) * 2;
      let offsetY = sin(frameCount * 0.01 + arvore.oscilacao) * 2;
      fill(tempoDia < 500 ? color(40, 120, 40) : color(20, 80, 20));
      ellipse(arvore.x + offsetX, arvore.y - arvore.alturaTronco + offsetY, arvore.tamanhoCopa, arvore.tamanhoCopa);
    } else {
      fill(tempoDia < 500 ? color(30, 100, 30) : color(15, 60, 15));
      triangle(arvore.x, arvore.y - arvore.alturaTronco - arvore.tamanhoCopa * 0.8,
        arvore.x - arvore.tamanhoCopa / 2, arvore.y - arvore.alturaTronco,
        arvore.x + arvore.tamanhoCopa / 2, arvore.y - arvore.alturaTronco);
    }
  }
}

function desenharPessoa(x, y, corPele, corRoupa, andando = false) {
  // Sombra
  fill(0, 0, 0, 40);
  ellipse(x, y + 22, 25, 10);

  // Pernas (desenhadas primeiro, para ficar atrás do corpo)
  stroke(80, 80, 100);
  strokeWeight(6);
  if (andando) {
    let legOffset = sin(frameCount * 0.3) * 8;
    line(x - 5, y + 5, x - 5 - legOffset, y + 20); // Perna Esquerda
    line(x + 5, y + 5, x + 5 + legOffset, y + 20); // Perna Direita
  } else {
    line(x - 5, y + 5, x - 5, y + 20);
    line(x + 5, y + 5, x + 5, y + 20);
  }

  // Braços (atrás do corpo)
  if (andando) {
    let armOffset = cos(frameCount * 0.3) * 6;
    line(x + 5, y - 15, x + 10 + armOffset, y); // Braço Direito
  } else {
    line(x + 8, y - 15, x + 12, y); // Braço Direito
  }

  // Corpo e Cabeça
  noStroke();
  fill(corRoupa);
  rect(x - 10, y - 18, 20, 25, 5); // Corpo
  fill(corPele);
  ellipse(x, y - 28, 20, 20); // Cabeça

  // Braço (na frente do corpo)
  stroke(80, 80, 100);
  strokeWeight(6);
  if (andando) {
    let armOffset = cos(frameCount * 0.3) * 6;
    line(x - 5, y - 15, x - 10 - armOffset, y); // Braço Esquerdo
  } else {
    line(x - 8, y - 15, x - 12, y); // Braço Esquerdo
  }
  noStroke();
}

function desenharAldeoes() {
  pessoasCampo.sort((a, b) => a.y - b.y);
  for (let pessoa of pessoasCampo) {
    let andando = (jogador.dialogoAtivo === null);
    desenharPessoa(pessoa.x, pessoa.y, color(220, 180, 140), pessoa.corRoupa, andando);
    let d = dist(jogador.x, jogador.y, pessoa.x, pessoa.y);
    if (d < 50 && !pessoa.conversado && estadoJogo === "jogando") {
      let animacao = sin(frameCount * 0.2) * 3;
      fill(255, 255, 0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("!", pessoa.x, pessoa.y - 60 + animacao);
    }
  }
}

function desenharAldeoesFazenda() {
  desenharPessoa(npcFazenda.x, npcFazenda.y, color(230, 190, 150), npcFazenda.corRoupa);
  let d = dist(jogador.x, jogador.y, npcFazenda.x, npcFazenda.y);
  if (d < 50 && !missaoAtiva) {
    let animacao = sin(frameCount * 0.2) * 3;
    fill(255, 255, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("!", npcFazenda.x, npcFazenda.y - 60 + animacao);
  }
}

function desenharJogador() {
  let andando = (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) && jogador.dialogoAtivo === null;
  desenharPessoa(jogador.x, jogador.y, color(220, 180, 140), color(50, 100, 180), andando);

  // Equipamentos
  if (enxadaEquipada) {
    stroke(139, 69, 19);
    strokeWeight(4);
    line(jogador.x + 12, jogador.y - 15, jogador.x + 12, jogador.y + 10);
    noStroke();
    fill(120);
    rect(jogador.x + 6, jogador.y - 20, 12, 8);
  }
  if (regadorEquipado) {
    fill(180);
    ellipse(jogador.x - 15, jogador.y, 20, 15);
    rect(jogador.x - 18, jogador.y - 10, 5, 10); // alça
    rect(jogador.x - 28, jogador.y - 5, 8, 3); // bico
  }

  if (jogador.dialogoAtivo === null && !minigameAtivo) {
    if (keyIsDown(LEFT_ARROW)) jogador.x = max(20, jogador.x - jogador.velocidade);
    if (keyIsDown(RIGHT_ARROW)) jogador.x = min(width - 20, jogador.x + jogador.velocidade);
    if (keyIsDown(UP_ARROW)) jogador.y = max(370, jogador.y - jogador.velocidade);
    if (keyIsDown(DOWN_ARROW)) jogador.y = min(height - 40, jogador.y + jogador.velocidade);
  }

  if (keyIsDown(69) && jogador.dialogoAtivo === null) { // Tecla 'E'
    let npcsProximos = (estadoJogo === 'jogando') ? pessoasCampo : [npcFazenda];
    for (let i = 0; i < npcsProximos.length; i++) {
      let npc = npcsProximos[i];
      if (dist(jogador.x, jogador.y, npc.x, npc.y) < 50) {
        if (estadoJogo === 'jogando' && !npc.conversado) {
          jogador.dialogoAtivo = i;
          break;
        } else if (estadoJogo === 'fazenda') { // Permite falar com Maria a qualquer momento
          jogador.dialogoAtivo = pessoasCampo.length; // Índice especial para Maria
          break;
        }
      }
    }
  }
}


function desenharDialogo() {
  if (jogador.dialogoAtivo === null) return;

  let pessoa = (jogador.dialogoAtivo < pessoasCampo.length) ? pessoasCampo[jogador.dialogoAtivo] : npcFazenda;
  let dialogoData;
  let empathyLevel = getEmpathyLevel();

  // Determina qual diálogo mostrar
  if (estadoJogo === "jogando") {
    dialogoData = pessoa.dialogo.conexao;
  } else { // estadoJogo === "fazenda"
    if (objetivoConcluido) {
      dialogoData = {
        texto: "Parabéns, Pedro! Você completou a missão! A aldeia vai celebrar!",
        opcoes: []
      };
    }
    // Lógica para dar recursos
    else if (missaoAtiva && pessoa === npcFazenda && (sementes <= 0 || agua <= 0)) {
      let textoRecurso = "Você parece cansado. ";
      if (sementes <= 0) {
        textoRecurso += "Tome, pegue mais sementes. ";
        sementes = 5;
      }
      if (agua <= 10) { // Dá água se estiver baixa
        textoRecurso += "Vá até o poço para reabastecer seu regador. ";
        agua = 100;
      }
      textoRecurso += "A terra agradece o esforço.";
      dialogoData = {
        texto: textoRecurso,
        opcoes: []
      };
    }
    // FIM DA NOVA LÓGICA
    else if (!missaoAtiva && pessoa === npcFazenda) {
      dialogoData = pessoa.dialogo.conexao;
    } else {
      dialogoData = {
        texto: pessoa.dialogo.fazenda[empathyLevel],
        opcoes: []
      };
    }
  }

  fill(0, 0, 0, 180);
  rect(50, height - 200, width - 100, 180, 10);

  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`${pessoa.dialogo.nome}:`, 70, height - 185);
  textSize(22);
  text(dialogoData.texto, 70, height - 155, width - 140, 100);

  if (dialogoData.opcoes.length > 0 && dialogoOpcao === null) {
    for (let i = 0; i < dialogoData.opcoes.length; i++) {
      textSize(20);
      fill(40, 40, 40, 200);
      rect(80, height - 90 + i * 40, width - 160, 35, 5);
      fill(255);
      textAlign(LEFT, CENTER);
      text(`${i + 1}. ${dialogoData.opcoes[i].texto}`, 90, height - 72 + i * 40);
    }
  } else {
    fill(200);
    textSize(16);
    textAlign(RIGHT, BOTTOM);
    text("Pressione ESPAÇO para continuar", width - 70, height - 30);
  }
}


function desenharHUDVila() {
  fill(0, 0, 0, 100);
  rect(20, 20, 200, 30, 5);
  fill(100, 200, 100);
  let progressoConexoes = map(jogador.conexoes, 0, jogador.conexoesNecessarias, 0, 200);
  rect(20, 20, progressoConexoes, 30, 5);
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(`Conexões: ${jogador.conexoes}/${jogador.conexoesNecessarias}`, 120, 35);

  fill(0, 0, 0, 100);
  rect(20, 60, 200, 20, 5);
  fill(255, 165, 0);
  let progressoEmpatia = map(empatia, 0, 100, 0, 200);
  rect(20, 60, progressoEmpatia, 20, 5);
  fill(0);
  textSize(14);
  text(`Empatia: ${floor(empatia)}%`, 120, 70);
}

function desenharHUDFazenda() {
  fill(0, 0, 0, 120);
  rect(10, 10, 250, 220, 10);

  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Missão da Fazenda", 25, 20);

  textSize(14);
  text(`Milho Plantado: ${lotesPlantados}/5`, 25, 50);
  fill(80, 80, 80);
  rect(25, 70, 220, 15, 5);
  fill(255, 215, 0);
  let progressoMissao = map(lotesPlantados, 0, 5, 0, 220);
  rect(25, 70, progressoMissao, 15, 5);

  text(`Empatia`, 25, 95);
  fill(80, 80, 80);
  rect(25, 115, 220, 15, 5);
  fill(255, 165, 0);
  let progressoEmpatia = map(empatia, 0, 100, 0, 220);
  rect(25, 115, progressoEmpatia, 15, 5);

  text(`Sementes: ${sementes}`, 25, 140);
  text(`Água: ${agua}%`, 140, 140);
  text(`Erros ao Arar: ${errosArar}/${maxErrosArar}`, 25, 160);

  textSize(16);
  fill(220);
  textAlign(CENTER, TOP);
  text("A-Arar P-Plantar W-Regar", 135, 185);
  text("ESPAÇO - Espantar Corvo", 135, 205);
}


function desenharFinal() {
  background(20, 40, 80);
  desenharCeu();
  desenharPaisagem();
  desenharAldeia();

  // Caixa de diálogo principal
  fill(255, 245, 230, 220);
  rect(width / 2 - 300, height / 2 - 150, 600, 300, 15);
  fill(50, 30, 20);
  textAlign(CENTER, CENTER);

  let titulo, mensagem1, mensagem2;
  let boxTop = height / 2 - 150; // Y do topo da caixa

  if (objetivoConcluido) {
    if (empatia >= 90) {
      titulo = "Uma Celebração para Pedro!";
      mensagem1 = "Sua dedicação e coração aberto conquistaram a todos. A aldeia celebra não só a colheita, mas a sua chegada!";
      mensagem2 = "Você encontrou seu novo lar. A festa é toda para você!";
      desenharFogos();
    } else if (empatia >= 40) {
      titulo = "Colheita e Conexão";
      mensagem1 = "A aldeia agradece sua ajuda na plantação, Pedro. Você provou seu valor como agricultor.";
      mensagem2 = "Você é bem-vindo aqui, mas ainda há laços a serem fortalecidos.";
    } else {
      titulo = "Um Estranho no Ninho";
      mensagem1 = "Você completou a tarefa, mas a desconfiança ainda paira no ar. Sua frieza não foi esquecida.";
      mensagem2 = "A aldeia aceita seu trabalho, mas não seu coração. Você continua sendo um forasteiro.";
    }
  } else {
    if (empatia >= 40) {
      titulo = "Uma Oportunidade Perdida";
      mensagem1 = "A aldeia viu bondade em você, mas sua recusa em ajudar deixou todos confusos e magoados.";
      mensagem2 = "Talvez um dia você entenda o que significa comunidade. Por agora, seu caminho é solitário.";
    } else {
      titulo = "Expulso da Aldeia!";
      mensagem1 = "Sua atitude egoísta e falta de empatia são como uma praga nesta terra fértil.";
      mensagem2 = "Não há lugar para você aqui. Por favor, vá embora e não retorne.";
    }
  }

  // CÓDIGO CORRIGIDO PARA DESENHAR O TEXTO
  textSize(32);
  text(titulo, width / 2, boxTop + 50);

  textSize(18);
  // As coordenadas x, y definem o canto superior esquerdo da caixa de texto
  // O 550 define a largura da caixa de texto, forçando a quebra de linha
  text(mensagem1, width / 2, boxTop + 110, 550, 80);
  text(mensagem2, width / 2, boxTop + 180, 550, 80);

  textSize(16);
  fill(100);
  text("FIM DE JOGO - Pressione R para reiniciar", width / 2, boxTop + 280);
  // FIM DA CORREÇÃO
}


function desenharEfeitosFazenda() {
  for (let lote of fazendaPlantada) {
    if (dist(jogador.x, jogador.y, lote.x + 15, lote.y + 15) < 30) {
      if ((enxadaEquipada && !lote.arado) ||
        (lote.arado && !lote.plantado && sementes > 0) ||
        (lote.plantado && !lote.regado && agua > 0)) {
        noFill();
        stroke(255, 255, 0, 150 + 100 * sin(frameCount * 0.1));
        strokeWeight(3);
        ellipse(lote.x + 15, lote.y + 15, 45, 45);
        noStroke();
      }
    }
  }
}
