
// ====== EFEITO DE DIGITAÇÃO ======
function aplicarEfeitoDigitacaoEm(h1, delay = 500, velocidade = 50) {
    if (!h1) return;

    const textoCompleto = h1.getAttribute('data-texto-completo');
    if (!textoCompleto) return;

    h1.textContent = '';
    h1.classList.add('typing-title');
    let index = 0;

    function digitar() {
        if (index < textoCompleto.length) {
            h1.textContent += textoCompleto.charAt(index);
            index++;
            setTimeout(digitar, velocidade);
        } else {
            h1.classList.remove('typing-title');
        }
    }

    setTimeout(digitar, delay);
}

function iniciarEfeitoDigitacao() {
    const titulos = document.querySelectorAll('h1[data-texto-completo]');
    titulos.forEach((h1, i) => {
        if (!h1.textContent.trim()) {
            aplicarEfeitoDigitacaoEm(h1, 500 + i * 100);
        }
    });
}

// Inicia o efeito quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    iniciarEfeitoDigitacao();
    iniciarComentarios();
});

function carregarComentarios() {
    const comentarios = JSON.parse(localStorage.getItem('comentariosPS')) || [];
    const lista = document.getElementById('comentarios-lista');
    if (!lista) return;
    lista.innerHTML = '';
    comentarios.forEach(renderizarComentario);
}

function salvarComentario(comentario) {
    const comentarios = JSON.parse(localStorage.getItem('comentariosPS')) || [];
    comentarios.unshift(comentario);
    localStorage.setItem('comentariosPS', JSON.stringify(comentarios));
}

function removerComentario(id) {
    const comentarios = JSON.parse(localStorage.getItem('comentariosPS')) || [];
    const atualizados = comentarios.filter(comentario => comentario.id !== id);
    localStorage.setItem('comentariosPS', JSON.stringify(atualizados));
    carregarComentarios();
}

function isAdminUser() {
    return usuarioAtual?.email === ADMIN_EMAIL && usuarioAtual?.isAdmin === true;
}

function renderizarComentario(comentario) {
    const lista = document.getElementById('comentarios-lista');
    if (!lista) return;

    const card = document.createElement('div');
    card.className = 'comentario-card';
    
    const inicial = comentario.nome.charAt(0).toUpperCase();
    const cor = gerarCorAvatar(comentario.nome);
    
    const botaoExcluir = isAdminUser() ? `
            <button class="btnExcluirComentario" data-id="${comentario.id}">Excluir</button>
        ` : '';

    card.innerHTML = `
        <div class="comentario-avatar" style="background: ${cor};">${inicial}</div>
        <div class="comentario-conteudo">
            <div class="comentario-cabecalho">
                <strong>${comentario.nome}</strong>
                <span>${formatarTempo(new Date(comentario.data))}</span>
            </div>
            <p>${comentario.texto}</p>
            ${botaoExcluir}
        </div>
    `;

    lista.insertBefore(card, lista.firstChild);

    const excluirButton = card.querySelector('.btnExcluirComentario');
    if (excluirButton) {
        excluirButton.addEventListener('click', () => {
            removerComentario(comentario.id);
        });
    }
}

function gerarCorAvatar(nome) {
    const cores = [
        'rgba(0, 229, 255, 0.7)',
        'rgba(123, 44, 255, 0.7)',
        'rgba(255, 0, 102, 0.7)',
        'rgba(255, 102, 0, 0.7)',
        'rgba(0, 255, 136, 0.7)',
        'rgba(255, 200, 0, 0.7)'
    ];
    
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
        hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return cores[Math.abs(hash) % cores.length];
}

function formatarTempo(data) {
    const agora = new Date();
    const diff = Math.floor((agora - data) / 1000);

    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
    return `Há ${Math.floor(diff / 86400)} dias`;
}

function iniciarComentarios() {
    carregarComentarios();

    const form = document.getElementById('form-comentario');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('comentario-nome').value.trim();
        const texto = document.getElementById('comentario-texto').value.trim();
        if (!nome || !texto) return;

        const comentario = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            nome,
            texto,
            data: new Date().toISOString(),
        };

        salvarComentario(comentario);
        renderizarComentario(comentario);

        form.reset();
    });
}

const btnCadastrar = document.querySelector('.btn-cadastrar');
const btnEntrar = document.querySelector('.btn-entrar');
const btnVoltar = document.querySelector('.btn-voltar')
const btnEnviarCadastro = document.querySelector('.btn-enviar-cadastro');
const btnSair = document.querySelector('.btn-logout');

