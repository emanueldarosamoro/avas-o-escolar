/* ============================================================
   EVASÃO ESCOLAR - Script principal
   - Gráfico de pizza (Chart.js)
   - Legenda dinâmica
   - Animação dos números das estatísticas
   ============================================================ */

/* ---------- Dados das situações (percentuais ilustrativos) ---------- */
const situacoes = [
  {
    label: "Muita falta de alunos",
    valor: 28,
    cor: "#d64545",
    descricao: "Faltas constantes que levam à reprovação e ao abandono."
  },
  {
    label: "Falta de professores",
    valor: 18,
    cor: "#f2711c",
    descricao: "Turmas sem aula por ausência e rotatividade docente."
  },
  {
    label: "Alunos fora de sala",
    valor: 16,
    cor: "#f2b705",
    descricao: "Estudantes circulando pelos corredores e matando aula."
  },
  {
    label: "Depredação e sujeira",
    valor: 12,
    cor: "#7b4bd6",
    descricao: "Pichações, carteiras quebradas e falta de pertencimento."
  },
  {
    label: "Baixo desempenho e reprovação",
    valor: 15,
    cor: "#1e5fa8",
    descricao: "Notas baixas e repetência que geram frustração."
  },
  {
    label: "Desmotivação e saúde mental",
    valor: 11,
    cor: "#1f9d55",
    descricao: "Ansiedade, bullying e problemas emocionais."
  }
];

/* ---------- Criação do gráfico de pizza ---------- */
function criarGrafico() {
  const canvas = document.getElementById("graficoPizza");
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: situacoes.map((s) => s.label),
      datasets: [
        {
          data: situacoes.map((s) => s.valor),
          backgroundColor: situacoes.map((s) => s.cor),
          borderColor: "#ffffff",
          borderWidth: 3,
          hoverOffset: 14
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1400,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          display: false // usamos a legenda personalizada em HTML
        },
        tooltip: {
          backgroundColor: "rgba(15, 42, 74, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#e6eefb",
          padding: 12,
          cornerRadius: 10,
          titleFont: { size: 14, weight: "bold" },
          bodyFont: { size: 13 },
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const valor = context.parsed;
              const pct = ((valor / total) * 100).toFixed(1);
              return ` ${valor}% das situações (${pct}% do total)`;
            },
            afterLabel: function (context) {
              return situacoes[context.dataIndex].descricao;
            }
          }
        }
      }
    }
  });
}

/* ---------- Legenda personalizada ---------- */
function criarLegenda() {
  const lista = document.getElementById("legenda");
  if (!lista) return;

  const total = situacoes.reduce((a, s) => a + s.valor, 0);

  situacoes.forEach((s) => {
    const li = document.createElement("li");
    const pct = ((s.valor / total) * 100).toFixed(1);

    li.innerHTML = `
      <span class="dot" style="background:${s.cor}"></span>
      <span>${s.label}</span>
      <span class="pct">${pct}%</span>
    `;
    lista.appendChild(li);
  });
}

/* ---------- Animação dos números das estatísticas ---------- */
function animarNumeros() {
  const numeros = document.querySelectorAll(".num[data-count]");

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const el = entrada.target;
        const alvo = parseFloat(el.dataset.count);
        const sufixo = el.dataset.suffix || "";
        const decimal = el.dataset.count.includes(".");
        let atual = 0;
        const passos = 60;
        const incremento = alvo / passos;

        const timer = setInterval(() => {
          atual += incremento;
          if (atual >= alvo) {
            atual = alvo;
            clearInterval(timer);
          }
          el.textContent = (decimal ? atual.toFixed(1) : Math.floor(atual)) + sufixo;
        }, 20);

        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  numeros.forEach((n) => observer.observe(n));
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  criarGrafico();
  criarLegenda();
  animarNumeros();
});
