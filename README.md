
# MiniGPT HF

MiniGPT HF es una aplicación web de inteligencia artificial desarrollada con **Node.js** y la **API de Hugging Face Inference**, que permite conversar con distintos modelos de lenguaje (LLMs) mediante una interfaz moderna e intuitiva.

El usuario puede seleccionar tanto el **modo del asistente** como el **modelo de IA** con el que desea interactuar, sin necesidad de reiniciar el servidor.

---

# Vista del Proyecto

Agregue aquí una captura de pantalla del sistema.

<img width="1368" height="963" alt="image" src="https://github.com/user-attachments/assets/3cb1bea6-62cc-42b2-95ac-eda71d0706d4" />


---

# Características

- Chat con Inteligencia Artificial.
- Cambio dinámico de modelos de IA.
- Selección del modo de conversación.
- Historial de conversación almacenado en el navegador.
- Interfaz moderna y adaptable a diferentes dispositivos.
- Backend desarrollado con Express.
- Configuración mediante variables de entorno con dotenv.
- Comunicación cliente-servidor mediante Fetch API.

---

# Modelos soportados

Actualmente el sistema soporta los siguientes modelos compatibles con Hugging Face:

| Modelo | Estado |
|---------|--------|
| Meta Llama 3.1 8B Instruct | Disponible |
| Qwen 3 8B | Disponible |
| DeepSeek R1 | Disponible |
| Gemma 3 12B | Disponible |
| Mistral 7B Instruct | Compatibilidad según proveedor |
| Phi-4 | Compatibilidad según proveedor |
| TinyLlama 1.1B | Compatibilidad según proveedor |

---

# Modos del asistente

El sistema dispone de tres modos de conversación.

## Profesor de Desarrollo Web

Especializado en:

- HTML
- CSS
- JavaScript
- Node.js
- APIs REST
- Frameworks Web

## Tutor de Inglés

Permite:

- Corregir gramática.
- Explicar vocabulario.
- Practicar conversaciones.
- Generar ejemplos.

## Depurador de Código

Ayuda a:

- Encontrar errores.
- Explicar excepciones.
- Optimizar código.
- Proponer soluciones.

---

# Tecnologías utilizadas

## Backend

- Node.js
- CORS
- Hugging Face Inference SDK

## Frontend

- HTML5
- CSS
- JavaScript
- LocalStorage

---

# Estructura del proyecto

```text
MiniGPT-HF/
│
├── backend/
│   ├── public/
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/USUARIO/MiniGPT-HF.git
```

## 2. Ingresar al proyecto

```bash
cd MiniGPT-HF/backend
```

## 3. Instalar las dependencias

```bash
npm install
```

## 4. Crear el archivo `.env`

```env
HF_TOKEN=TU_TOKEN_DE_HUGGING_FACE
PORT=3000
HF_PROVIDER=auto
HF_MODEL=meta-llama/Llama-3.1-8B-Instruct
```

## 5. Ejecutar la aplicación

```bash
npm run dev
```
---

# Acceso a la aplicación

Abrir el navegador en:

```
http://localhost:3000
```
---

# API

## Verificar el estado del servidor

### Solicitud

```http
GET /api/health
```

### Respuesta

```json
{
  "ok": true,
  "provider": "auto",
  "defaultModel": "meta-llama/Llama-3.1-8B-Instruct"
}
```

---

## Enviar un mensaje al asistente

### Solicitud

```http
POST /api/chat
```

### Cuerpo de la petición

```json
{
  "mode": "web",
  "model": "meta-llama/Llama-3.1-8B-Instruct",
  "messages": [
    {
      "role": "user",
      "content": "¿Qué es JavaScript?"
    }
  ]
}
```

### Respuesta

```json
{
  "answer": "...",
  "model": "meta-llama/Llama-3.1-8B-Instruct",
  "provider": "auto"
}
```

---

# Funcionalidades del Frontend

- Selector del modelo de IA.
- Selector del modo del asistente.
- Historial persistente mediante LocalStorage.
- Limpieza de conversaciones.
- Visualización del modelo utilizado en cada respuesta.
- Diseño responsive.
- Animaciones de mensajes.

---

# Variables de entorno

| Variable | Descripción |
|----------|-------------|
| HF_TOKEN | Token de acceso de Hugging Face |
| PORT | Puerto del servidor |
| HF_PROVIDER | Proveedor de inferencia |
| HF_MODEL | Modelo utilizado por defecto |

