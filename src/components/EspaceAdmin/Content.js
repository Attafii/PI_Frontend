import React from 'react';

function Content({ content }) {
  return (
    <div className="content">
      {content}
      <style>
        {`
          .content {
            padding: 20px;
            background-color: #f4f4f4;
            transition: padding 0.3s ease;
          }

          @media (max-width: 768px) {
            .content {
              padding: 15px;
            }
          }

          @media (max-width: 480px) {
            .content {
              padding: 10px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Content;
