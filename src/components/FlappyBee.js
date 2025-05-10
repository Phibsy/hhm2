import React, { useState, useEffect, useRef, useCallback } from 'react';

const FlappyBee = ({ onClose }) => {
  const [beePosition, setBeePosition] = useState(250);
  const [pipes, setPipes] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [beeDirection, setBeeDirection] = useState('up');
  
  const gameRef = useRef();
  const animationRef = useRef();
  const lastTimeRef = useRef(0);
  
  // Responsive game constants
  const gameWidth = isPortrait ? 320 : 500;
  const gameHeight = isPortrait ? 500 : 400;
  const GRAVITY = 0.4;
  const JUMP_HEIGHT = -8;
  const PIPE_WIDTH = isPortrait ? 50 : 60;
  const PIPE_GAP = isPortrait ? 140 : 160;
  const PIPE_SPEED = isPortrait ? 2.5 : 3;
  const BEE_SIZE = isPortrait ? 35 : 45;
  const BEE_X = 100; // Fixed x position of bee
  
  // Handle orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flappyBeeHighScore');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  // Game state
  const beeVelocity = useRef(0);
  
  // Collision detection function
  const checkCollision = useCallback((currentBeePos, currentPipes) => {
    // Check ground collision
    if (currentBeePos > gameHeight - BEE_SIZE - 60) { // 60 is ground height
      return true;
    }
    
    // Check ceiling collision
    if (currentBeePos < 0) {
      return true;
    }
    
    // Check pipe collision
    for (let i = 0; i < currentPipes.length; i++) {
      const pipe = currentPipes[i];
      
      // Check if bee is within horizontal range of pipe
      if (
        BEE_X < pipe.x + PIPE_WIDTH &&
        BEE_X + BEE_SIZE > pipe.x
      ) {
        // Check if bee hits top pipe
        if (currentBeePos < pipe.topHeight) {
          return true;
        }
        
        // Check if bee hits bottom pipe
        if (currentBeePos + BEE_SIZE > gameHeight - pipe.bottomHeight) {
          return true;
        }
      }
    }
    
    return false;
  }, [gameHeight, BEE_SIZE, PIPE_WIDTH]);
  
  // Main game loop using requestAnimationFrame
  const gameLoop = useCallback((timestamp) => {
    if (!gameStarted || gameOver) {
      lastTimeRef.current = timestamp;
      return;
    }
    
    // Calculate delta time for consistent physics
    const deltaTime = timestamp - lastTimeRef.current;
    if (deltaTime < 16) { // Limit to 60fps
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    lastTimeRef.current = timestamp;
    
    // Update bee physics
    beeVelocity.current += GRAVITY;
    
    setBeePosition((prevPos) => {
      const newBeePos = prevPos + beeVelocity.current;
      
      // Set bee direction for animation
      if (beeVelocity.current < 0) {
        setBeeDirection('up');
      } else {
        setBeeDirection('down');
      }
      
      return newBeePos;
    });
    
    // Update pipes
    setPipes((prevPipes) => {
      const updatedPipes = prevPipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED,
      }));
      
      // Remove pipes that are off screen
      const activePipes = updatedPipes.filter((pipe) => pipe.x > -PIPE_WIDTH);
      
      // Add new pipe when needed
      if (activePipes.length === 0 || activePipes[activePipes.length - 1].x < gameWidth - 200) {
        const topHeight = Math.random() * (gameHeight * 0.4) + 50;
        const bottomHeight = gameHeight - topHeight - PIPE_GAP - 60; // 60 for ground height
        
        activePipes.push({
          x: gameWidth,
          topHeight: topHeight,
          bottomHeight: bottomHeight,
          passed: false,
          id: Date.now(),
        });
      }
      
      // Check score
      let scoreChanged = false;
      activePipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < BEE_X) {
          pipe.passed = true;
          setScore(prev => prev + 1);
          scoreChanged = true;
        }
      });
      
      return activePipes;
    });
    
    // Continue game loop
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, GRAVITY, PIPE_SPEED, PIPE_WIDTH, PIPE_GAP, gameWidth, gameHeight]);
  
  // Check collision after state updates
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const collision = checkCollision(beePosition, pipes);
      if (collision) {
        endGame();
      }
    }
  }, [beePosition, pipes, gameStarted, gameOver, checkCollision]);
  
  // Start game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameStarted, gameOver, gameLoop]);
  
  // End game
  const endGame = useCallback(() => {
    setGameOver(true);
    setGameStarted(false);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('flappyBeeHighScore', score);
    }
  }, [score, bestScore]);
  
  // Handle jump/start
  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setPipes([]);
      setBeePosition(gameHeight / 2);
      beeVelocity.current = 0;
    } else if (!gameOver) {
      beeVelocity.current = JUMP_HEIGHT;
    }
  }, [gameStarted, gameOver, gameHeight, JUMP_HEIGHT]);
  
  // Restart game
  const restart = useCallback(() => {
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setPipes([]);
    setBeePosition(gameHeight / 2);
    beeVelocity.current = 0;
  }, [gameHeight]);
  
  // Event listeners
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    
    const handleTouchStart = (e) => {
      if (e.target.closest('.game-area')) {
        e.preventDefault();
        jump();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [jump]);
  
  // Styles for game elements
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: `${gameWidth}px`,
      color: 'white',
      marginBottom: '20px',
    },
    title: {
      fontSize: isPortrait ? '1.5rem' : '2rem',
      margin: 0,
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: isPortrait ? '2rem' : '2.5rem',
      cursor: 'pointer',
      width: isPortrait ? '40px' : '50px',
      height: isPortrait ? '40px' : '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.3s ease, transform 0.2s ease',
    },
    gameArea: {
      width: `${gameWidth}px`,
      height: `${gameHeight}px`,
      background: 'linear-gradient(to bottom, #FFE082 0%, #FFD54F 30%, #87CEEB 30%, #98FB98 100%)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '15px',
      cursor: 'pointer',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
      userSelect: 'none',
      touchAction: 'manipulation',
    },
    sky: {
      position: 'absolute',
      width: '100%',
      height: '70%',
      top: 0,
      overflow: 'hidden',
    },
    cloud: {
      position: 'absolute',
      background: 'white',
      borderRadius: '100px',
      opacity: 0.9,
      filter: 'blur(1px)',
    },
    bee: {
      position: 'absolute',
      left: `${BEE_X}px`,
      top: `${beePosition}px`,
      width: `${BEE_SIZE}px`,
      height: `${BEE_SIZE}px`,
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
        <svg width="${BEE_SIZE}" height="${BEE_SIZE}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bodyGradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
            </radialGradient>
          </defs>
          <!-- Bee Body -->
          <ellipse cx="50" cy="50" rx="35" ry="25" fill="url(#bodyGradient)" stroke="#000" stroke-width="2"/>
          <!-- Black stripes -->
          <rect x="25" y="30" width="6" height="40" fill="#000" rx="3"/>
          <rect x="45" y="30" width="6" height="40" fill="#000" rx="3"/>
          <rect x="65" y="30" width="6" height="40" fill="#000" rx="3"/>
          <!-- Wings -->
          <ellipse cx="30" cy="30" rx="15" ry="25" fill="#fff" fill-opacity="0.8" stroke="#000" stroke-width="1" 
            transform="rotate(${beeDirection === 'up' ? '-20' : '10'} 30 30)"/>
          <ellipse cx="70" cy="30" rx="15" ry="25" fill="#fff" fill-opacity="0.8" stroke="#000" stroke-width="1" 
            transform="rotate(${beeDirection === 'up' ? '20' : '-10'} 70 30)"/>
          <!-- Face -->
          <circle cx="40" cy="40" r="3" fill="#000"/>
          <circle cx="60" cy="40" r="3" fill="#000"/>
          <path d="M40 55 Q50 60 60 55" stroke="#000" stroke-width="3" fill="none"/>
        </svg>
      `)}")`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      transition: 'transform 0.1s',
      transform: `rotate(${Math.min(Math.max(beeVelocity.current * 4, -30), 30)}deg)`,
      filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
    },
    pipe: {
      position: 'absolute',
      width: `${PIPE_WIDTH}px`,
      background: 'linear-gradient(to right, #2E7D32 0%, #4CAF50 50%, #2E7D32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid #1B5E20',
      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3), 2px 0 5px rgba(0, 0, 0, 0.3)',
      borderRadius: '5px',
    },
    flowerTop: {
      position: 'absolute',
      bottom: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '28px',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    },
    flowerBottom: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '28px',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    },
    ground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60px',
      background: 'linear-gradient(to bottom, #8BC34A 0%, #689F38 100%)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      borderTop: '3px solid #558B2F',
    },
    grass: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '200%',
      height: '100%',
      animation: 'moveGrass 2s linear infinite',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'flex-end',
    },
    scoreBoard: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      color: 'white',
      fontSize: isPortrait ? '16px' : '18px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
      fontFamily: "'Montserrat', sans-serif",
    },
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(135deg, #FFF8E6 0%, #FFFAED 100%)',
      padding: isPortrait ? '30px' : '40px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      maxWidth: '80%',
      border: '2px solid #FFD700',
    },
    modalTitle: {
      margin: '0 0 20px 0',
      color: '#3A3A3A',
      fontSize: isPortrait ? '1.5rem' : '2rem',
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    modalText: {
      margin: '10px 0',
      color: '#666',
      fontSize: isPortrait ? '1rem' : '1.1rem',
      fontFamily: "'Montserrat', sans-serif",
    },
    button: {
      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
      border: 'none',
      padding: isPortrait ? '12px 30px' : '14px 35px',
      marginTop: '20px',
      borderRadius: '30px',
      color: '#3A3A3A',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      fontSize: isPortrait ? '1rem' : '1.1rem',
      fontFamily: "'Montserrat', sans-serif",
    },
  };
  
  // Cloud data for animation
  const clouds = [
    { id: 1, x: 10, y: 15, size: 1.2, speed: 0.02 },
    { id: 2, x: 60, y: 25, size: 0.8, speed: 0.015 },
    { id: 3, x: 90, y: 10, size: 1, speed: 0.025 },
  ];
  
  return (
    <div style={styles.overlay}>
      <div style={styles.header}>
        <h2 style={styles.title}>🐝 Flappy Bee 🐝</h2>
        <button 
          onClick={onClose}
          style={styles.closeButton}
          onMouseOver={(e) => {
            e.target.style.color = '#FFC145';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'white';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      </div>
      
      <div 
        className="game-area"
        style={styles.gameArea}
        onClick={jump}
      >
        {/* Sky with clouds */}
        <div style={styles.sky}>
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              style={{
                ...styles.cloud,
                width: `${80 * cloud.size}px`,
                height: `${35 * cloud.size}px`,
                top: `${cloud.y}%`,
                left: `${(cloud.x + Date.now() * cloud.speed) % 100}%`,
                animation: `cloudFloat${cloud.id} ${20 + cloud.id * 5}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
        
        {/* Bee */}
        <div style={styles.bee} />
        
        {/* Pipes (Flowers) */}
        {pipes.map((pipe) => (
          <div key={pipe.id}>
            <div style={{
              ...styles.pipe,
              left: `${pipe.x}px`,
              top: 0,
              height: `${pipe.topHeight}px`,
            }}>
              <div style={styles.flowerTop}>🌺</div>
            </div>
            <div style={{
              ...styles.pipe,
              left: `${pipe.x}px`,
              bottom: 60, // Account for ground height
              height: `${pipe.bottomHeight}px`,
            }}>
              <div style={styles.flowerBottom}>🌻</div>
            </div>
          </div>
        ))}
        
        {/* Ground */}
        <div style={styles.ground}>
          <div style={styles.grass}>
            {[...Array(40)].map((_, i) => (
              <span key={i} style={{ marginRight: '2px' }}>🌱</span>
            ))}
          </div>
        </div>
        
        {/* Score */}
        <div style={styles.scoreBoard}>
          <div>Score: {score}</div>
          <div>Best: {bestScore}</div>
        </div>
        
        {/* Game overlays */}
        {!gameStarted && !gameOver && (
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>🍯 Willkommen bei Flappy Bee! 🍯</h3>
            <p style={styles.modalText}>
              {isPortrait ? 'Tippe zum Fliegen' : 'Klicke oder drücke SPACE'}
            </p>
            <p style={styles.modalText}>
              Hilf der Biene zwischen den Blumen hindurch zu fliegen!
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                jump();
              }}
              style={styles.button}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              Spielen
            </button>
          </div>
        )}
        
        {gameOver && (
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>🎮 Spiel beendet! 🎮</h3>
            <p style={styles.modalText}>Score: {score} 🍯</p>
            <p style={styles.modalText}>Bester Score: {bestScore} 🏆</p>
            {score > bestScore && (
              <p style={{ ...styles.modalText, color: '#FFD700', fontWeight: 'bold' }}>
                🎉 Neuer Highscore! 🎉
              </p>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                restart();
              }}
              style={styles.button}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              Nochmal spielen
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes cloudFloat1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cloudFloat2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes cloudFloat3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes moveGrass {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default FlappyBee;
