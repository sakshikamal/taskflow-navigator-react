import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  sentences: string[];
  typingDelay?: number;
  deletingDelay?: number;
  pauseDelay?: number;
  className?: string;
}

export function TypewriterText({ 
  sentences, 
  typingDelay = 50, 
  deletingDelay = 30,
  pauseDelay = 1000,
  className = '' 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    const currentSentence = sentences[currentSentenceIndex];
    
    if (!isDeleting && currentIndex < currentSentence.length) {
      // Typing
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + currentSentence[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingDelay);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === currentSentence.length) {
      // Pause at the end of sentence
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDelay);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, deletingDelay);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex === 0) {
      // Move to next sentence
      setIsDeleting(false);
      setCurrentSentenceIndex(prev => (prev + 1) % sentences.length);
    }
  }, [currentIndex, isDeleting, currentSentenceIndex, sentences, typingDelay, deletingDelay, pauseDelay]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
} 