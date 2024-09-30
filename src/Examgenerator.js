import React, { useState } from 'react';
import { Document, Packer, Paragraph, PageBreak, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const GeneradorExamen = () => {
  const [numPreguntas, setNumPreguntas] = useState(3);
  const [numExamenes, setNumExamenes] = useState(5);
  const [examenes, setExamenes] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [cantidadPreguntas, setCantidadPreguntas] = useState(0);
  const [nombreExamen, setNombreExamen] = useState(""); // Almacenar el nombre del examen desde el JSON

  const ejemploJSON = {
    nombreExamen: 'Examen de Historia',
    preguntas: [
      {
        pregunta: "¿Cuál es la capital de Francia?",
        opciones: ["París", "Londres", "Berlín"],
        respuestaCorrecta: "París"
      },
    ]
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setPreguntas(jsonData.preguntas || []);
        setNombreExamen(jsonData.nombreExamen || "Examen Sin Nombre"); // Establecer el nombre del examen
        setCantidadPreguntas(jsonData.preguntas?.length || 0);
      } catch (error) {
        console.error("Error al leer el archivo JSON:", error);
      }
    };

    reader.readAsText(file);
  };

  const generarExamen = (numPreguntas) => {
    return preguntas
      .sort(() => 0.5 - Math.random())
      .slice(0, numPreguntas)
      .map(pregunta => ({
        ...pregunta,
        opciones: pregunta.opciones.sort(() => 0.5 - Math.random())
      }));
  };

  const generarExamenes = () => {
    if (preguntas.length > 0) {
      const nuevosExamenes = Array(numExamenes).fill().map(() => generarExamen(numPreguntas));
      setExamenes(nuevosExamenes);
    } else {
      alert("Por favor, sube un archivo JSON con las preguntas antes de generar los exámenes.");
    }
  };

  const dividirPreguntasEnColumnas = (examen) => {
    const mitad = Math.ceil(examen.length / 2);
    const columnaIzquierda = examen.slice(0, mitad);
    const columnaDerecha = examen.slice(mitad);

    const maxLength = Math.max(columnaIzquierda.length, columnaDerecha.length);

    const filas = [];
    for (let i = 0; i < maxLength; i++) {
      filas.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: columnaIzquierda[i]
                    ? `${i + 1}. ${columnaIzquierda[i].pregunta}`
                    : "",
                }),
                ...(columnaIzquierda[i]
                  ? columnaIzquierda[i].opciones.map((opcion, index) =>
                      new Paragraph({
                        text: `   ${['a', 'b', 'c', 'd'][index]}) ${opcion}`,
                      })
                    )
                  : []),
              ],
              width: {
                size: 50,
                type: WidthType.PERCENTAGE,
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: columnaDerecha[i]
                    ? `${mitad + i + 1}. ${columnaDerecha[i].pregunta}`
                    : "",
                }),
                ...(columnaDerecha[i]
                  ? columnaDerecha[i].opciones.map((opcion, index) =>
                      new Paragraph({
                        text: `   ${['a', 'b', 'c', 'd'][index]}) ${opcion}`,
                      })
                    )
                  : []),
              ],
              width: {
                size: 50,
                type: WidthType.PERCENTAGE,
              },
            }),
          ],
        })
      );
    }
    return filas;
  };

  const generarDocumentoWord = () => {
    const doc = new Document({
      sections: examenes.map((examen, examenIndex) => ({
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720, // 0.5 inch
              bottom: 720, // 0.5 inch
              left: 720, // 0.5 inch
            },
          },
        },
        children: [
          new Paragraph({
            text: `${nombreExamen}  Nombre: ______________________________________ Fecha ___/___/___`, // Se muestra el nombre del examen extraído del JSON
            heading: 'Heading4',
            spacing: {
              after: 100,
            },
          }),
          // Tabla de dos columnas con las preguntas y opciones
          new Table({
            rows: dividirPreguntasEnColumnas(examen),
          }),
          new Paragraph({
            children: [new PageBreak()],
          }),
        ],
      })),
    });

    Packer.toBlob(doc)
      .then(blob => {
        saveAs(blob, `Examenes_Generados_${nombreExamen}.docx`);
      })
      .catch(err => console.error("Error al generar el documento:", err));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generador de Exámenes Aleatorios</h1>
      {/* Input para subir archivo JSON */}
      <div className="mb-4">
        <label htmlFor="fileUpload" className="mr-2">Sube el archivo JSON con preguntas:</label>
        <input type="file" id="fileUpload" accept=".json" onChange={handleFileUpload} className="border rounded px-2 py-1" />
        <pre>{JSON.stringify(ejemploJSON, null, 2)}</pre>
      </div>

      {/* Mostrar la cantidad de preguntas del archivo JSON */}
      {cantidadPreguntas > 0 && (
        <p className="mb-4">El archivo JSON contiene {cantidadPreguntas} preguntas.</p>
      )}

      {/* Input para la cantidad de preguntas */}
      <div className="mb-4">
        <label htmlFor="numPreguntas" className="mr-2">Número de preguntas por examen:</label>
        <input
          type="number"
          id="numPreguntas"
          value={numPreguntas}
          onChange={(e) => setNumPreguntas(Math.min(Math.max(1, parseInt(e.target.value) || 1), preguntas.length))}
          className="border rounded px-2 py-1"
          min="3"
          max={preguntas.length}
        />
      </div>

      {/* Input para la cantidad de exámenes */}
      <div className="mb-4">
        <label htmlFor="numExamenes" className="mr-2">Número de exámenes a generar:</label>
        <input
          type="number"
          id="numExamenes"
          value={numExamenes}
          onChange={(e) => setNumExamenes(Math.max(1, parseInt(e.target.value) || 1))}
          className="border rounded px-2 py-1"
          min="1"
        />
      </div>
      <button
        onClick={generarExamenes}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
      >
        Generar Exámenes
      </button>

      {examenes.length > 0 && (
        <button
          onClick={generarDocumentoWord}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Descargar Todos los Exámenes
        </button>
      )}

      <div className="mt-4">
        {examenes.map((examen, indexExamen) => (
          <div key={indexExamen} className="mb-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Examen {indexExamen + 1}</h2>
            {examen.map((pregunta, indexPregunta) => (
              <div key={indexPregunta} className="mb-4 mt-2">
                <p className="font-medium">{indexPregunta + 1}. {pregunta.pregunta}</p>
                <ul className="list-disc pl-8">
                  {pregunta.opciones.map((opcion, indexOpcion) => (
                    <li key={indexOpcion}>{opcion}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneradorExamen;