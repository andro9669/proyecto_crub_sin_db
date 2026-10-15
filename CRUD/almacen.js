const fs = require("fs");
const ARCHIVO = "tareas.json";

const datos = cargar();
let todoList = datos.tareas;
let identificador = datos.identificador;

// Mi interpretacion de "express.json()"
function simulacionExpressJson(req, res, next) {
  if (!req.headers["content-type"]) return next();
  if (!req.headers["content-type"].includes("application/json")) return next();

  let texto = "";
  req.on("data", (chunk) => {
    texto += chunk;
  });

  req.on("end", () => {
    try {
      req.body = JSON.parse(texto);
      next();
    } catch (e) {
      e.type = "entity.parse.failed";
      return next(e);
    }
  });
}

function cargar() {
  try {
    return JSON.parse(fs.readFileSync(ARCHIVO, "utf-8"));
  } catch (e) {
    if (e.code === "ENOENT") return { identificador: 1, tareas: [] };
    throw e;
  }
}

function guardar() {
  return fs.writeFileSync(
    ARCHIVO,
    JSON.stringify({
      identificador,
      tareas: todoList,
    }),
  );
}

function listar() {
  return todoList;
}

function buscar(id) {
  let tareaEncontrada = undefined;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].identificador === id) {
      tareaEncontrada = todoList[i];
      break;
    }
  }
  return tareaEncontrada;
}

function crear(titulo, descripcion) {
  const nuevaTarea = {
    identificador: identificador++,
    titulo: titulo.trim(),
    descripcion: descripcion,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };
  todoList.push(nuevaTarea);
  guardar();
  return nuevaTarea;
}

function eliminar(id) {
  let tareaEliminada;
  let listaFiltrada = [];

  for (let i = 0; i < todoList.length; i++) {
    const tareaActual = todoList[i];
    if (tareaActual.identificador !== id) {
      listaFiltrada.push(tareaActual);
    } else {
      tareaEliminada = tareaActual;
    }
  }

  if (!tareaEliminada) {
    return false;
  }

  ordenarLista(listaFiltrada);
  todoList = listaFiltrada;
  guardar();
  return tareaEliminada;
}

function ordenarLista(lista) {
  for (let i = 0; i < lista.length; i++) {
    lista[i].identificador = i + 1;
  }
  identificador = lista.length + 1;
}

module.exports = { listar, buscar, crear, eliminar };
