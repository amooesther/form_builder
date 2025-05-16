import React, { useEffect, useRef } from 'react';
import { Formio } from 'formiojs';
import 'formiojs/dist/formio.builder.min.css';
import 'formiojs/dist/formio.form.min.css';
import './formio-custom.css'; // Import the CSS file

export default function FormBuilder({ onFormUpdate }) {
  const builderRef = useRef(null);
  const builderInstance = useRef(null);

  useEffect(() => {
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

    return () => {
      if (builderInstance.current) {
        builderInstance.current.destroy(true);
      }
    };
  }, [onFormUpdate]);

  return (
    <div className="bg-red-50 rounded-xl shadow-xl overflow-hidden border border-gray-200">
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