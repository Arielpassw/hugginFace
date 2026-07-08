const form = document.getElementById("chatForm");
const promptInput = document.getElementById("prompt");
const messagesBox = document.getElementById("messages");

const clearBtn = document.getElementById("clearBtn");

const modeInput = document.getElementById("mode");
const modelInput = document.getElementById("model");

const modelName = document.getElementById("modelName");
const modelDescription = document.getElementById("modelDescription");
const activeModel = document.getElementById("activeModel");

// MODELOS


const MODELS = {

    "meta-llama/Llama-3.1-8B-Instruct": {
        name: " Llama 3.1 8B",
        description: "Excelente para programación, razonamiento y respuestas generales."
    },

    "mistralai/Mistral-7B-Instruct-v0.3": {
        name: " Mistral 7B",
        description: "Muy rápido y preciso para preguntas técnicas."
    },

    "Qwen/Qwen3-8B": {
        name: " Qwen 3",
        description: "Gran equilibrio entre velocidad y calidad."
    },

    "deepseek-ai/DeepSeek-R1": {
        name: " DeepSeek R1",
        description: "Especialista en razonamiento y resolución de problemas."
    },

    "google/gemma-3-12b-it": {
        name: " Gemma 3",
        description: "Muy potente para lenguaje natural."
    },

    "microsoft/Phi-4": {
        name: " Phi-4",
        description: "Excelente para programación y análisis."
    },

    "TinyLlama/TinyLlama-1.1B-Chat-v1.0": {
        name: " TinyLlama",
        description: "Modelo ligero y muy rápido."
    }

};

// LOCAL STORAGE

let messages =
    JSON.parse(localStorage.getItem("minigpt_messages")) || [];

const savedModel = localStorage.getItem("selected_model");

if (savedModel && MODELS[savedModel]) {
    modelInput.value = savedModel;
}

const savedMode = localStorage.getItem("selected_mode");

if (savedMode) {
    modeInput.value = savedMode;
}

// ACTUALIZAR TARJETA DEL MODELO

function updateModelCard() {

    const info = MODELS[modelInput.value];

    modelName.textContent = info.name;

    modelDescription.textContent = info.description;

    activeModel.textContent = info.name;

}

updateModelCard();

// EVENTOS

modelInput.addEventListener("change", () => {

    localStorage.setItem(
        "selected_model",
        modelInput.value
    );

    updateModelCard();

});

modeInput.addEventListener("change", () => {

    localStorage.setItem(
        "selected_mode",
        modeInput.value
    );

});

// GUARDAR MENSAJES

function saveMessages() {

    localStorage.setItem(
        "minigpt_messages",
        JSON.stringify(messages)
    );

}

// BURBUJAS

function addBubble(role, content, shouldScroll = true) {

    const div = document.createElement("div");

    div.className = `message ${role}`;

    div.textContent = content;

    messagesBox.appendChild(div);

    if (shouldScroll) {

        messagesBox.scrollTop =
            messagesBox.scrollHeight;

    }

}

// RENDER

function renderMessages() {

    messagesBox.innerHTML = "";

    if (messages.length === 0) {

        addBubble(

            "assistant",

            ` Hola.

Soy MiniGPT HF.

Puedes cambiar el modelo de IA cuando quieras desde el panel izquierdo.`,

            false

        );

        return;

    }

    messages.forEach(msg => {

        addBubble(

            msg.role,

            msg.content,

            false

        );

    });

    messagesBox.scrollTop =
        messagesBox.scrollHeight;

}

// ENVIAR MENSAJE

async function sendMessage(userText) {

    messages.push({

        role: "user",

        content: userText

    });

    saveMessages();

    renderMessages();

    messages.push({

        role: "assistant",

        content: " Generando respuesta..."

    });

    renderMessages();

    try {

        const response = await fetch(

            "/api/chat",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    mode: modeInput.value,

                    model: modelInput.value,

                    messages: messages.filter(

                        m =>
                            m.content !==
                            " Generando respuesta..."

                    )

                })

            }

        );

        const data = await response.json();

        messages.pop();

        if (!response.ok) {

            messages.push({

                role: "assistant error",

                content:
                    data.error ||
                    "Error desconocido."

            });

        }

        else {

            messages.push({

                role: "assistant",

                content:
` ${MODELS[data.model].name}

${data.answer}`

            });

        }

    }

    catch (error) {

        messages.pop();

        messages.push({

            role: "assistant error",

            content:
                "No se pudo conectar con el backend.\n\n" +
                error.message

        });

    }

    saveMessages();

    renderMessages();

}

// FORMULARIO

form.addEventListener(

    "submit",

    async (event) => {

        event.preventDefault();

        const text =
            promptInput.value.trim();

        if (!text) return;

        promptInput.value = "";

        const button =
            form.querySelector("button");

        button.disabled = true;

        await sendMessage(text);

        button.disabled = false;

        promptInput.focus();

    }

);

// ENTER

promptInput.addEventListener(

    "keydown",

    (event) => {

        if (

            event.key === "Enter"

            &&

            !event.shiftKey

        ) {

            event.preventDefault();

            form.requestSubmit();

        }

    }

);

// LIMPIAR CHAT

clearBtn.addEventListener(

    "click",

    () => {

        messages = [];

        saveMessages();

        renderMessages();

    }

);

// HEALTH

async function checkHealth() {

    try {

        await fetch("/api/health");

    }

    catch (e) {

        console.log("Backend no disponible");

    }

}

checkHealth();

renderMessages();