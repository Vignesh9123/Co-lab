'use client'
import React from 'react'
import Editor from '@monaco-editor/react';

function Code() {
  return (
    <div>
      Code<Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme='vs-dark'
      // onMount={handleEditorDidMount}
    />
    </div>
  )
}

export default Code
