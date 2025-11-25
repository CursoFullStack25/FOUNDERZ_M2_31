// ===========================
// Función Express - Script Principal
// ===========================

// Estado de la aplicación
let retoActual = null;

// ===========================
// EVENTO DOMCONTENTLOADED
// ===========================

/**
 * Inicialización cuando el DOM esté listo
 */
document.addEventListener("DOMContentLoaded", () => {
  // a) Rellenar los botones de reto con los nombres de RETOS
  rellenarBotonesReto();

  // b) Asignar a cada botón un listener que llame a mostrarReto
  asignarListenersRetos();

  // Vincular el botón "Probar" al validador
  vincularBotonProbar();

  // Permitir probar con Enter en el campo de fórmula
  const inputFormula = document.getElementById("formula-input");
  inputFormula.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      probarFormula();
    }
  });

  // c) Mostrar automáticamente el Reto 1 al cargar
  mostrarReto(1);
});

/**
 * Rellena los botones de reto con los nombres de RETOS
 */
function rellenarBotonesReto() {
  const botonesReto = document.querySelectorAll(".reto-buttons button");

  botonesReto.forEach((boton, index) => {
    const retoId = index + 1;
    const reto = RETOS.find((r) => r.id === retoId);

    if (reto) {
      // Actualizar el texto del botón con el nombre del reto
      boton.textContent = reto.nombre;
      boton.dataset.reto = retoId;
    }
  });
}

/**
 * Asigna listeners a los botones de reto
 */
function asignarListenersRetos() {
  const botonesReto = document.querySelectorAll(".reto-buttons button");

  botonesReto.forEach((boton) => {
    boton.addEventListener("click", () => {
      const retoId = parseInt(boton.dataset.reto);

      // Llamar a mostrarReto
      mostrarReto(retoId);

      // Actualizar estado visual de botones
      botonesReto.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");
    });
  });
}

/**
 * Vincula el botón "Probar" al validador
 */
function vincularBotonProbar() {
  const botonProbar = document.getElementById("probar-btn");
  botonProbar.addEventListener("click", probarFormula);
}

// ===========================
// FUNCIÓN MOSTRAR RETO
// ===========================

/**
 * Actualiza el DOM con los datos del reto seleccionado
 * @param {number} id - ID del reto a mostrar
 */
function mostrarReto(id) {
  const reto = RETOS.find((r) => r.id === id);

  if (!reto) {
    console.error(`Reto ${id} no encontrado`);
    return;
  }

  // Actualizar estado de la aplicación
  retoActual = reto;

  // Actualizar DOM
  actualizarEnunciado(reto);
  limpiarResultados();
  limpiarFormula();
}

/**
 * Actualiza la sección de enunciado con los datos del reto
 * @param {Object} reto - Objeto reto con los datos
 */
function actualizarEnunciado(reto) {
  const contenedor = document.getElementById("enunciado-contenido");

  // Construir lista de parámetros
  const listaParametros = reto.parametros
    .map((p) => `<code>${p.nombre}</code> (${p.tipo})`)
    .join(", ");

  contenedor.innerHTML = `
    <div class="enunciado-detalle">
      <p><strong>📋 Tarea:</strong></p>
      <p>${reto.enunciado}</p>
      
      <p style="margin-top: 1rem;"><strong>💡 Ejemplo:</strong></p>
      <p><code style="background-color: #f1f5f9; padding: 0.5rem; display: block; border-radius: 4px;">${reto.ejemplo}</code></p>
      
      <p style="margin-top: 1rem;"><strong>🔧 Parámetros:</strong></p>
      <p>${listaParametros}</p>
      
      <p style="margin-top: 1rem;"><strong>✅ Casos de prueba:</strong> ${reto.casosPrueba.length}</p>
    </div>
  `;
}

// ===========================
// LÓGICA DE VALIDACIÓN
// ===========================

/**
 * Valida que la fórmula sea segura
 */
function validarSeguridadFormula(formula) {
  // Lista de palabras prohibidas (riesgo de seguridad)
  const palabrasProhibidas = [
    "eval",
    "Function",
    "function",
    "constructor",
    "prototype",
    "window",
    "document",
    "global",
    "process",
    "require",
    "import",
    "export",
    "__proto__",
    "this",
    "setTimeout",
    "setInterval",
    "fetch",
    "XMLHttpRequest",
    "localStorage",
    "sessionStorage",
    "cookie",
    "location",
    "alert",
    "confirm",
    "prompt",
    "console",
    "Error",
    "throw",
    "try",
    "catch",
  ];

  // Buscar palabras prohibidas (case insensitive)
  const formulaLower = formula.toLowerCase();
  for (const palabra of palabrasProhibidas) {
    if (formulaLower.includes(palabra.toLowerCase())) {
      return {
        valido: false,
        mensaje: `No se permite usar "${palabra}" en la fórmula.`,
      };
    }
  }

  // Verificar que no contenga punto y coma (podría ejecutar múltiples sentencias)
  if (formula.includes(";")) {
    return {
      valido: false,
      mensaje: "No se permiten múltiples sentencias (;) en la fórmula.",
    };
  }

  // Patrón de caracteres permitidos:
  // - letras, números, espacios
  // - operadores: + - * / % < > = ! & |
  // - paréntesis, corchetes, llaves
  // - puntos, comas
  // - comillas simples y dobles
  // - guion bajo (para nombres de variables)
  const patronSeguro = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s+\-*/%<>=!&|()[\]{}.,'"`_]+$/;

  if (!patronSeguro.test(formula)) {
    return {
      valido: false,
      mensaje: "La fórmula contiene caracteres no permitidos.",
    };
  }

  return { valido: true };
}

/**
 * Crea una función segura desde la fórmula
 */
