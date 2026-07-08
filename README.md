# MiniGPT HF

Aplicación fullstack sencilla para usar Hugging Face desde un backend Node.js y un frontend HTML/CSS/JS.

## Ejecutar

```bash
cd backend
npm install
cp .env.example .env
# Editar .env y pegar HF_TOKEN
npm run dev
```

Abrir: http://localhost:3000

## Importante

No subir el archivo `.env` a GitHub. El token de Hugging Face debe quedarse en el backend.
