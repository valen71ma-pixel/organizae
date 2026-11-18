 const formulario = document.getElementById("form-tarefa");
const tituloInput = document.getElementById("titulo");
const categoriaInput = document.getElementById("categoria");
const listaTarefas = document.getElementById("lista-tarefas");
const mensagemVazia = document.getElementById("mensagem-vazia");

const totalTarefas = document.getElementById("total-tarefas");
const tarefasPendentes = document.getElementById("tarefas-pendentes");
const tarefasConcluidas = document.getElementById("tarefas-concluidas");

const botoesFiltro = document.querySelectorAll(".filtro");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

document.querySelector('[data-filtro="todas"]').classList.add("ativo");


formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const prioridadeSelecionada =
        document.querySelector('input[name="prioridade"]:checked');

    const novaTarefa = {
        id: Date.now(),
        titulo: tituloInput.value.trim(),
        categoria: categoriaInput.value,
        prioridade: prioridadeSelecionada.value,
        concluida: false
    };

    if (novaTarefa.titulo === "") {
        alert("Digite uma tarefa.");
        return;
    }

    tarefas.push(novaTarefa);

    salvarTarefas();
    formulario.reset();
    tituloInput.focus();

    document.querySelector(
        'input[name="prioridade"][value="alta"]'
    ).checked = true;

    mostrarTarefas();
});


function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}


function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    let tarefasFiltradas = tarefas;

    if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefas.filter(
            tarefa => !tarefa.concluida
        );
    }

    if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefas.filter(
            tarefa => tarefa.concluida
        );
    }

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `
            <div class="mensagem-vazia">
                <p>Nenhuma tarefa encontrada.</p>
            </div>
        `;

        atualizarContadores();
        return;
    }

    tarefasFiltradas.forEach(function (tarefa) {

        const item = document.createElement("article");

        item.classList.add("tarefa");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        item.innerHTML = `
            <div class="tarefa-conteudo">

                <h3>${tarefa.titulo}</h3>

                <p>
                    Categoria: ${tarefa.categoria}
                </p>

                <span class="prioridade ${tarefa.prioridade}">
                    Prioridade: ${tarefa.prioridade}
                </span>

            </div>

            <div class="tarefa-acoes">

                <button
                    type="button"
                    class="concluir"
                    onclick="alternarConclusao(${tarefa.id})"
                >
                    ${tarefa.concluida ? "Desfazer" : "Concluir"}
                </button>

                <button
                    type="button"
                    class="editar"
                    onclick="editarTarefa(${tarefa.id})"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="excluir"
                    onclick="excluirTarefa(${tarefa.id})"
                >
                    Excluir
                </button>

            </div>
        `;

        listaTarefas.appendChild(item);
    });

    atualizarContadores();
}


function alternarConclusao(id) {

    tarefas = tarefas.map(function (tarefa) {

        if (tarefa.id === id) {
            return {
                ...tarefa,
                concluida: !tarefa.concluida
            };
        }

        return tarefa;
    });

    salvarTarefas();
    mostrarTarefas();
}


function excluirTarefa(id) {

    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.id !== id;
    });

    salvarTarefas();
    mostrarTarefas();
}

function editarTarefa(id) {
    const tarefa = tarefas.find(function (tarefa) {
        return tarefa.id === id;
    });

    const novoTitulo = prompt("Edite a tarefa:", tarefa.titulo);

    if (novoTitulo === null || novoTitulo.trim() === "") {
        return;
    }

    tarefa.titulo = novoTitulo.trim();

    salvarTarefas();
    mostrarTarefas();
}

function atualizarContadores() {

    const total = tarefas.length;

    const concluidas = tarefas.filter(
        tarefa => tarefa.concluida
    ).length;

    const pendentes = total - concluidas;

    totalTarefas.textContent = total;
    tarefasPendentes.textContent = pendentes;
    tarefasConcluidas.textContent = concluidas;
}


botoesFiltro.forEach(function (botao) {

    botao.addEventListener("click", function () {

        botoesFiltro.forEach(function (botao) {
            botao.classList.remove("ativo");
        });

        this.classList.add("ativo");

        filtroAtual = this.dataset.filtro;

        mostrarTarefas();
    });
});


mostrarTarefas();