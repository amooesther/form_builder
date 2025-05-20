import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import FormBuilder from './FormBuilder';
import CreateFormPage from './CreateFormPage';
import FormViewer from './FormViewer';
import FormRenderer from './FormRenderer.jsx'; 

function AppContent() {
  const [formSchema, setFormSchema] = useState(null);
  const [formMeta, setFormMeta] = useState(null);
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreateForm = (formData) => {
    setFormMeta(formData);
    console.log('Form created:', formData);
    navigate('/builder');
  };

  const handleViewForm = () => {
    navigate('/view');
  };

  // New function to navigate to the render schema page
  const handleRenderSchema = () => {
    navigate('/render-schema');
  };

  const handleSubmit = async () => {
    if (!formSchema || !formMeta) {
      setResponse({ error: 'No form schema or metadata to submit' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formMeta,
        schema: formSchema,
        createdAt: new Date().toISOString()
      };

      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Server responded with error');

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToConsole = () => {
    if (!formSchema || !formMeta) {
      setResponse({ error: 'No form schema or metadata to save' });
      return;
    }

    const fullForm = {
      ...formMeta,
      schema: formSchema,
      createdAt: new Date().toISOString()
    };
    
    console.log('Form saved:', fullForm);
    setResponse({ success: 'Form saved to console!' });
  };

  return (
    <>
      {/* Navigation Bar - You can add this anywhere you want the buttons to appear */}
      <nav className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold hover:text-gray-300 transition-colors">
            Form App
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link to="/create" className="text-white hover:text-gray-300 transition-colors text-lg">
                Create Form
              </Link>
            </li>
            <li>
              <Link to="/builder" className="text-white hover:text-gray-300 transition-colors text-lg">
                Form Builder
              </Link>
            </li>
            {/* New link for rendering schema */}
            <li>
              <Link to="/render-schema" className="text-white hover:text-gray-300 transition-colors text-lg">
                Render Schema
              </Link>
            </li>
            {formSchema && ( // Only show View Created Form if a schema exists
              <li>
                <Link to="/view" className="text-white hover:text-gray-300 transition-colors text-lg">
                  View Created Form
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/create" element={<CreateFormPage onCreateForm={handleCreateForm} />} />
        <Route path="/builder" element={
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <header className="mb-8 text-center">
                <h1 className="text-5xl font-extrabold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-blue-600">
                    Drag & Drop Form Builder
                  </span>
                </h1>
                {formMeta && (
                  <div className="bg-red-400 rounded-xl p-4 shadow-md inline-block">
                    <h2 className="text-xl font-bold text-purple-800">{formMeta.name}</h2>
                    {formMeta.description && (
                      <p className="text-gray-600">{formMeta.description}</p>
                    )}
                  </div>
                )}
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <FormBuilder onFormUpdate={setFormSchema} />
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-200/50 bg-gradient-to-br from-white to-purple-50">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4">
                      Form Actions
                    </h2>
                    <div className="space-y-4">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formSchema || !formMeta}
                        className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${
                          isSubmitting || !formSchema || !formMeta
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <span className="drop-shadow-sm">Save to API</span>
                        )}
                      </button>
                      <button
                        onClick={handleSaveToConsole}
                        disabled={!formSchema || !formMeta}
                        className={`w-full px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${
                          !formSchema || !formMeta
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <span className="drop-shadow-sm">Save to Console</span>
                      </button>
                      <button
                        onClick={handleViewForm}
                        disabled={!formSchema}
                        className={`w-full px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${
                          !formSchema
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        View Created Form
                      </button>
                      {/* New button to navigate to Render Schema page */}
                      <button
                        onClick={handleRenderSchema}
                        className="w-full px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl"
                      >
                        Render Form from Schema
                      </button>
                      <Link
                        to="/create"
                        className="block w-full px-6 py-4 rounded-xl font-bold text-center transition-all transform hover:scale-[1.02] bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                      >
                        Create New Form
                      </Link>
                    </div>
                  </div>

                  {formSchema && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-200/50 bg-gradient-to-br from-white to-blue-50">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-indigo-900">
                          Live Form Schema
                        </h2>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              JSON.stringify(formSchema, null, 2)
                            );
                          }}
                          className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors"
                          title="Copy to clipboard"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                        </button>
                      </div>
                      <pre className="text-xs overflow-x-auto bg-indigo-50/50 p-4 rounded-lg text-indigo-900 max-h-96 overflow-y-auto border border-indigo-200">
                        {JSON.stringify(formSchema, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {response && (
                <div
                  className={`mt-8 p-6 rounded-2xl shadow-lg ${
                    response.error
                      ? 'bg-gradient-to-br from-red-100 to-pink-100 text-red-900 border border-red-200'
                      : 'bg-gradient-to-br from-green-100 to-teal-100 text-green-900 border border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        response.error ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {response.error ? '🚨 Error Response' : '✅ Success Response'}
                      </h3>
                      <pre className="mt-1 text-sm overflow-x-auto font-mono">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                    <button
                      onClick={() => setResponse(null)}
                      className={`p-1 rounded-full ${
                        response.error ? 'hover:bg-red-200/50' : 'hover:bg-green-200/50'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        } />
        <Route path="/view" element={<FormViewer formSchema={formSchema} formMeta={formMeta} />} />
        {/* New Route for FormRenderer */}
        <Route path="/render-schema" element={<FormRenderer />} /> 

        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl">
              <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
                Form Builder
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Create beautiful forms with our drag and drop builder. 
                Add fields, customize validation, and publish your forms with ease.
              </p>
              <Link
                to="/create"
                className="inline-block px-8 py-4 text-lg font-bold text-white bg-green-800 hover:to-blue-700 transition-all shadow-lg hover:shadow-xle"
              >
                Create New Form
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}