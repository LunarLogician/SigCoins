import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const navigate = useNavigate(); // Add this to enable navigation
  
  // Game state
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showCompletionOptions, setShowCompletionOptions] = useState(false);

  // Card images (using emoji as placeholders)
  const cardImages = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮'];

  // Initialize game
  const initializeGame = () => {
    // Reset all states
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setMoves(0);
    setGameCompleted(false);
    setTimer(0);
    setShowCompletionOptions(false);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Create and shuffle deck
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isSolved: false }));
    
    setCards(shuffledCards);
    setGameStarted(true);
    
    // Start timer
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Handle card click
  const handleCardClick = (id) => {
    // Return if card is disabled, already flipped, or already solved
    if (disabled || flipped.includes(id) || solved.includes(id)) return;
    
    // Flip card and increment moves
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves(prevMoves => prevMoves + 1);
    
    // Check if two cards are flipped
    if (newFlipped.length === 2) {
      setDisabled(true);
      
      const [firstCardId, secondCardId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      // Check if cards match
      if (firstCard.emoji === secondCard.emoji) {
        setSolved(prevSolved => [...prevSolved, firstCardId, secondCardId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        // If no match, flip cards back
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Handle going to stats page
  const goToStats = () => {
    // Here you can pass game data to the stats page
    // For example, through URL parameters or state
    window.location.href = '/start';
        
      
    
  };

  useEffect(() => {
    if (gameStarted) {
      // Start the 30-second timer
      const completionTimer = setTimeout(() => {
        alert('30 seconds have passed. The required time is completed!');
        setGameCompleted(true);
        setShowCompletionOptions(true);
        clearInterval(timerInterval);
      }, 2000); // Changed from 2000 to 30000 for 30 seconds
      
      // Optional game completion check
      if (solved && cards && solved.length === cards.length && cards.length > 0) {
        setGameCompleted(true);
        setShowCompletionOptions(true);
        clearInterval(timerInterval);
        clearTimeout(completionTimer);
      }
      
      // Cleanup when component unmounts or game is completed
      return () => {
        clearTimeout(completionTimer);
      };
    }
  }, [gameStarted, solved, cards, timerInterval]);

  // Format timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600">Memory Match Game</h1>
          <p className="mb-6 text-gray-700">Test your memory by matching pairs of cards!</p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-700"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-between items-center mb-4">
            <div className="text-xl font-semibold">Moves: {moves}</div>
            <div className="text-xl font-semibold">Time: {formatTime(timer)}</div>
          </div>
          
          {showCompletionOptions ? (
            <div className="text-center mt-8 mb-6">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Game Completed! 🎉</h2>
              <p className="text-lg mb-2">Your results:</p>
              <p className="text-xl font-bold mb-4">{moves} moves and {formatTime(timer)}</p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={initializeGame}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-700"
                >
                  Play Again
                </button>
                <button
                  onClick={goToStats}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-green-700"
                >
                  View Stats
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 w-full">
              {cards.map(card => (
                <div
                  key={card.id}
                  className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 transform ${
                    flipped.includes(card.id) || solved.includes(card.id)
                      ? 'bg-white rotate-y-180'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  } ${solved.includes(card.id) ? 'border-2 border-green-500' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {(flipped.includes(card.id) || solved.includes(card.id)) ? (
                    <span className="text-4xl">{card.emoji}</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          
          {!showCompletionOptions && (
            <button
              onClick={() => {
                setGameStarted(false);
                clearInterval(timerInterval);
              }}
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
            >
              Quit Game
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Game;