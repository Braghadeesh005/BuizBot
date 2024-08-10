import React, { useState } from 'react';
import axios from 'axios';

const CreateBot = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [embedding, setEmbedding] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle PDF file upload
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the form data to send to the backend
      const formData = new FormData();
      formData.append('business_name', businessName);
      formData.append('business_type', businessType);
      formData.append('pdf_file', pdfFile);

      // Post the form data to the backend
      const response = await axios.post('http://localhost:4000/bot-creation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Display the embedding script from the response
      setEmbedding(response.data.script);
      setIsLoading(false);
      alert('Bot created successfully');
    } catch (error) {
      console.error('Error creating bot:', error);
      // Set a temporary embedding if the server is unreachable
      setEmbedding('<script>/* Temporary Embedding Script */</script>');
      setIsLoading(false);
    }
  };

  // Function to copy the embedding to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(embedding);
    
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create a New Chatbot</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Business Name:</label>
          <input 
            type="text" 
            value={businessName} 
            onChange={(e) => setBusinessName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Business Type:</label>
          <input 
            type="text" 
            value={businessType} 
            onChange={(e) => setBusinessType(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Business Data (PDF):</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            required 
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Chatbot'}
        </button>
      </form>

      {embedding && (
        <div>
          <h2>Embedding Script:</h2>
          <textarea 
            value={embedding} 
            readOnly 
            style={{ width: '100%', height: '100px' }} 
          />
          <button onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateBot;
