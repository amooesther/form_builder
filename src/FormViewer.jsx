import React, { useEffect, useRef } from 'react';
import { Formio } from 'formiojs';
import { useNavigate } from 'react-router-dom';
import 'formiojs/dist/formio.form.min.css';

export default function FormViewer({ formSchema, formMeta }) {
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (formSchema && formRef.current) {
      Formio.createForm(formRef.current, formSchema)
        .then((form) => {
          form.on('submit', (submission) => {
            console.log('Form submitted:', submission);
            alert('Form submitted successfully!');
          });
        });
    }
  }, [formSchema]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-red-300 rounded-lg shadow hover:bg-gray-100 transition-colors flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Builder
        </button>
        
        <div className="bg-red-100 rounded-2xl shadow-xl p-8 border border-purple-200/50">
          {formMeta && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-purple-900">{formMeta.name}</h1>
              {formMeta.description && (
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{formMeta.description}</p>
              )}
            </div>
          )}
          
          <div ref={formRef} className="formio-form-container" />
        </div>
      </div>
    </div>
  );
}