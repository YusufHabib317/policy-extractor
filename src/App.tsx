import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Copy, Download, FileText, Loader2, Search, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import {
  GlobalStyle,
  Container,
  Header,
  Title,
  Subtitle,
  Button,
  PreviewContainer,
  PreviewHeader,
  PreviewContent,
  ErrorMessage,
  StatusMessage,
  Badge,
  AIResultContainer,
  AIResultSection,
  Score,
  ButtonGroup,
  MarkdownContent
} from './component/styles';

type DocumentType = 'privacy' | 'terms' | null;

interface AIAnalysis {
  summary?: string;
  keyPoints?: string[];
  implications?: string[];
  concerns?: string[];
  score?: number;
}

export default function App() {
  const [extractedText, setExtractedText] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const cleanText = (text: string) => {
    return text.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
  };

  const detectDocumentType = (text: string): DocumentType => {
    const lowerText = text.toLowerCase();
    const privacyKeywords = ['privacy policy', 'privacy notice', 'privacy statement', 'personal data', 'data protection'];
    const termsKeywords = ['terms of service', 'terms and conditions', 'terms of use', 'user agreement', 'service agreement'];

    if (privacyKeywords.some(keyword => lowerText.includes(keyword))) return 'privacy';
    if (termsKeywords.some(keyword => lowerText.includes(keyword))) return 'terms';
    return null;
  };

  const extractTextFromPage = (): string => {
    const elementsToRemove = ['script', 'style', 'noscript', 'iframe', 'img', 'video', 'audio', 'button', 'input', 'select', 'textarea'];
    const bodyClone = document.body.cloneNode(true) as HTMLElement;

    elementsToRemove.forEach(tag => {
      const elements = bodyClone.getElementsByTagName(tag);
      while (elements.length > 0) elements[0].parentNode?.removeChild(elements[0]);
    });

    return bodyClone.innerText;
  };

  const handleDownload = () => {
    const fileName = documentType === 'privacy' ? 'privacy_policy.txt' : 'terms_of_service.txt';
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!analysis) return;
    
    const content = `Analysis Summary:
${analysis.summary}

Key Points:
${analysis.keyPoints?.map(point => `• ${point}`).join('\n')}

User Implications:
${analysis.implications?.map(imp => `• ${imp}`).join('\n')}

Potential Concerns:
${analysis.concerns?.map(concern => `• ${concern}`).join('\n')}

User-Friendliness Score: ${analysis.score}/10`;

    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleAnalysisTextDownload = () => {
    if (!analysis) return;
    
    const content = `Analysis Summary:
${analysis.summary}

Key Points:
${analysis.keyPoints?.map(point => `• ${point}`).join('\n')}

User Implications:
${analysis.implications?.map(imp => `• ${imp}`).join('\n')}

Potential Concerns:
${analysis.concerns?.map(concern => `• ${concern}`).join('\n')}

User-Friendliness Score: ${analysis.score}/10`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const processWithAI = async () => {
    try {
      setIsAnalyzing(true);
      setError('');

      const response = await axios.post('https://privacy-summary-gpt.vercel.app/api/gpt', {
        text: extractedText,
        type: documentType
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setAnalysis(response.data);
      setStatus('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          setError('Cannot connect to analysis server. Please ensure it is running.');
        } else if (error.response) {
          setError(`Analysis failed: ${error.response.data?.error || error.response.statusText}`);
        } else if (error.request) {
          setError('No response from analysis server. Please try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Error analyzing document');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onExtract = async () => {
    try {
      setIsLoading(true);
      setError('');
      setStatus('');
      setExtractedText('');
      setDocumentType(null);
      setAnalysis(null);

      if (!chrome?.tabs || !chrome?.scripting) {
        throw new Error('Chrome extension APIs not available');
      }

      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const currentTab = tabs[0];
      if (!currentTab?.id) {
        throw new Error('No active tab found');
      }

      const currentUrl = currentTab.url || '';
      if (currentUrl.startsWith('chrome://') || currentUrl.startsWith('edge://') || currentUrl.startsWith('chrome-extension://')) {
        throw new Error('Cannot extract text from browser pages');
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: extractTextFromPage,
      });

      const extractedText = results[0]?.result || '';
      const cleanedText = cleanText(extractedText);
      const detectedType = detectDocumentType(cleanedText);

      if (!detectedType) {
        setError('No privacy policy or terms of service detected on this page');
        return;
      }

      setDocumentType(detectedType);
      setExtractedText(cleanedText);
      setStatus(`${detectedType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} detected!`);
    } catch (error) {
      console.error('Extension error:', error);
      setError(error instanceof Error ? error.message : 'Error executing extension code');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPreviewText = (text: string) => {
    const words = text.split(' ');
    const previewLength = 100;
    const preview = words.slice(0, previewLength).join(' ');
    return words.length > previewLength ? `${preview}...` : preview;
  };

 return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Policy Extractor & Analyzer</Title>
          <Subtitle>Extract and analyze Privacy Policy & Terms of Service</Subtitle>
        </Header>

        <Button onClick={onExtract} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Extracting...
            </>
          ) : (
            <>
              <Search size={16} />
              Detect & Extract
            </>
          )}
        </Button>

        {error && (
          <ErrorMessage>
            <AlertCircle size={16} />
            {error}
          </ErrorMessage>
        )}

        {status && !error && <StatusMessage>{status}</StatusMessage>}

        {extractedText && !error && (
          <PreviewContainer>
            <PreviewHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} />
                Preview
                <Badge $type={documentType || 'privacy'}>
                  {documentType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </Badge>
              </div>
              <ButtonGroup>
                <Button $variant="secondary" onClick={handleDownload} style={{ padding: '0.25rem 0.5rem' }}>
                  <Download size={14} />
                  Download as Text file
                </Button>
                <Button onClick={processWithAI} disabled={isAnalyzing} style={{ padding: '0.25rem 0.5rem' }}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Analyze with AI
                    </>
                  )}
                </Button>
                {
                analysis && 
                 <Button
                $variant="secondary"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ padding: '0.25rem' }}
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Button>
              }
              </ButtonGroup>
            </PreviewHeader>
            <PreviewContent>{formatPreviewText(extractedText)}</PreviewContent>
          </PreviewContainer>
        )}

        {analysis && (
          <AIResultContainer style={{ display: isExpanded ? 'block' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Analysis Results</h2>
            </div>
            <div>
              <AIResultSection>
                <h3>Summary</h3>
                <MarkdownContent>
                  <ReactMarkdown>{analysis.summary || ''}</ReactMarkdown>
                </MarkdownContent>
              </AIResultSection>

              {analysis.keyPoints && analysis.keyPoints.length > 0 && (
                <AIResultSection>
                  <h3>Key Points</h3>
                  <ul>
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index}>
                        <MarkdownContent>
                          <ReactMarkdown>{point}</ReactMarkdown>
                        </MarkdownContent>
                      </li>
                    ))}
                  </ul>
                </AIResultSection>
              )}

              {analysis.implications && analysis.implications.length > 0 && (
                <AIResultSection>
                  <h3>User Implications</h3>
                  <ul>
                    {analysis.implications.map((imp, index) => (
                      <li key={index}>
                        <MarkdownContent>
                          <ReactMarkdown>{imp}</ReactMarkdown>
                        </MarkdownContent>
                      </li>
                    ))}
                  </ul>
                </AIResultSection>
              )}

              {analysis.concerns && analysis.concerns.length > 0 && (
                <AIResultSection>
                  <h3>Potential Concerns</h3>
                  <ul>
                    {analysis.concerns.map((concern, index) => (
                      <li key={index}>
                        <MarkdownContent>
                          <ReactMarkdown>{concern}</ReactMarkdown>
                        </MarkdownContent>
                      </li>
                    ))}
                  </ul>
                </AIResultSection>
              )}

              {analysis.score !== undefined && (
                <AIResultSection>
                  <h3>User-Friendliness Score</h3>
                  <Score>{analysis.score}/10</Score>
                </AIResultSection>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: '1rem' }}>
              <Button $variant="secondary" onClick={copyToClipboard}>
                <Copy size={14} />
                {copySuccess || 'Copy Analysis'}
              </Button>
              <Button $variant="secondary" onClick={handleAnalysisTextDownload}>
                <Download size={14} />
                Download as Text
              </Button>
            </div>
          </AIResultContainer>
        )}
      </Container>
    </>
  )}