function crearFuncionSegura(parametros, formula) {
  try {
    // Validar seguridad
    const validacion = validarSeguridadFormula(formula);
    if (!validacion.valido) {
      throw new Error(validacion.mensaje);
    }

    // Obtener nombres de parámetros
    const nombresParams = parametros.map((p) => p.nombre);

    // Crear función con new Function (más seguro que eval)
    // Ejemplo: new Function('x', 'return x * 2')
    const funcionCreada = new Function(...nombresParams, `return ${formula}`);

    return { exito: true, funcion: funcionCreada };
  } catch (error) {
    return {
      exito: false,
      error: error.message || "Error al crear la función",
    };
  }
}

// ===========================
// EJECUCIÓN DE PRUEBAS
// ===========================

/**
 * Ejecuta las pruebas con la fórmula ingresada
 */
function probarFormula() {
  if (!retoActual) {
    mostrarError("Selecciona un reto primero.");
    return;
  }

  const inputFormula = document.getElementById("formula-input");
  const formula = inputFormula.value.trim();

  if (!formula) {
    mostrarError("Ingresa una fórmula para probar.");
    inputFormula.focus();
    return;
  }

  // Limpiar resultados anteriores
  limpiarResultados();

  // Crear función desde la fórmula
  const resultado = crearFuncionSegura(retoActual.parametros, formula);

  if (!resultado.exito) {
    mostrarError(
      "❌ Revisa tu fórmula. Usa solo operaciones básicas y los parámetros indicados."
    );
    return;
  }

  // Ejecutar casos de prueba
  ejecutarCasosPrueba(resultado.funcion);
}

/**
 * Ejecuta todos los casos de prueba
 */
function ejecutarCasosPrueba(funcion) {
  const contenedorResultados = document.getElementById("resultados");
  const resultados = [];

  for (let i = 0; i < retoActual.casosPrueba.length; i++) {
    const caso = retoActual.casosPrueba[i];
    let exito = false;
    let salidaObtenida = null;
    let hayError = false;

    try {
      // Preparar argumentos (puede ser un valor único o un array)
      const args = Array.isArray(caso.entrada) ? caso.entrada : [caso.entrada];

      // Ejecutar función
      salidaObtenida = funcion(...args);

      // Comparar resultado
      exito = compararResultados(salidaObtenida, caso.salidaEsperada);
    } catch (error) {
      hayError = true;
      salidaObtenida = `Error: ${error.message}`;
    }

    // Crear elemento de resultado
    const elementoResultado = crearElementoResultado(
      i + 1,
      caso,
      salidaObtenida,
      exito,
      hayError
    );
    contenedorResultados.appendChild(elementoResultado);

    resultados.push(exito);
  }

  // Mostrar resumen
  mostrarResumen(resultados);
}

// ===========================
// FUNCIONES AUXILIARES
// ===========================

/**
 * Compara dos valores (maneja tipos primitivos)
 */
function compararResultados(obtenido, esperado) {
  // Comparación estricta
  if (obtenido === esperado) return true;

  // Comparación flexible para números con decimales
  if (typeof obtenido === "number" && typeof esperado === "number") {
    return Math.abs(obtenido - esperado) < 0.0001;
  }

  return false;
}

/**
 * Crea un elemento DOM para mostrar un resultado de prueba
 */
function crearElementoResultado(numero, caso, salidaObtenida, exito, hayError) {
  const div = document.createElement("div");
  div.className = `resultado-item ${exito ? "exito" : "error"}`;

  // Formatear entrada
  const entradaStr = Array.isArray(caso.entrada)
    ? caso.entrada.map(formatearValor).join(", ")
    : formatearValor(caso.entrada);

  // Formatear salidas
  const esperadaStr = formatearValor(caso.salidaEsperada);
  const obtenidaStr = formatearValor(salidaObtenida);

  div.innerHTML = `
    <div class="resultado-detalle">
      <div class="resultado-titulo">Prueba ${numero}</div>
      <div>Entrada: ${entradaStr}</div>
      <div>Esperado: ${esperadaStr}</div>
      <div>Obtenido: ${obtenidaStr}</div>
    </div>
  `;

  return div;
}

/**
 * Formatea un valor para mostrarlo
 */
function formatearValor(valor) {
  if (typeof valor === "string") {
    return `"${valor}"`;
  }
  if (valor === null) {
    return "null";
  }
  if (valor === undefined) {
    return "undefined";
  }
  return String(valor);
}

/**
 * Muestra el resumen final de las pruebas
 */
function mostrarResumen(resultados) {
  const contenedorResultados = document.getElementById("resultados");
  const divResumen = document.createElement("div");
  divResumen.className = "resultado-resumen";

  const correctos = resultados.filter((r) => r).length;
  const total = resultados.length;

  if (correctos === total) {
    divResumen.classList.add("todos-correctos");
    divResumen.textContent = "✅ ¡Correcto! Tu función funciona perfectamente.";
  } else {
    divResumen.classList.add("hay-errores");
    divResumen.textContent = `❌ ${correctos} de ${total} pruebas correctas. Revisa tu fórmula.`;
  }

  contenedorResultados.appendChild(divResumen);
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
  const contenedorResultados = document.getElementById("resultados");
  contenedorResultados.innerHTML = `
    <div class="resultado-item error">
      <div class="resultado-detalle">
        <div class="resultado-titulo">Error</div>
        <div>${mensaje}</div>
      </div>
    </div>
  `;
}

/**
 * Limpia el contenedor de resultados
 */
function limpiarResultados() {
  const contenedorResultados = document.getElementById("resultados");
  contenedorResultados.innerHTML = "";
}

/**
 * Limpia el campo de fórmula
 */
function limpiarFormula() {
  const inputFormula = document.getElementById("formula-input");
  inputFormula.value = "";
}
