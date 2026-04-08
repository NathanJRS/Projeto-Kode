const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

// servir arquivos estáticos (quando o package.json está na raiz e server.js está em config)
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));


// conexão com MySQL
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "@Ab12Fg#",
  database: "sistema_login"
});


db.connect((err) => {
  if (err) {
    console.log("❌ Erro ao conectar no MySQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL!");
  }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
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


app.post("/cadastro", async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        // Validação básica
        if (!usuario || !senha) {
            return res.json({ status: "erro", msg: "Usuário e senha são obrigatórios" });
        }

        const hash = await bcrypt.hash(senha, 10);

        const sql = "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)";

        db.query(sql, [usuario, hash], (err, result) => {
            if (err) {
                console.log("❌ Erro no cadastro:", err);
                return res.json({ status: "erro", msg: "Usuário já existe ou erro no banco" });
            }

            res.json({ status: "ok" });
        });
    } catch (erro) {
        console.log("❌ Erro geral no cadastro:", erro);
        res.json({ status: "erro", msg: "Erro ao processar cadastro" });
    }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

