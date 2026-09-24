const titulo = document.getElementById("titulo");
const data = document.getElementById("data");
const descricao = document.getElementById("descricao");
const lista = document.getElementById("lista");
const formRegistro = document.getElementById("formRegistro");

formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    adicionarRegistro();
});

function adicionarRegistro() {
    const dadosSalvos = localStorage.getItem("dados");
    const dados = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    if(titulo.value == "" || data.value == "" || descricao.value == ""){
        window.alert("Preencha todos os campos");
        return;
    }

    dados.push({
        id: Date.now(),
        title: titulo.value,
        description: descricao.value,
        date: data.value
    });
    localStorage.setItem("dados", JSON.stringify(dados));
    
    titulo.value = "";
    data.value = "";
    descricao.value = "";

    listarRegistro();
}

function listarRegistro(){
    const dadosSalvos = localStorage.getItem("dados");
    const dados = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    lista.innerHTML = "";

    dados.forEach(dado => {
        lista.innerHTML += `
            <li>
                <div>
                    <h3 class= "titulo">${dado.title}</h3>
                    <span class= "data">${dado.date}</span>
                    <p class= "descricao">${dado.description}</p>
                </div>
                <div>
                    <button class="btn-delete" data-id="${dado.id}">Excluir</button>
                </div>
            </li>
        `;
    });
}

function apagarRegistro(id){
    const dadosSalvos = localStorage.getItem("dados");
    const dados = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    const novosDados = dados.filter(item => item.id !== id);

    localStorage.setItem("dados", JSON.stringify(novosDados));
}

lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".btn-delete");

    if (botao) {
        const id = Number(botao.dataset.id);

        apagarRegistro(id);

        botao.closest("li").remove();
    }
});
listarRegistro();


// garantindo a instalação na tela inicial
const btn_install = document.getElementById("install");


if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker registrado"))
    .catch(err => console.error("Erro ao registrar o service worker:", err));
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn_install.style.display = 'block';
});

btn_install.addEventListener("click", () => {
    if(!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
        console.log(choice.outcome);
        deferredPrompt = null;
        btn_install.style.display = 'none';
    })
})