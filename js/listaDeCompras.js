//Selección para DOM
const form = document.querySelector(".grocery-form")
const alert = document.querySelector(".alert")
const btnAgregar = document.querySelector(".submit-btn")
const lista = document.querySelector(".grocery-list")
const btnLimpiar = document.querySelector(".clear-btn")
const compra = document.getElementById("grocery")
const container = document.querySelector(".grocery-container")

//Event Listeners
form.addEventListener("submit", agregarElemento)
btnLimpiar.addEventListener("click", limpiarLista)
window.addEventListener("DOMContentLoaded", setupItems)

//Variables para el edit
let editarElemento
let editando = false
let editID = ""

//Funciones
function agregarElemento(evento) {
    evento.preventDefault()
    const value = compra.value
    const id = new Date().getTime().toString()
    if (value !== "" && editando === false) {
        createListItem(id,value)
        mostrarAlerta("Elemento agregado con exito!", "success")
        container.classList.add("show-container")
        addToLocalStorage(id, value)
        volverAlDefault()
    } else if (value !== "" && editando === true) {
        editarElemento.innerHTML = value
        console.log(value);
        mostrarAlerta("Elemento editado con exito!", "success")
        editarLocalStorage(editID, value)
        volverAlDefault()
    } else {
        mostrarAlerta("ingrese un valor", "danger")
    }
}

//AGREGADO DE TOASTIFY

function mostrarAlerta(texto, color) {
    Toastify({
        text: texto,
        className: `alert-${color}`,
        duration: "1500"
    }).showToast();
}



function borrarPieza(evento) {
    const elemento = evento.currentTarget.parentElement.parentElement
    const id = elemento.dataset.id
    lista.removeChild(elemento)
    if (lista.children.length === 0) {
        container.classList.remove("show-container")
    }
    mostrarAlerta("Elemento eliminado", "danger")
    volverAlDefault()
    removeFromLocalStorage(id)
}

function editarPieza(evento) {
    const elemento = evento.currentTarget.parentElement.parentElement
    editarElemento = evento.currentTarget.parentElement.previousElementSibling
    compra.value = editarElemento.innerHTML
    editando = true
    editID = elemento.dataset.id
    btnAgregar.textContent = "Editar"
}

function limpiarLista() {
    const piezas = document.querySelectorAll(".grocery-item")
    if (piezas.length > 0) {
        piezas.forEach(function (pieza) {
            lista.removeChild(pieza)
        })
    }
    container.classList.remove("show-container")
    mostrarAlerta("Lista vacía", "success")
    localStorage.removeItem("lista")
    volverAlDefault()
}

function volverAlDefault() {
    compra.value = ""
    editando = false
    editID = ""
    btnAgregar.textContent = "Agregar"
}

//LocalStorage
function addToLocalStorage(id, value) {
    const compra = { id, value }
    let items = getLocalStorage()
    console.log(items);
    items.push(compra)
    localStorage.setItem("lista", JSON.stringify(items))

}

function removeFromLocalStorage(id) {
    let items = getLocalStorage()
    items = items.filter(function(item){
        if (item.id !==id){
            return item
        }
    })
    localStorage.setItem("lista", JSON.stringify(items))
}

function editarLocalStorage(id, value) {
    let items = getLocalStorage()
    items = items.map(function(item){
        if(item.id === id){
            item.value = value
        }
        return item
    })
    localStorage.setItem("lista", JSON.stringify(items))

}

function getLocalStorage(){
    return localStorage.getItem("lista") ? JSON.parse(localStorage.getItem("lista")) : [];
}


function setupItems(){
    let items = getLocalStorage()
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value)
        })
        container.classList.add("show-container")
    }
}

function createListItem(id, value){
    const elemento = document.createElement("article")
        elemento.classList.add("grocery-item")
        const attr = document.createAttribute("data-id")
        attr.value = id
        elemento.setAttributeNode(attr)
        elemento.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
        <!-- edit btn -->
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <!-- delete btn -->
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
        </div>`
        const btnBorrar = elemento.querySelector(".delete-btn");
        btnBorrar.addEventListener("click", borrarPieza);
        const btnEditar = elemento.querySelector(".edit-btn");
        btnEditar.addEventListener("click", editarPieza);
        lista.appendChild(elemento)
}
