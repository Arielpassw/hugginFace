import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const HF_TOKEN = process.env.HF_TOKEN;
const HF_PROVIDER = process.env.HF_PROVIDER || "auto";

// Modelo por defecto
const DEFAULT_MODEL =
  process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const hf = new InferenceClient(HF_TOKEN);

// PROMPTS DEL SISTEMA

const SYSTEM_PROMPTS = {
  web:
    "Eres un profesor experto en desarrollo web. Responde de forma clara, práctica y con ejemplos cuando sea necesario.",

  english:
    "Eres un profesor de inglés. Corrige errores con amabilidad, explica brevemente y proporciona ejemplos.",

  debug:
    "Eres un experto en depuración de software. Analiza el problema, explica el posible origen y propone soluciones paso a paso."
};

// MODELOS PERMITIDOS

const AVAILABLE_MODELS = [

  "meta-llama/Llama-3.1-8B-Instruct",

  "mistralai/Mistral-7B-Instruct-v0.3",

  "Qwen/Qwen3-8B",

  "deepseek-ai/DeepSeek-R1",

  "google/gemma-3-12b-it",

  "microsoft/Phi-4",

  "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

];

// HEALTH


app.get("/api/health", (req, res) => {

  res.json({

    ok: true,

    provider: HF_PROVIDER,

    defaultModel: DEFAULT_MODEL,

    availableModels: AVAILABLE_MODELS

  });

});

// CHAT

app.post("/api/chat", async (req, res) => {

  try {

    if (!HF_TOKEN) {

      return res.status(500).json({

        error: "No existe HF_TOKEN en el archivo .env"

      });

    }

    const {

      messages,

      mode = "web",

      model = DEFAULT_MODEL

    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {

      return res.status(400).json({

        error: "Debes enviar un arreglo messages."

      });

    }

    const selectedModel = AVAILABLE_MODELS.includes(model)
      ? model
      : DEFAULT_MODEL;

    const safeMessages = messages

      .filter(m => m && typeof m.content === "string")

      .map(m => ({

        role: ["system", "user", "assistant"].includes(m.role)
          ? m.role
          : "user",

        content: m.content.slice(0, 3000)

      }))

      .slice(-10);

    const response = await hf.chatCompletion({

      provider: HF_PROVIDER,

      model: selectedModel,

      messages: [

        {

          role: "system",

          content:
            SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.web

        },

        ...safeMessages

      ],

      temperature: 0.7,

      max_tokens: 350

    });

    const answer =
      response.choices?.[0]?.message?.content ||
      "No se recibió respuesta del modelo.";

    res.json({

      answer,

      model: selectedModel,

      provider: HF_PROVIDER

    });

  }

  catch (error) {

    console.error("Error en /api/chat");

    console.error(error);

    res.status(500).json({

      error: "No se pudo generar la respuesta.",

      detail: error.message

    });

  }

});

// INICIAR SERVIDOR

app.listen(PORT, () => {

  console.log("");


  console.log(" MiniGPT HF iniciado correctamente ");


  console.log(`Servidor : http://localhost:${PORT}`);
  console.log(`Proveedor: ${HF_PROVIDER}`);
  console.log(`Modelo por defecto: ${DEFAULT_MODEL}`);

  console.log("");

});