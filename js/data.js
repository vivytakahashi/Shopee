/* =========================================================
   DADOS DA LOJA (produtos, lojas, categorias, cupons...)
   Tudo que é "conteúdo" fica aqui, separado da lógica.
   ========================================================= */

const LOJAS = {
  loja1: { id: "loja1", nome: "Loja 1", avaliacoes: "8,2mil", taxa: "97%", desde: "4 anos", produtos: 128, responde: "minutos", seguidores: "15,6mil" },
  dengo: { id: "dengo", nome: "Dengo Dengo", avaliacoes: "12,4mil", taxa: "99%", desde: "3 anos", produtos: 214, responde: "minutos", seguidores: "18,2mil" },
  madeira: { id: "madeira", nome: "MadeiraMadeira", oficial: true, avaliacoes: "96,1mil", taxa: "95%", desde: "6 anos", produtos: 3540, responde: "horas", seguidores: "412mil" },
  dpimenta: { id: "dpimenta", nome: "D.Pimenta", avaliacoes: "5,7mil", taxa: "98%", desde: "2 anos", produtos: 87, responde: "minutos", seguidores: "9,3mil" },
  beleza: { id: "beleza", nome: "Beleza Oficial", oficial: true, avaliacoes: "41,8mil", taxa: "96%", desde: "5 anos", produtos: 640, responde: "horas", seguidores: "120mil" },
  tech: { id: "tech", nome: "TechMix", avaliacoes: "22,0mil", taxa: "94%", desde: "4 anos", produtos: 932, responde: "horas", seguidores: "64mil" },
  casautil: { id: "casautil", nome: "Casa & Útil", avaliacoes: "9,9mil", taxa: "97%", desde: "3 anos", produtos: 305, responde: "minutos", seguidores: "21mil" },
};

const AVALIACOES_PADRAO = [
  { usuario: "gustavomaximiliano991", nota: 5, texto: "ela é muito fofa, gente ela superou muito as minhas expectativas e ela é de ótima qualidade, chegou super rápido, ela é simplesmente incrível e os vendedores estão de parabéns" },
  { usuario: "carwlina", nota: 5, texto: "eu AMEI MUITO, tava muito ansiosa pra comprar uma pelúcia da minha personagem fav, quando vi esse anúncio eu fiquei maluca kkkkkk a entrega foi bem rápida, comprei dia 1 de setembro e chegou hoje dia 4 recomendo mtmtmtmt, apenas comprem!!!" },
  { usuario: "renata.souza", nota: 4, texto: "Produto bom, igual às fotos. Só demorou um pouquinho mais do que o previsto." },
];

