const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

// log de cada requisição para debugar no Railway
app.use((req, res, next) => {
  console.log(`REQ ${req.method} ${req.url}`);
  next();
});

// servir arquivos estáticos (quando o package.json está na raiz e server.js está em config)
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));


// conexão com MySQL usando variáveis de ambiente
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const missingEnv = [];
if (!dbHost) missingEnv.push('DB_HOST');
if (!dbUser) missingEnv.push('DB_USER');
if (!dbPassword) missingEnv.push('DB_PASSWORD');
if (!dbName) missingEnv.push('DB_NAME');
if (missingEnv.length) {
  console.error(`❌ Faltam variáveis de ambiente: ${missingEnv.join(', ')}`);
}

const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName
});


db.connect((err) => {
  if (err) {
    console.log("❌ Erro ao conectar no MySQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL!");
  }
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/", (req, res) => {
  const indexPath = path.join(publicDir, "index.html");
  console.log(`Serving index file from ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('SendFile error:', err);
      res.status(500).send('Erro interno ao enviar index.html');
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