const telaLogin = document.getElementById("tela-login");
const telaCadastro = document.getElementById("tela-cadastro");
const main = document.getElementById("tela-principal");
const header = document.getElementById("cabecalho");

const API_KEY = '3da7138b043947b18f21a5d898c4cb44';
const ADMIN_EMAIL = 'teste@gmail.com';
const ADMIN_PASSWORD = 'teste';
let usuarioAtual = null;

const favoritosPS2 = [
  { slug: 'god-of-war', name: 'God of War', ano: '2005' },
  { slug: 'god-of-war-ii', name: 'God of War II', ano: '2007' },
  { slug: 'shadow-of-the-colossus', name: 'Shadow of the Colossus', ano: '2005' },
  { slug: 'grand-theft-auto-san-andreas', name: 'Grand Theft Auto: San Andreas', ano: '2004' }
];

const favoritosPS3 = [
  { slug: 'god-of-war-iii', name: 'God of War III', ano: '2010' },
  { slug: 'dmc', name: 'DmC: Devil May Cry', ano: '2013' },
  { slug: 'grand-theft-auto-v', name: 'Grand Theft Auto V', ano: '2013' },
  { slug: 'the-elder-scrolls-v-skyrim', name: 'The Elder Scrolls V: Skyrim', ano: '2011' }
];

const favoritosPS4 = [
  { slug: 'god-of-war-2018', name: 'God of War 2018', ano: '2018' },
  { slug: 'sekiro-shadows-die-twice', name: 'Sekiro: Shadows Die Twice', ano: '2019' },
  { slug: 'the-last-of-us-part-ii', name: 'The Last of Us II', ano: '2020' },
  { slug: 'cyberpunk-2077', name: 'Cyberpunk 2077', ano: '2020' }
];

const favoritosPS5 = [
  { slug: 'gta-vi', name: "GTA VI", ano: '2026' },
  { slug: 'marvel-spider-man-2', name: 'Marvels Spider-Man 2', ano: '2023' },
  { slug: 'ghost-of-yotei', name: 'Ghost of Yotei', ano: '2025' },
  { slug: 'call-of-duty-warzone', name: 'Call of Duty: Warzone', ano: '2022' }
];

// ====== FUNÇÃO PARA BUSCAR JOGOS DA API ======
async function buscarJogoPorNome(pref) {
  try {
    const buscaResp = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(pref.name)}&page_size=10`);
    if (!buscaResp.ok) return null;

    const buscaData = await buscaResp.json();
    const resultados = buscaData.results || [];
    if (!resultados.length) return null;

    const matchPorAno = resultados.find(item => item.released?.startsWith(pref.ano));
    return matchPorAno || resultados[0];
  } catch (err) {
    console.warn('Busca por nome falhou:', pref.name, err);
    return null;
  }
}

async function carregarJogosPorGeracao(favoritos, containerId) {
  try {
    const promessas = favoritos.map(async pref => {
      const nomeResultado = await buscarJogoPorNome(pref);
      if (nomeResultado) {
        return {
          name: pref.name,
          released: nomeResultado.released || pref.ano,
          background_image: nomeResultado.background_image || (nomeResultado.short_screenshots && nomeResultado.short_screenshots[0]?.image) || `https://via.placeholder.com/250x300?text=${encodeURIComponent(pref.name)}`,
        };
      }

      try {
        const resp = await fetch(`https://api.rawg.io/api/games/${pref.slug}?key=${API_KEY}`);
        if (!resp.ok) throw new Error(`Jogo não encontrado ou slug inválido: ${pref.slug}`);
        const item = await resp.json();
        return {
          name: pref.name,
          released: item.released || pref.ano,
          background_image: item.background_image || (item.short_screenshots && item.short_screenshots[0]?.image) || `https://via.placeholder.com/250x300?text=${encodeURIComponent(pref.name)}`,
        };
      } catch (err) {
        console.warn('Não encontrou por nome nem por slug:', pref.slug, err);
        return {
          name: pref.name,
          released: pref.ano,
          background_image: `https://via.placeholder.com/250x300?text=${encodeURIComponent(pref.name)}`,
        };
      }
    });

    const jogosPreferidos = await Promise.all(promessas);
    renderizarJogos(jogosPreferidos, containerId);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    alert('Erro ao carregar jogos da API');
  }
}

async function carregarJogosPS2() {
  await carregarJogosPorGeracao(favoritosPS2, 'jogos-ps2');
}

async function carregarJogosPS3() {
  await carregarJogosPorGeracao(favoritosPS3, 'jogos-ps3');
}

async function carregarJogosPS4() {
  await carregarJogosPorGeracao(favoritosPS4, 'jogos-ps4');
}

