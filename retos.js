// ===========================
// Función Express - Retos
// ===========================

const RETOS = [
  {
    id: 1,
    nombre: "Doble de un número",
    enunciado:
      "Crea una función que reciba un número y devuelva el doble de ese número.",
    ejemplo: "doble(5) → 10",
    respuesta: "x * 2",
    parametros: [{ nombre: "x", tipo: "number" }],
    casosPrueba: [
      { entrada: 5, salidaEsperada: 10 },
      { entrada: 0, salidaEsperada: 0 },
      { entrada: -3, salidaEsperada: -6 },
      { entrada: 7.5, salidaEsperada: 15 },
      { entrada: 100, salidaEsperada: 200 },
    ],
  },
  {
    id: 2,
    nombre: "Saludo personalizado",
    enunciado:
      "Crea una función que reciba un nombre (string) y devuelva un saludo personalizado. Por ejemplo: 'Hola, Ana!'",
    ejemplo: "saludar('Ana') → 'Hola, Ana!'",
    respuesta: "'Hola, ' + nombre + '!'",
    parametros: [{ nombre: "nombre", tipo: "string" }],
    casosPrueba: [
      { entrada: "Ana", salidaEsperada: "Hola, Ana!" },
      { entrada: "Carlos", salidaEsperada: "Hola, Carlos!" },
      { entrada: "María", salidaEsperada: "Hola, María!" },
      { entrada: "Pedro", salidaEsperada: "Hola, Pedro!" },
      { entrada: "Lucía", salidaEsperada: "Hola, Lucía!" },
    ],
  },
  {
    id: 3,
    nombre: "Área de un rectángulo",
    enunciado:
      "Crea una función que reciba la base y la altura de un rectángulo y devuelva su área (base × altura).",
    ejemplo: "areaRectangulo(4, 5) → 20",
    respuesta: "base * altura",
    parametros: [
      { nombre: "base", tipo: "number" },
      { nombre: "altura", tipo: "number" },
    ],
    casosPrueba: [
      { entrada: [4, 5], salidaEsperada: 20 },
      { entrada: [10, 3], salidaEsperada: 30 },
      { entrada: [7, 7], salidaEsperada: 49 },
      { entrada: [2.5, 4], salidaEsperada: 10 },
      { entrada: [0, 10], salidaEsperada: 0 },
    ],
  },
  {
    id: 4,
    nombre: "Es par",
    enunciado:
      "Crea una función que reciba un número y devuelva true si es par, false si es impar.",
    ejemplo: "esPar(4) → true, esPar(7) → false",
    respuesta: "numero % 2 === 0",
    parametros: [{ nombre: "numero", tipo: "number" }],
    casosPrueba: [
      { entrada: 4, salidaEsperada: true },
      { entrada: 7, salidaEsperada: false },
      { entrada: 0, salidaEsperada: true },
      { entrada: -2, salidaEsperada: true },
      { entrada: 15, salidaEsperada: false },
    ],
  },
  {
    id: 5,
    nombre: "Repetir texto",
    enunciado:
      "Crea una función que reciba un texto (string) y un número, y devuelva el texto repetido ese número de veces.",
    ejemplo: "repetir('Hola', 3) → 'HolaHolaHola'",
    respuesta: "texto.repeat(veces)",
    parametros: [
      { nombre: "texto", tipo: "string" },
      { nombre: "veces", tipo: "number" },
    ],
    casosPrueba: [
      { entrada: ["Hola", 3], salidaEsperada: "HolaHolaHola" },
      { entrada: ["Si", 2], salidaEsperada: "SiSi" },
      { entrada: ["A", 5], salidaEsperada: "AAAAA" },
      { entrada: ["Test", 1], salidaEsperada: "Test" },
      { entrada: ["Bye", 0], salidaEsperada: "" },
    ],
  },
];
