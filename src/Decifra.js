import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const DescifrarExamen = () => {
  const [codigoCifrado, setCodigoCifrado] = useState('');
  const [respuestas, setRespuestas] = useState(null);

  // Función para descifrar respuestas
  const descifrarRespuestas = (codigoCifrado) => {
    const claveSecreta = "Rodrigo";
    const bytes = CryptoJS.AES.decrypt(codigoCifrado, claveSecreta);
    const respuestasDescifradas = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(respuestasDescifradas);
  };

  const manejarDescifrado = () => {
    console.log("Descifrando respuestas...");
    try {
      const respuestasDescifradas = descifrarRespuestas(codigoCifrado);
      setRespuestas(respuestasDescifradas);
    } catch (error) {
      console.error("Error al descifrar el código:", error);
      setRespuestas(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Descifrar Respuestas del Examen</h1>
      <div className="mb-4">
        <label htmlFor="codigoCifrado" className="mr-2">Introduce el código cifrado:</label>
        <input
          type="text"
          id="codigoCifrado"
          value={codigoCifrado}
          onChange={(e) => setCodigoCifrado(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <button
        onClick={manejarDescifrado}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Descifrar
      </button>

      {respuestas && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Respuestas Descifradas:</h2>
          <ul className="list-disc pl-8">
            {respuestas.map((respuesta, index) => (
              <li key={index}>{respuesta}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DescifrarExamen;