const PRODUTOS = [
  {
    id: "cabeceira", nome: "Cabeceira estofada autocolante", preco: 142.41, precoDe: 179.9, nota: 5.0,
    local: "São Paulo - SP", loja: "loja1", categoria: "casa", envio: "nacional", vendidos: "3mil+", relampago: true,
    img: "img/produtos/cabeceira.jpg",
    galeria: ["img/produtos/cabeceira.jpg", "img/cabeceira-cinza.jpg", "img/cabeceira-vermelha.jpg", "img/cabeceira-branca.jpg", "img/cabeceira-marrom.jpg"],
    cores: [
      { nome: "Preto", img: "img/produtos/cabeceira.jpg" }, { nome: "Azul", img: "img/cabeceira-cinza.jpg" },
      { nome: "Cinza", img: "img/cabeceira-cinza.jpg" }, { nome: "Rosa", img: "img/cabeceira-vermelha.jpg" },
      { nome: "Branco", img: "img/cabeceira-branca.jpg" }, { nome: "Marrom", img: "img/cabeceira-marrom.jpg" },
    ],
    descricao: "Placas estofadas autocolantes para cabeceira.\nInstalação fácil, sem furos.\nTecido suede com espuma de alta densidade.\nCada placa mede 30 x 60 cm.",
    avaliacoes: [
      { usuario: "Usuario23", nota: 5, texto: "Ficou linda no meu quarto, muito fácil de colar. Recomendo!" },
      { usuario: "marcela_lima", nota: 5, texto: "Material macio e de qualidade, a cor é idêntica à foto." },
    ],
  },
  {
    id: "fone", nome: "Fone de ouvido Bluetooth-Headphone", preco: 33.88, precoDe: 100.0, nota: 4.9,
    local: "São Paulo - SP", loja: "tech", categoria: "tecnologia", envio: "nacional", vendidos: "10mil+", relampago: true,
    img: "img/produtos/fone.jpg", cores: [{ nome: "Bege" }, { nome: "Preto" }, { nome: "Branco" }],
    descricao: "Fone Bluetooth 5.3 com cancelamento de ruído.\nBateria de até 40 horas.\nAlmofadas macias e dobrável.",
  },
  {
    id: "comoda", nome: "Cômoda Para Quarto 8 Gavetas Grande Espaçosa", preco: 332.5, precoDe: 499.99, nota: 4.1,
    local: "São Paulo - SP", loja: "madeira", categoria: "casa", envio: "nacional", vendidos: "1mil+", relampago: true,
    img: "img/produtos/comoda.jpg", cores: [{ nome: "Grafite" }, { nome: "Branco" }],
    descricao: "Cômoda com 8 gavetas em MDP.\nPuxadores em alumínio.\nMedidas: 120 x 90 x 40 cm.",
  },
  {
    id: "tenis", nome: "Tênis Empyre moda Unissex", preco: 59.9, precoDe: 89.9, nota: 4.9,
    local: "São Paulo - SP", loja: "dpimenta", categoria: "moda", envio: "nacional", vendidos: "5mil+", relampago: true,
    img: "img/tenis.jpg", tamanhos: ["36", "37", "38", "39", "40", "41", "42"],
    descricao: "Tênis casual unissex em couro sintético.\nSolado de borracha antiderrapante.",
  },
  {
    id: "calca", nome: "Calça wide leg feminina Jeans Cintura Alta Cós Alto sem Lycra Grossa Rasgada Cinza Grafit Marmorizada",
    preco: 53.99, precoDe: 79.9, nota: 4.8, local: "São Paulo - SP", loja: "dpimenta", categoria: "moda", envio: "nacional", vendidos: "8mil+",
    img: "img/produtos/calca.jpg", cores: [{ nome: "Cinza" }, { nome: "Preto" }, { nome: "Lavagem Clara" }, { nome: "Lavagem Escura" }],
    tamanhos: ["34", "36", "38", "40", "42"],
    descricao: "Calça jeans wide leg de cintura alta.\nJeans grosso sem lycra, com rasgados.\nLavagem marmorizada.",
    avaliacoes: [
      { usuario: "gabrielivitoria357", nota: 5, texto: "primeira vez que compro calça e não precisa reajuste, são simplesmente perfeitas" },
      { usuario: "lizaaacmc", nota: 5, texto: "Eu amei, recomendo material muito bom, confortável e lindo e fora o cheiro da lavagem rs é maravilhoso recomendo" },
    ],
  },
  {
    id: "kuromi", nome: "Kuromi Sanrio Boneca de pelúcia fofa 25cm Kuromi Sanrio", preco: 47.03, nota: 4.9,
    local: "São Paulo - SP", loja: "dengo", categoria: "bebe", envio: "nacional", vendidos: "4mil+",
    img: "img/produtos/kuromi.jpg",
    galeria: ["img/kuromi-2.webp", "img/kuromi-3.webp", "img/kuromi-4.webp", "img/kuromi-5.webp", "img/kuromi-6.webp"],
     cores: [{ nome: "Kuromi - Rosa", img: "img/kuromi-4.webp" }, { nome: "Kuromi - Roxo", img:"img/kuromi-5.webp" }],
    descricao: "A Pelúcia Kurom-i Sanri-o de 25cm é perfeita para os fãs da famosa personagem japonesa.\nFeita com materiais de alta qualidade, como pelúcia macia e enchimento de poliéster, essa pelúcia é ideal para abraçar e decorar seu quarto. Com o design adorável da Kurom-i, essa pelúcia é uma ótima opção de presente para crianças e colecionadores. Com certificação, você pode ter a tranquilidade de estar adquirindo um produto seguro e de confiança.\nAproveite para adicionar essa fofura à sua coleção !",
    avaliacoes: [
      { usuario: "gustavomaximiliano991", nota: 5, texto: "ela é muito fofa, gente ela superou muito as minhas expectativas e ela é de ótima qualidade, chegou super rápido, ela é simplesmente incrível e os vendedores estão de parabéns", fotos: ["img/avaliacoes/kuromi-7.webp"]},
      { usuario: "carwlina", nota: 5, texto: "eu AMEI MUITO, tava muito ansiosa pra comprar uma pelúcia da minha personagem fav, quando vi esse anúncio eu fiquei maluca kkkkkk a entrega foi bem rápida, comprei dia 1 de setembro e chegou hoje dia 4 recomendo mtmtmtmt, apenas comprem!!!", fotos: ["img/avaliacoes/kuromi8.webp"] },
    ]
  },
  {
    id: "relogio", nome: "Esporte relógio inteligente frequência cardíaca monitoramento saúde exercício pedômetro pulseira inteligente",
    preco: 47.03, nota: 4.9, local: "Internacional", loja: "dengo", categoria: "esporte", envio: "internacional", vendidos: "20mil+",
    img: "img/produtos/relogio.jpg", cores: [{ nome: "Preto" }, { nome: "Vermelho" }, { nome: "Azul" }, { nome: "Roxo" }, { nome: "Verde" }],
    descricao: "Pulseira inteligente com monitor cardíaco.\nPedômetro, sono e notificações.\nÀ prova d'água IP67.",
  },
  {
    id: "aparador", nome: "Buffet Aparador 4 Portas 150cm em MDP com Portas em MDF Nature Off White Branco",
    preco: 360.84, precoDe: 459.9, nota: 4.9, local: "São Paulo - SP", loja: "madeira", categoria: "casa", envio: "nacional", vendidos: "900+",
    img: "img/produtos/aparador.jpg",
    descricao: "Buffet com 4 portas e prateleiras internas.\nCorpo em MDP e portas em MDF.\nMedidas: 150 x 75 x 40 cm.",
  },
  {
    id: "tenda", nome: "Tenda infantil: casa dos sonhos, infância feliz", preco: 70.99, precoDe: 86.99, nota: 4.9,
    local: "São Paulo - SP", loja: "casautil", categoria: "bebe", envio: "nacional", vendidos: "2mil+", relampago: true,
    img: "img/tenda.jpg", cores: [{ nome: "Rosa" }, { nome: "Azul" }],
    descricao: "Tenda infantil em formato de casinha.\nFácil de montar, com janelas e cortinas.",
  },
  {
    id: "serum", nome: "Kit com 3 séruns faciais de diferentes essências", preco: 57.94, precoDe: 89.14, nota: 4.8,
    local: "São Paulo - SP", loja: "beleza", categoria: "beleza", envio: "nacional", vendidos: "6mil+", relampago: true,
    img: "img/serum.jpg", descricao: "Kit com sérum de vitamina C, niacinamida e ácido hialurônico.",
  },
  {
    id: "seladora", nome: "Mini Selador De Sacos Plásticos Portátil, à Calor, Paage", preco: 19.99, precoDe: 37.0, nota: 4.8,
    local: "Internacional", loja: "casautil", categoria: "mercado", envio: "internacional", vendidos: "15mil+", relampago: true,
    img: "img/seladora.jpg", cores: [{ nome: "Branco" }, { nome: "Rosa" }],
    descricao: "Mini seladora portátil a pilha.\nMantém seus alimentos frescos por mais tempo.",
  },
  {
    id: "bolsa", nome: "TOMI MITO Bolsa Media Feminina De Ombro TM9177", preco: 67.31, precoDe: 129.99, nota: 4.9,
    local: "São Paulo - SP", loja: "dpimenta", categoria: "moda", envio: "nacional", vendidos: "3mil+", relampago: true,
    img: "img/bolsa.jpg", cores: [{ nome: "Caramelo" }, { nome: "Preto" }, { nome: "Off White" }],
    descricao: "Bolsa média de ombro em couro sintético.\nFechamento em zíper e alça regulável.",
  },
  {
    id: "kokeshi", nome: "Kit Hidratação Pele de Porcelana + Olhos + Pele Plena Kokeshi", preco: 53.11, precoDe: 85.9, nota: 4.9,
    local: "São Paulo - SP", loja: "beleza", categoria: "beleza", envio: "nacional", vendidos: "2mil+", relampago: true,
    img: "img/kokeshi.jpg", descricao: "Kit de hidratação facial completo Kokeshi.",
  },
  {
    id: "brinco", nome: "Brinco Pedra Dupla 8mm em Prata 925", preco: 120.0, precoDe: 142.41, nota: 4.9,
    local: "São Paulo - SP", loja: "dengo", categoria: "moda", envio: "nacional", vendidos: "1mil+", relampago: true,
    img: "img/brinco.jpg", descricao: "Brinco em prata 925 com pedras de zircônia.",
  },
  {
    id: "caneta3d", nome: "Caneta Impressora 3d Com Filamento Abs + Filamentos Extra", preco: 58.99, precoDe: 113.99, nota: 4.8,
    local: "São Paulo - SP", loja: "tech", categoria: "tecnologia", envio: "nacional", vendidos: "4mil+", relampago: true,
    img: "img/caneta3d.jpg", descricao: "Caneta 3D com controle de velocidade.\nAcompanha 10 cores de filamento ABS.",
  },
  {
    id: "base", nome: "Base Mate Cobre Tudo 30ml Boca Rosa Beauty By Payot", preco: 19.99, nota: 4.9,
    local: "São Paulo - SP", loja: "beleza", categoria: "beleza", envio: "nacional", vendidos: "30mil+",
    img: "img/base.jpg", cores: [{ nome: "Bege Claro" }, { nome: "Bege Médio" }, { nome: "Marrom" }],
    descricao: "Base de alta cobertura com acabamento mate.",
  },
  {
    id: "maquina", nome: "Máquina para Fazer Salgados + Escorredor Óleo Inox", preco: 5462.45, nota: 4.9,
    local: "São Paulo - SP", loja: "casautil", categoria: "casa", envio: "nacional", vendidos: "100+",
    img: "img/maquina.jpg", descricao: "Máquina semi-industrial em aço inox.\nProduz até 2.000 salgados por hora.",
  },
  {
    id: "kitcoreano", nome: "Kit Linha Coreana Hidrabene K-Beauty", preco: 227.91, nota: 4.9,
    local: "São Paulo - SP", loja: "beleza", categoria: "beleza", envio: "internacional", vendidos: "800+",
    img: "img/produtos/kit-coreano.jpg", descricao: "Tônico, essência e creme da linha coreana Hidrabene.",
  },
  {
    id: "baggy", nome: "Calça Baggy Wide Leg Unissex Cyber Punk Y2k", preco: 42.95, nota: 4.8,
    local: "São Paulo - SP", loja: "dpimenta", categoria: "moda", envio: "nacional", vendidos: "7mil+",
    img: "img/calca-baggy.jpg", tamanhos: ["P", "M", "G", "GG"],
    descricao: "Calça baggy com bolsos cargo e fivelas.",
  },

  /* ---------- Produtos novos (fotos tiradas dos links da Shopee) ---------- */
  {
    id: "escova", nome: "Escova Elétrica a Vapor 3 em 1 para Cabelo com Nano Névoa, Luz Vermelha e Função Desembaraçante", preco: 79.9, precoDe: 129.9, nota: 4.8,
    local: "São Paulo - SP", loja: "beleza", categoria: "beleza", envio: "nacional", vendidos: "2mil+", relampago: true,
    img: "img/produtos/escova-vapor.jpg", cores: [{ nome: "Roxo" }, { nome: "Bege" }, { nome: "Rosa" }],
    descricao: "Escova 3 em 1: vapor, massagem e desembaraço.\nNano névoa que hidrata e reduz o frizz.\nLuz vermelha para cuidar do couro cabeludo.\nRecarregável via USB.",
  },
  {
    id: "geladeira", nome: "Geladeira 437L Philco Inverter Side by Side Inox PRF535I", preco: 3999.0, precoDe: 4899.0, nota: 4.9,
    local: "São Paulo - SP", loja: "madeira", categoria: "casa", envio: "nacional", vendidos: "500+",
    img: "img/produtos/geladeira.jpg", tamanhos: ["110V", "220V"],
    descricao: "Geladeira Side by Side com 437 litros.\nTecnologia Inverter: economiza energia e faz menos barulho.\nAcabamento em inox e sistema Frost Free.",
  },
  {
    id: "kitclareador", nome: "Kit Hidrabene Clareador Skincare: Sabonete Facial + Protetor FPS 70 + Sérum Multicorretivo", preco: 139.9, precoDe: 189.9, nota: 4.9,
    local: "São Paulo - SP", loja: "beleza", categoria: "beleza", envio: "nacional", vendidos: "1mil+", relampago: true,
    img: "img/produtos/kit-clareador.jpg",
    descricao: "Kit clareador facial Hidrabene.\nSabonete líquido facial, protetor solar FPS 70 e sérum multicorretivo.\nAjuda a uniformizar o tom da pele e diminuir manchas.",
  },
  {
    id: "sutia", nome: "Kit 4 Sutiãs Fitness Modelador Cruzado nas Costas Sem Costura com Bojo", preco: 39.9, precoDe: 69.9, nota: 4.7,
    local: "Internacional", loja: "dengo", categoria: "moda", envio: "internacional", vendidos: "9mil+", relampago: true,
    img: "img/produtos/sutia.jpg", cores: [{ nome: "Preto" }, { nome: "Branco" }, { nome: "Verde" }, { nome: "Amarelo" }],
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Kit com 4 tops fitness sem costura.\nAlças cruzadas nas costas e bojo removível.\nIdeal para corrida, yoga e academia.",
  },
  {
    id: "pulseira", nome: "Pulseira Flor de Cerejeira para Mulheres Inspirada nas Ondas da Lua e do Mar", preco: 22.9, precoDe: 39.9, nota: 4.8,
    local: "Internacional", loja: "dengo", categoria: "moda", envio: "internacional", vendidos: "3mil+", relampago: true,
    img: "img/produtos/pulseira.jpg", cores: [{ nome: "Flor Rosa" }, { nome: "Lua" }, { nome: "Onda" }],
    descricao: "Pulseira delicada com pingentes de flor de cerejeira.\nFecho ajustável com corrente extensora.\nÓtima opção para presente.",
  },
  {
    id: "presilha", nome: "Kit 3 Presilhas de Cabelo Oval Dobráveis e Confortáveis - Cores Sortidas", preco: 15.99, precoDe: 29.9, nota: 4.7,
    local: "Internacional", loja: "dpimenta", categoria: "beleza", envio: "internacional", vendidos: "12mil+", relampago: true,
    img: "img/produtos/presilha.jpg",
    descricao: "Kit com 3 piranhas de cabelo em formato oval.\nDentes dobráveis que seguram firme sem machucar.\nCores e estampas enviadas de forma aleatória.",
  },
  {
    id: "cortador", nome: "Cortador de Unhas para Cães e Gatos com Luz de LED + Lixa - Kit Completo", preco: 24.9, precoDe: 44.9, nota: 4.8,
    local: "São Paulo - SP", loja: "casautil", categoria: "pet", envio: "nacional", vendidos: "4mil+", relampago: true,
    img: "img/produtos/cortador-unhas.jpg", cores: [{ nome: "Verde" }, { nome: "Rosa" }],
    descricao: "Cortador de unhas com luz de LED para enxergar o vaso sanguíneo.\nAcompanha lixa para acabamento.\nSeguro para cães e gatos de todos os portes.",
  },
  {
    id: "playground", nome: "Playground para Gatos 7 a 15 Peças: Prateleiras, Nicho, Arranhador, Cama e Ponte em MDF", preco: 189.9, precoDe: 259.9, nota: 4.9,
    local: "São Paulo - SP", loja: "madeira", categoria: "pet", envio: "nacional", vendidos: "1mil+",
    img: "img/produtos/playground-gatos.jpg", tamanhos: ["7 peças", "10 peças", "15 peças"],
    descricao: "Circuito de parede para gatos em MDF.\nInclui prateleiras, escada, nicho, cama e ponte.\nAcompanha parafusos e manual de instalação.",
  },
  {
    id: "guardasol", nome: "Painel Guarda-Sol para Para-brisa de Carro com Proteção UV", preco: 34.9, precoDe: 59.9, nota: 4.8,
    local: "Internacional", loja: "tech", categoria: "garagem", envio: "internacional", vendidos: "6mil+", relampago: true,
    img: "img/produtos/guarda-sol.jpg", tamanhos: ["P (até hatch)", "M (sedan)", "G (SUV)"],
    descricao: "Guarda-sol em formato de guarda-chuva, abre e fecha em segundos.\nBloqueia os raios UV e mantém o carro mais fresco.\nVem com capinha para guardar no porta-luvas.",
  },
  {
    id: "pinguim", nome: "Jogo Pinguim Quebra Gelo - Brinquedo Infantil Educativo de Coordenação Motora 3+ Anos", preco: 29.9, precoDe: 49.9, nota: 4.9,
    local: "São Paulo - SP", loja: "dengo", categoria: "bebe", envio: "nacional", vendidos: "5mil+", relampago: true,
    img: "img/produtos/pinguim.jpg",
    descricao: "Jogo de tabuleiro: quebre os blocos de gelo sem deixar o pinguim cair.\nDesenvolve a coordenação motora e a atenção.\nCertificado pelo Inmetro, para crianças a partir de 3 anos.",
  },
];

