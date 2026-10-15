const almacen = require("./almacen");

function validarJSON(req, res, next) {
  const tipo = req.headers["content-type"] ?? "";

  if (!tipo.toLowerCase().includes("application/json")) {
    return res.status(415).json({
      error: "Se exige formato JSON",
    });
  }
  next();
}

function validarPropiedad(propiedad, nombre, res) {
  if (!propiedad) {
    res.status(400).json({
      error: `Se exige que exista ${nombre}`,
    });
  }
  if (typeof propiedad !== "string" || propiedad.trim() === "") {
    res.status(400).json({
      error: `Se exige que ${nombre} no sea un campo vacio`,
    });
    return false;
  }
  return true;
}

function validarID(req, res, next, idValue) {
  const id = Number(idValue);
  if (!Number.isInteger(id))
    return res.status(400).json({
      error: `${idValue} no es un numero entero.`,
    });

  next();
}

module.exports = { validarPropiedad, validarJSON, validarID };
