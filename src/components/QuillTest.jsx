import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const QuillTest = () => {
  const [value, setValue] = useState('<p>Teste do React Quill</p>')

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Teste React Quill</h1>
      <div style={{ marginBottom: '1rem' }}>
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={setValue}
          style={{ height: '200px', marginBottom: '42px' }}
        />
      </div>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Conteúdo HTML:</h3>
        <pre>{value}</pre>
      </div>
    </div>
  )
}

export default QuillTest
