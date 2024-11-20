import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: #000;
    margin: 0;
    padding: 0;
    over-flow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Container = styled.div`
  min-width: 550px;
  padding: 2rem;
  background: linear-gradient(135deg, #1e1b4b 0%, #172554 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled.p`
  color: #a5b4fc;
  font-size: 0.875rem;
  margin: 0.5rem 0 0;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; $isError?: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: ${props => {
    if (props.$isError) return '#ef4444';
    if (props.$variant === 'secondary') return 'rgba(255, 255, 255, 0.1)';
    return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
  }};
  color: ${props => props.$variant === 'secondary' ? '#e0e7ff' : 'white'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  backdrop-filter: blur(8px);

  &:hover {
    background: ${props => {
      if (props.$isError) return '#dc2626';
      if (props.$variant === 'secondary') return 'rgba(255, 255, 255, 0.15)';
      return 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)';
    }};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #e0e7ff;
  font-weight: 500;
`;

const PreviewContent = styled.div`
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #c7d2fe;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #fca5a5;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
`;

const StatusMessage = styled.div`
  text-align: center;
  color: #a5b4fc;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Badge = styled.span<{ $type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => 
    props.$type === 'privacy' 
      ? 'rgba(99, 102, 241, 0.2)' 
      : 'rgba(217, 70, 239, 0.2)'
  };
  color: ${props => 
    props.$type === 'privacy' 
      ? '#818cf8' 
      : '#e879f9'
  };
  border: 1px solid ${props => 
    props.$type === 'privacy' 
      ? 'rgba(99, 102, 241, 0.3)' 
      : 'rgba(217, 70, 239, 0.3)'
  };
  backdrop-filter: blur(4px);
`;

const AIResultContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
`;

const AIResultSection = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    color: #a5b4fc;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #c7d2fe;
  }
`;

const Score = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
  color: #818cf8;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MarkdownContent = styled.div`
  color: #c7d2fe;
  font-size: 0.875rem;
  line-height: 1.6;
  
  h1, h2, h3 {
    color: #a5b4fc;
    margin-top: 1.5rem;
  }
  
  code {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }
  
  blockquote {
    border-left: 3px solid #4f46e5;
    margin: 0;
    padding-left: 1rem;
    color: #93c5fd;
  }
`;

export {
   Badge,
   Button,
   Container,
   ErrorMessage,
   GlobalStyle,
   Header,
   PreviewContainer,
   PreviewContent,
   PreviewHeader,
   StatusMessage,
   Subtitle,
   Title,
   createGlobalStyle,
   AIResultContainer,
   AIResultSection,
   ButtonGroup,
   Score,
   MarkdownContent
}