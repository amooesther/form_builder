import React, { useEffect, useRef } from 'react';
import { Formio } from 'formiojs';
import 'formiojs/dist/formio.builder.css'; // Corrected CSS import
import 'formiojs/dist/formio.form.css';    // Corrected CSS import
import './formio-custom.css';         // Corrected CSS import

export default function FormBuilder({ onFormUpdate }) {
  const builderRef = useRef(null);
  const builderInstance = useRef(null);

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
                content: true, // Add the content component here
              },
            },
          },
        }
      ).then((builder) => {
        builderInstance.current = builder;

        builder.on('change', (schema) => {
          onFormUpdate(schema);
        });

        onFormUpdate(builder.schema);
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

  return (
    <div className="bg-blue-600 rounded-xl shadow-xl overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100">
        <h2 className="text-xl font-semibold text-gray-800">
          Form Builder Canvas
        </h2>
        <p className="text-sm text-gray-600">
          Drag and drop components to build your form
        </p>
      </div>
      <div
        ref={builderRef}
        className="formio-builder-wrapper"
      />
    </div>
  );
}