// Produtos que aparecem na Home em "Recomendados"
const RECOMENDADOS = ["calca", "escova", "kuromi", "playground", "comoda", "kitclareador", "kitcoreano", "sutia", "base", "baggy", "pinguim", "maquina", "brinco", "relogio", "aparador", "tenda", "bolsa"];

const CATEGORIAS = [
  { id: "frete", nome: "Frete Grátis", icone: "truck" },
  { id: "beleza", nome: "Beleza", icone: "lipstick" },
  { id: "mercado", nome: "Mercado", icone: "basket" },
  { id: "moda", nome: "Moda", icone: "heel" },
  { id: "esporte", nome: "Esporte", icone: "dumbbell" },
  { id: "garagem", nome: "Garagem", icone: "wheel" },
  { id: "casa", nome: "Casa & Construção", icone: "home" },
  { id: "pet", nome: "Pet", icone: "paw" },
  { id: "bebe", nome: "Bebê", icone: "stroller" },
  { id: "tecnologia", nome: "Tecnologia", icone: "phone" },
  { id: "internacional", nome: "Internacional", icone: "plane" },
  { id: "oficiais", nome: "Lojas Oficiais", icone: "bagcheck" },
];

const CUPONS = [
  { id: "of1", secao: "Lojas Oficiais", marca: "LOJAS OFICIAIS", fraca: true, desconto: 30, minimo: 249, validade: "30/11" },
  { id: "of2", secao: "Lojas Oficiais", marca: "MadeiraMadeira", desconto: 50, minimo: 399, validade: "30/11" },
  { id: "c1", secao: "Moda & Beleza", marca: "D.Pimenta", desconto: 10, minimo: 59, validade: "25/11" },
  { id: "c2", secao: "Moda & Beleza", marca: "Beleza Oficial", desconto: 15, minimo: 99, validade: "28/11" },
  { id: "c3", secao: "Moda & Beleza", marca: "Dengo Dengo", desconto: 8, minimo: 40, validade: "20/11" },
  { id: "c4", secao: "Moda & Beleza", marca: "Frete Grátis", desconto: 20, minimo: 19, validade: "30/11" },
];

