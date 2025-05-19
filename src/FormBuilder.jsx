import React, { useEffect, useRef, useState } from 'react';
import { Formio } from 'formiojs';
import 'formiojs/dist/formio.builder.css';
import 'formiojs/dist/formio.form.css';
import './formio-custom.css';

export default function FormBuilder({ onFormUpdate }) {
  const builderRef = useRef(null);
  const builderInstance = useRef(null);
  const [lastSavedSchema, setLastSavedSchema] = useState(null);
  const [showLastSaved, setShowLastSaved] = useState(false);

  useEffect(() => {
    try {
      Formio.builder(
        builderRef.current,
        {
          display: 'form',
          components: [],
        },
        {
          builder: {
            basic: {
              title: 'Basic Components',
              default: true,
              weight: 0,
              components: {
                textfield: true,
                textarea: true,
                number: true,
                password: true,
                checkbox: true,
                selectboxes: true,
                select: true,
                radio: true,
                button: true,
              },
            },
            advanced: {
              title: 'Advanced',
              weight: 10,
              components: {
                email: true,
                phoneNumber: true,
                address: true,
                datetime: true,
                day: true,
                time: true,
                currency: true,
                signature: true,
              },
            },
            layout: {
              title: 'Layout',
              weight: 20,
              components: {
                columns: true,
                panel: true,
                fieldset: true,
                table: true,
                tabs: true,
                well: true,
                content: true,
              },
            },
          },
        }
      ).then((builder) => {
        builderInstance.current = builder;
        setLastSavedSchema(builder.schema);

        const saveInterval = setInterval(() => {
          if (JSON.stringify(builder.schema) !== JSON.stringify(lastSavedSchema)) {
            console.log('Autosaving form schema...', builder.schema);
            setLastSavedSchema(builder.schema);
            // In a real application, persist the schema here
          }
        }, 5000);

        builder.on('change', onFormUpdate);
        onFormUpdate(builder.schema);
        return () => clearInterval(saveInterval);
      });
    } catch (error) {
      console.error("Formio.builder initialization error:", error);
    }

    return () => {
      if (builderInstance.current) {
        builderInstance.current.destroy(true);
      }
    };
  }, [onFormUpdate]);

  const handleGetLastSaved = () => {
    setShowLastSaved(!showLastSaved); // Toggle the visibility of the last saved schema
  };

  return (
    <div className="bg-blue-600 rounded-xl shadow-xl overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Form Builder Canvas
          </h2>
          <p className="text-sm text-gray-600">
            Drag and drop components to build your form (Autosaving every 5 seconds)
          </p>
        </div>
        <button
          onClick={handleGetLastSaved}
          className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {showLastSaved ? 'Hide Last Saved' : 'Show Last Saved'}
        </button>
      </div>
      <div
        ref={builderRef}
        className="formio-builder-wrapper"
      />
      {showLastSaved && lastSavedSchema && (
        <div className="p-4 bg-gray-100 border-t border-gray-200 rounded-b-xl overflow-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Saved Schema:</h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(lastSavedSchema, null, 2)}
          </pre>
        </div>
      )}
      {showLastSaved && !lastSavedSchema && (
        <div className="p-4 bg-gray-100 border-t border-gray-200 rounded-b-xl">
          <p className="text-sm text-gray-600">No schema has been saved yet.</p>
        </div>
      )}
    </div>
  );
}