async function carregarJogosPS5() {
  await carregarJogosPorGeracao(favoritosPS5, 'jogos-ps5');
}

// ====== FUNÇÃO PARA RENDERIZAR OS CARDS ======
function renderizarJogos(jogos, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Container não encontrado:', containerId);
    return;
  }
  container.innerHTML = ''; // Limpa conteúdo anterior

  jogos.forEach(jogo => {
    const ano = jogo.released ? jogo.released.split('-')[0] : 'N/A';
    
    // Log para debug
    const imageUrl = jogo.background_image || (jogo.short_screenshots && jogo.short_screenshots[0]?.image) || 'https://via.placeholder.com/250x300?text=Sem+imagem';
    console.log('Jogo:', jogo.name, 'Imagem:', imageUrl);
    
    const li = document.createElement('li');
    li.className = 'jogo-card';
    
    // Criar elementos separadamente para melhor controle
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = jogo.name;
    img.crossOrigin = 'anonymous'; // Permitir CORS
    
    const jogoInfo = document.createElement('div');
    jogoInfo.className = 'jogo-info';
    
    const h3 = document.createElement('h3');
    h3.textContent = jogo.name;
    
    const spanAno = document.createElement('span');
    spanAno.className = 'ano';
    spanAno.textContent = ano;
    
    jogoInfo.appendChild(h3);
    jogoInfo.appendChild(spanAno);
    
    li.appendChild(img);
    li.appendChild(jogoInfo);
    
    container.appendChild(li);
  });
}

// Carregar jogos quando a tela principal aparecer
// (você pode chamar isso quando o usuário faz login)


// para tela de cadastro
btnCadastrar.addEventListener("click", (e) => {

  e.preventDefault();

  telaLogin.classList.add("hidden");
  telaCadastro.classList.remove("hidden");

  const cadastroH1 = telaCadastro.querySelector('h1[data-texto-completo]');
  aplicarEfeitoDigitacaoEm(cadastroH1, 250);
});

// voltar para login
btnVoltar.addEventListener("click", (e) => {
  //e.preventDefault();

  telaCadastro.classList.add("hidden");
  telaLogin.classList.remove("hidden");
});

// cadastrar no DataBase
btnEnviarCadastro.addEventListener("click", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("cadastro-usuario").value.trim();
  const senha = document.getElementById("cadastro-senha").value.trim();

  // Validação básica
  if (!usuario || !senha) {
    alert("Preencha email e senha!");
    return;
  }

  const res = await fetch("/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, senha })
  });

  const data = await res.json();

  if (data.status === "ok") {
    alert("Cadastro realizado com sucesso!");
    document.getElementById("cadastro-usuario").value = "";
    document.getElementById("cadastro-senha").value = "";
    
    telaCadastro.classList.add("hidden");
    telaLogin.classList.remove("hidden");
  } else {
    alert(data.msg);
  }
});

// Entrar
btnEntrar.addEventListener("click", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // Validação básica
  if (!usuario || !senha) {
    alert("Preencha email e senha!");
    return;
  }

  if (usuario === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
    usuarioAtual = { email: usuario, isAdmin: true };
    alert("Login de administrador realizado com sucesso!");
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    main.classList.remove("hidden");
    header.classList.remove("hidden");
    telaLogin.classList.add("hidden");
    carregarComentarios();
    carregarJogosPS2();
    carregarJogosPS3();
    carregarJogosPS4();
    carregarJogosPS5();
    const mainH1 = main.querySelector('h1[data-texto-completo]');
    aplicarEfeitoDigitacaoEm(mainH1, 250);
    return;
  }

  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, senha })
  });

  const data = await res.json();

  if (data.status === "ok") {
    usuarioAtual = { email: usuario, isAdmin: usuario === ADMIN_EMAIL && senha === ADMIN_PASSWORD };
    alert("Login realizado com sucesso!");
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    main.classList.remove("hidden");
    header.classList.remove("hidden");
    telaLogin.classList.add("hidden");
    carregarComentarios();
    carregarJogosPS2();
    carregarJogosPS3();
    carregarJogosPS4();
    carregarJogosPS5();
  } else {
    alert(data.msg);
  }
  const mainH1 = main.querySelector('h1[data-texto-completo]');
  aplicarEfeitoDigitacaoEm(mainH1, 250);
});
  
// Logout
btnSair.addEventListener("click", async (e) => {
  usuarioAtual = null;
  main.classList.add("hidden");
  header.classList.add("hidden");
  telaLogin.classList.remove("hidden");
  carregarComentarios();
});