// Recompensas do check-in diário (dia 1 a 7)
const RECOMPENSAS_CHECKIN = [1, 2, 2, 4, 4, 6, 100];

const NOTIFICACOES_PADRAO = [
  { id: "n1", titulo: "Ofertas Relâmpago começaram!", texto: "Descontos de até 70% por tempo limitado. Corra antes que acabe o estoque!", link: "oferta-relampago.html", icone: "zap", data: "Hoje" },
  { id: "n2", titulo: "Você ganhou um cupom de R$30", texto: "Use em compras acima de R$249 nas Lojas Oficiais. Válido até 30/11.", link: "cupons.html", icone: "percent", data: "Hoje" },
  { id: "n3", titulo: "Faça seu check-in diário", texto: "Entre todos os dias e acumule até 100 moedas no 7º dia seguido.", link: "moedas.html", icone: "dollar", data: "Ontem" },
  { id: "n4", titulo: "Pedido entregue", texto: "Seu pedido da Loja 1 foi entregue. Avalie o produto e ganhe moedas!", link: "minhas-compras.html?status=finalizado", img: "img/produtos/cabeceira.jpg", data: "2 dias atrás" },
];

const STATUS_PEDIDO = {
  "a-pagar": { nome: "A Pagar", aviso: "Aguardando pagamento", icone: "wallet" },
  preparando: { nome: "Preparando", aviso: "Vendedor preparando", icone: "box" },
  "a-caminho": { nome: "A caminho", aviso: "Pedido a caminho", icone: "truck" },
  reembolso: { nome: "Reembolso", aviso: "Pedido entregue", icone: "truck" },
  finalizado: { nome: "Finalizado", aviso: "Pedido entregue", icone: "truck" },
  cancelado: { nome: "Cancelado", aviso: "Pedido cancelado", icone: "x" },
};

const PEDIDOS_PADRAO = [
  { id: "p1", loja: "loja1", status: "finalizado", itens: [{ id: "cabeceira", qtd: 1, variacao: "Preto" }] },
  { id: "p2", loja: "dpimenta", status: "reembolso", itens: [{ id: "calca", qtd: 1, variacao: "Cinza, 38" }] },
  { id: "p3", loja: "dengo", status: "a-caminho", itens: [{ id: "kuromi", qtd: 1, variacao: "Kuromi - Roxo" }, { id: "relogio", qtd: 1, variacao: "Preto" }] },
];

const RESPOSTAS_LOJA = [
  "Olá! Obrigado pelo contato 😊 Como posso ajudar?",
  "Temos sim! O envio é feito em até 24h úteis.",
  "Pode ficar tranquilo(a), o produto é original e tem garantia.",
  "Qualquer dúvida estamos à disposição!",
];
