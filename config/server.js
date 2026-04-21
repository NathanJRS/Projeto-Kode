const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

// servir arquivos estáticos
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// conexão com MySQL usando variáveis de ambiente
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistema_login"
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar no MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

app.get("/", (req, res) => {
  const indexPath = path.join(publicDir, "index.html");
  console.log(`Tentando servir: ${indexPath}`);
  console.log(`Diretório public: ${publicDir}`);
  console.log(`Arquivo existe? ${require('fs').existsSync(indexPath)}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Erro ao enviar index.html:', err);
      res.status(404).send('Arquivo não encontrado');
    }
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE usuario = ?";
  
  db.query(sql, [usuario], async (err, result) => {
    if (err) return res.send(err);

    if (result.length > 0) {
      const user = result[0];
      const match = await bcrypt.compare(senha, user.senha);

      if (match) {
        res.json({ status: "ok" });
      } else {
        res.json({ status: "erro", msg: "Senha incorreta" });
      }
    } else {
      res.json({ status: "erro", msg: "Usuário não encontrado" });
    }
  });
});

// CADASTRO
app.post("/cadastro", async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.json({ status: "erro", msg: "Usuário e senha são obrigatórios" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)";

    db.query(sql, [usuario, hash], (err, result) => {
      if (err) {
        return res.json({ status: "erro", msg: "Usuário já existe ou erro no banco" });
      }
      res.json({ status: "ok" });
    });
  } catch (erro) {
    res.json({ status: "erro", msg: "Erro ao processar cadastro" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

