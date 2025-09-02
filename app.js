const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

// Middleware para leer JSON
app.use(bodyParser.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "Projecto")));

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",     // tu host
  user: "root",          // tu usuario
  password: "",          // tu contraseña
  database: "techdb"     // tu base de datos
});

db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL ✅");
});

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Projecto", "menu.html"));
});

// Página confirmación
app.get("/confirmacion", (req, res) => {
  res.sendFile(path.join(__dirname, "Projecto", "confirmacion.html"));
});

// Ruta para guardar pedidos
app.post("/pedidos", (req, res) => {
  const { cliente, productos, total, fecha } = req.body;

  if (!cliente || !productos || !total) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const sqlPedido = "INSERT INTO pedidos (nombre, direccion, contacto, total) VALUES (?, ?, ?, ?)";
  db.query(sqlPedido, [cliente.nombre, cliente.direccion, cliente.contacto, total], (err, result) => {
    if (err) {
      console.error("Error al insertar pedido:", err);
      return res.status(500).json({ error: "Error al guardar pedido" });
    }

    const pedidoId = result.insertId;

    // Insertar productos del pedido
    const sqlProductos = "INSERT INTO pedido_productos (pedido_id, producto, cantidad, precio) VALUES ?";
    const values = productos.map(p => [pedidoId, p.title, p.quantity, p.price]);

    db.query(sqlProductos, [values], (err) => {
      if (err) {
        console.error("Error al insertar productos:", err);
        return res.status(500).json({ error: "Error al guardar productos" });
      }
      res.json({ message: "Pedido guardado correctamente", pedidoId });
    });
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
