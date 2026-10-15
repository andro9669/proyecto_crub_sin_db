const almacen = require("./almacen");
const express = require("express");
const { validarJSON, validarPropiedad, validarID } = require("./validaciones");
const app = express();
const PORT = 3000;

app.use(express.json());

app.param("id", validarID);

app.get("/tareas", (req, res) => {
  res.json(almacen.listar());
});

app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tareaEncontrada = almacen.buscar(id);

  if (!tareaEncontrada)
    return res.status(404).json({
      error: `No hay una tarea registrada con el id ${id}`,
    });

  res.json(tareaEncontrada);
});

app.post("/tareas", validarJSON, (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!validarPropiedad(titulo, "titulo", res)) return;
  if (!validarPropiedad(descripcion, "descripcion", res)) return;

  const nuevaTarea = almacen.crear(titulo, descripcion);
  res.status(201).json({
    mensaje: "Nueva tarea agregada exitosamente",
    tarea: nuevaTarea,
  });
});

app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tareaEliminada = almacen.eliminar(id);
  if (!tareaEliminada) {
    return res.status(404).json({
      error: "Tarea no encontrada",
    });
  }
  res.json({
    mensaje: "tarea eliminada exitosamente",
    tarea: tareaEliminada,
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    error: "Pagina no encontrada",
  });
});

app.use((e, req, res, next) => {
  if (e.type == "entity.parse.failed")
    return res.status(400).json({
      error: "Se exige un JSON en el formato adecuado.",
    });
  res.status(500).json({
    error: "Error interno",
  });
});

app.listen(PORT, () => {
  console.log(`Escuchando desde el puerto ${PORT}`);
});
