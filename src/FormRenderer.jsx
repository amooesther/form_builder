import React, { useRef, useEffect, useState } from 'react';
import { Formio } from 'formiojs';
import 'formiojs/dist/formio.form.css'; // Import form CSS

export default function FormRenderer() {
    const formRef = useRef(null);
    const formInstance = useRef(null);
    const [schemaInput, setSchemaInput] = useState('');
    const [renderError, setRenderError] = useState(null);

    const renderForm = (schema) => {
        if (formInstance.current) {
            formInstance.current.destroy(true); // Destroy previous instance if it exists
        }
        if (formRef.current && schema) {
            try {
                Formio.createForm(formRef.current, schema).then((form) => {
                    formInstance.current = form;
                    setRenderError(null); // Clear any previous errors
                }).catch(error => {
                    console.error("Error rendering form:", error);
                    setRenderError("Error rendering form. Please check the schema JSON.");
                });
            } catch (error) {
                console.error("Formio.createForm error:", error);
                setRenderError("Invalid JSON schema provided.");
            }
        }
    };

    useEffect(() => {
        // Cleanup function to destroy the form when the component unmounts
        return () => {
            if (formInstance.current) {
                formInstance.current.destroy(true);
            }
        };
    }, []);

    const handleSchemaInputChange = (event) => {
        setSchemaInput(event.target.value);
        setRenderError(null); // Clear error on input change
    };

    const handleRenderClick = () => {
        try {
            const parsedSchema = JSON.parse(schemaInput);
            renderForm(parsedSchema);
        } catch (error) {
            setRenderError("Invalid JSON. Please provide a valid JSON schema.");
            console.error("JSON parsing error:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Render Form from Schema</h1>

            <div className="mb-4">
                <label htmlFor="schema-textarea" className="block text-gray-700 text-sm font-bold mb-2">
                    Paste Formio JSON Schema:
                </label>
                <textarea
                    id="schema-textarea"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="10"
                    value={schemaInput}
                    onChange={handleSchemaInputChange}
                    placeholder='Paste your Formio JSON schema here, e.g., {"components": [{"type": "textfield", "key": "firstName", "label": "First Name"}]}'
                ></textarea>
            </div>

            <button
                onClick={handleRenderClick}
                className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Render Form
            </button>

            {renderError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{renderError}</p>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Rendered Form:</h2>
                <div ref={formRef} className="formio-rendered-form border p-4 rounded bg-white shadow-md">
                    {/* The form will be rendered here */}
                </div>
            </div>
        </div>
    );
}