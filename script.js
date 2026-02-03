let historico = [];
const janela = 12;

// vizinhos da roleta europeia
const vizinhos = {
  0:[3,26], 1:[20,33], 2:[21,25], 3:[0,26],
  4:[19,21], 5:[24,10], 6:[27,34], 7:[28,29],
  8:[30,23], 9:[22,31], 10:[5,23], 11:[36,30],
  12:[28,35], 13:[27,36], 14:[20,31], 15:[32,19],
  16:[24,33], 17:[25,34], 18:[22,9], 19:[4,15],
  20:[14,1], 21:[2,4], 22:[9,18], 23:[10,8],
  24:[16,5], 25:[2,17], 26:[3,0], 27:[6,13],
  28:[12,7], 29:[7,28], 30:[11,8], 31:[14,9],
  32:[15,0], 33:[16,1], 34:[17,6], 35:[12,3],
  36:[11,13]
};

function add() {
  const n = Number(document.getElementById("num").value);
  if (n < 0 || n > 36 || isNaN(n)) return;

  historico.unshift(n);
  if (historico.length > 80) historico.pop();

  analisar();
  render();
}

function analisar() {
  const slice = historico.slice(0, janela);
  const freq = {};
  slice.forEach(n => freq[n] = (freq[n] || 0) + 1);

  const repeticoes = Object.values(freq).filter(v => v >= 2).length;

  let estado = "Dispersão";
  let sinal = "AGUARDAR";
  let classe = "aguardar";
  let diagnostico = [];

  if (repeticoes >= 3) {
    estado = "Concentração";
    sinal = "ENTRAR";
    classe = "entrar";
    diagnostico.push("Compressão estatística detectada");
  } else if (repeticoes === 2) {
    estado = "Transição";
    diagnostico.push("Mesa organizando padrão");
  }

  // falso gatilho
  if (historico.length >= 15) {
    const ult5 = historico.slice(0,5);
    const ant5 = historico.slice(5,10);
    if (new Set(ult5).size === 5 && new Set(ant5).size <= 3) {
      sinal = "FALSO GATILHO";
      classe = "aguardar";
      diagnostico.push("Indução detectada (falso gatilho)");
    }
  }

  // gerar alvos
  let candidatos = Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .map(e => Number(e[0]));

  let alvos = [];
  candidatos.forEach(n => {
    alvos.push(n);
    if (vizinhos[n]) alvos.push(...vizinhos[n]);
  });

  alvos = [...new Set(alvos)].slice(0, estado==="Concentração"?5:0);

  document.getElementById("estado").innerText = estado;
  const s = document.getElementById("sinal");
  s.innerText = sinal;
  s.className = classe;
  document.getElementById("alvos").innerText = alvos.length?alvos.join(" - "):"—";
  document.getElementById("diagnostico").innerText =
    diagnostico.length?diagnostico.join(" | "):"Mesa neutra";
}

function render() {
  document.getElementById("hist").innerText = historico.join(" - ");
}
