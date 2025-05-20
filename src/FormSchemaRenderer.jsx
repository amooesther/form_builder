// src/RenderExistingForm.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Formio } from 'formiojs';
import 'formiojs/dist/formio.form.css'; // Import form CSS
import 'formiojs/dist/formio.builder.css'; // For the builder styles if any conflicts occur (usually not needed for just rendering)

export default function RenderExistingForm() {
    const formRef = useRef(null);
    const formInstance = useRef(null);
    const [jsonInput, setJsonInput] = useState(''); // Will hold the full JSON object string
    const [renderedFormMeta, setRenderedFormMeta] = useState(null); // To store name and description
    const [renderError, setRenderError] = useState(null);
    const [loading, setLoading] = useState(false);

    const renderForm = (fullFormObject) => {
        setLoading(true);
        setRenderError(null); // Clear previous errors
        setRenderedFormMeta(null); // Clear previous meta

        if (formInstance.current) {
            formInstance.current.destroy(true); // Destroy previous instance if it exists
        }

        if (formRef.current && fullFormObject && fullFormObject.schema) {
            try {
                Formio.createForm(formRef.current, fullFormObject.schema).then((form) => {
                    formInstance.current = form;
                    setRenderedFormMeta({
                        name: fullFormObject.name || 'Untitled Form',
                        description: fullFormObject.description || 'No description provided.'
                    });
                    setLoading(false);
                }).catch(error => {
                    console.error("Error rendering form:", error);
                    setRenderError("Error rendering form. Please check the 'schema' property within your JSON.");
                    setLoading(false);
                });
            } catch (error) {
                console.error("Formio.createForm error:", error);
                setRenderError("Invalid Formio schema structure provided.");
                setLoading(false);
            }
        } else {
            setRenderError("JSON must contain a 'schema' property.");
            setLoading(false);
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

    const handleJsonInputChange = (event) => {
        setJsonInput(event.target.value);
        setRenderError(null); // Clear error on input change
        setRenderedFormMeta(null); // Clear meta on input change
    };

    const handleRenderClick = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            if (typeof parsedJson !== 'object' || parsedJson === null) {
                throw new Error("Parsed content is not a valid JSON object.");
            }
            renderForm(parsedJson);
        } catch (error) {
            setRenderError(`Invalid JSON: ${error.message}. Please provide a valid JSON object with 'name', 'description', and 'schema' properties.`);
            console.error("JSON parsing error:", error);
        }
    };

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Render an Existing Form from JSON</h1>

            <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border border-gray-200">
                <label htmlFor="json-textarea" className="block text-gray-700 text-lg font-bold mb-3">
                    Paste Complete Form JSON Object:
                </label>
                <textarea
                    id="json-textarea"
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
                    rows="15"
                    value={jsonInput}
                    onChange={handleJsonInputChange}
                    placeholder={`Paste your complete form JSON here, e.g.,
{
  "name": "My Sample Form",
  "description": "A form to collect user data.",
  "schema": {
    "display": "form",
    "components": [
      {
        "label": "Name",
        "key": "name",
        "type": "textfield",
        "input": true
      },
      {
        "label": "Email",
        "key": "email",
        "type": "email",
        "input": true
      },
      {
        "label": "Submit",
        "showValidations": false,
        "tableView": false,
        "key": "submit",
        "type": "button",
        "input": true,
        "disableOnInvalid": true
      }
    ]
  }
}`}
                ></textarea>
                <button
                    onClick={handleRenderClick}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    disabled={loading}
                >
                    {loading ? 'Rendering...' : 'Render Form'}
                </button>
            </div>

            {renderError && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-md">
                    <p className="font-bold">Error:</p>
                    <p>{renderError}</p>
                </div>
            )}

            {loading && (
                <div className="mt-4 p-4 text-center text-blue-700">
                    <p>Loading form...</p>
                </div>
            )}

            {renderedFormMeta && (
                <div className="bg-orange-100 rounded-xl p-4 shadow-md inline-block mb-6">
                    <h2 className="text-xl font-bold text-orange-800">{renderedFormMeta.name}</h2>
                    {renderedFormMeta.description && (
                        <p className="text-gray-600">{renderedFormMeta.description}</p>
                    )}
                </div>
            )}

            <div className="mt-4 bg-white rounded-xl shadow-xl p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Rendered Form:</h2>
                <div ref={formRef} className="formio-rendered-form border p-4 rounded-lg bg-gray-50 shadow-inner min-h-[200px]">
                    {/* The form will be rendered here */}
                    {!jsonInput && !renderError && !renderedFormMeta && (
                        <p className="text-gray-500 italic">Paste a complete form JSON object above and click "Render Form" to see it here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}