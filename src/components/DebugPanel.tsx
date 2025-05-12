import React, { useState } from 'react';

interface DebugPanelProps {
  messages: any[];
}

const DebugPanel: React.FC<DebugPanelProps> = ({ messages }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="debug-panel">
      <div className="debug-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        Debug Panel {isExpanded ? '▼' : '▲'} ({messages.length} messages)
      </div>
      
      {isExpanded && (
        <div className="debug-content">
          {messages.map((message, index) => (
            <div key={index} className="debug-message">
              <div className="debug-message-header">
                Message {index + 1} - Type: {message.type || 'unknown'}
              </div>
              <pre className="debug-message-content">
                {JSON.stringify(message, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;