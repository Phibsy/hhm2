import React, { useState, useEffect, useRef } from 'react';
import FlappyBee from './components/FlappyBee';

const App = () => {
  // State für aktive Seite und Animationen
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bees, setBees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Referenzen für Animationen
  const animationRef = useRef(null);
  const beesRef = useRef([]);
  const videoRef = useRef(null);
  const sectionRefs = {
    home: useRef(null),
    products: useRef(null),
    about: useRef(null),
    contact: useRef(null),
  };

  // Event listener for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load animations
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activePage]);

  // Smooth scroll function
  const smoothScrollTo = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Page transitions
  const navigateToPage = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Video-Events-Handler
  const handleVideoLoad = () => {
    console.log("Video wurde geladen!");
    setVideoLoaded(true);
  };

  const handleVideoError = (e) => {
    console.error("Video-Fehler:", e);
  };

  // Bienen initialisieren
  useEffect(() => {
    if (activePage === 'home') {
      // Bienen erstellen mit reduzierter Geschwindigkeit
      const initialBees = [];
      for (let i = 0; i < 8; i++) {
        initialBees.push({
          id: i,
          x: Math.random() * 80 + 10, // 10-90% (x-Position)
          y: Math.random() * 80 + 10, // 10-90% (y-Position)
          size: Math.random() * 20 + 40, // 40-60px (größer als vorher)
          speedX: (Math.random() - 0.5) * 0.4, // Reduziert von 0.8 auf 0.4
          speedY: (Math.random() - 0.5) * 0.4, // Reduziert von 0.8 auf 0.4
        });
      }
      beesRef.current = initialBees;
      setBees(initialBees);
      
      // Animation starten
      startAnimation();
      
      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [activePage]);
  
  // Animation für Bienen
  const startAnimation = () => {
    const animate = () => {
      const updatedBees = beesRef.current.map(bee => {
        // Biene bewegen
        let newX = bee.x + bee.speedX;
        let newY = bee.y + bee.speedY;
        let newSpeedX = bee.speedX;
        let newSpeedY = bee.speedY;
        
        // Zufällige kleine Richtungsänderungen für natürlicheres Flugverhalten
        if (Math.random() < 0.03) { // 3% Chance pro Frame
          newSpeedX += (Math.random() - 0.5) * 0.1; // Reduziert von 0.2 auf 0.1
          newSpeedY += (Math.random() - 0.5) * 0.1; // Reduziert von 0.2 auf 0.1
          
          // Maximale Geschwindigkeit begrenzen (reduziert)
          newSpeedX = Math.max(-0.6, Math.min(0.6, newSpeedX)); // Reduziert von 1.2 auf 0.6
          newSpeedY = Math.max(-0.6, Math.min(0.6, newSpeedY)); // Reduziert von 1.2 auf 0.6
        }
        
        // Grenzen prüfen
        if (newX <= 0 || newX >= 100) {
          newSpeedX = -newSpeedX; // Richtungswechsel
          newX = Math.max(0, Math.min(100, newX));
        }
        
        if (newY <= 0 || newY >= 100) {
          newSpeedY = -newSpeedY; // Richtungswechsel
          newY = Math.max(0, Math.min(100, newY));
        }
        
        return {
          ...bee,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
        };
      });
      
      beesRef.current = updatedBees;
      setBees([...updatedBees]);
      
      // Nächster Frame
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Form-Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    console.log('Formular abgesendet:', formData);
  };

  // Handler for closing the game
  const handleCloseGame = () => {
    setShowGame(false);
  };

  // Custom styles for animations
  const getButtonStyle = (hovering = false) => ({
    display: 'inline-block',
    padding: isMobile ? '14px 25px' : '16px 30px',
    borderRadius: '50px',
    fontWeight: 600,
    backgroundColor: hovering ? '#e6aa35' : '#FFC145',
    color: '#3A3A3A',
    border: 'none',
    cursor: 'pointer',
    boxShadow: hovering ? '0 6px 15px rgba(0, 0, 0, 0.15)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    transform: hovering ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
    fontSize: isMobile ? '0.9rem' : '1rem',
    fontFamily: "'Montserrat', sans-serif",
  });

  const getImageStyle = (hovering = false) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.4s ease',
    transform: hovering ? 'scale(1.05)' : 'scale(1)',
  });

  const getCardStyle = (hovering = false) => ({
    transition: 'all 0.3s ease',
    transform: hovering ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: hovering ? '0 20px 35px rgba(0, 0, 0, 0.15)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
  });

  const getFadeInStyle = (isVisible = true, delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.6s ease ${delay}s`,
  });

  const getSlideInStyle = (isVisible = true, delay = 0, direction = 'left') => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateX(0)' 
      : direction === 'left' 
        ? 'translateX(-30px)' 
        : 'translateX(30px)',
    transition: `all 0.6s ease ${delay}s`,
  });

  return (
    <div style={{
      fontFamily: "'Montserrat', sans-serif",
      color: '#3A3A3A',
      backgroundColor: '#FFF8E6',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Responsive Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 248, 230, 0.95)',
        padding: '16px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        flexWrap: 'wrap',
        transition: 'all 0.3s ease',
      }}>
        <a href="#" 
           onClick={(e) => {
             e.preventDefault();
             navigateToPage('home');
           }}
           style={{
             display: 'flex',
             alignItems: 'center',
             fontWeight: 700,
             fontSize: isMobile ? '1.2rem' : '1.5rem',
             color: '#3A3A3A',
             textDecoration: 'none',
             transition: 'color 0.3s ease',
           }}>
          Haas, Heil & Müller
        </a>
        
        {/* Hamburger Menu für mobile Geräte */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: isMobile ? 'block' : 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#3A3A3A',
            transition: 'transform 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div style={{
          display: isMobile ? (mobileMenuOpen ? 'flex' : 'none') : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '10px' : '30px',
          position: isMobile ? 'absolute' : 'static',
          top: isMobile ? '100%' : 'auto',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : 'auto',
          backgroundColor: isMobile ? '#FFF8E6' : 'transparent',
          padding: isMobile ? '20px' : '0',
          boxShadow: isMobile ? '0 2px 15px rgba(0, 0, 0, 0.1)' : 'none',
          width: isMobile ? '100%' : 'auto',
          opacity: isMobile ? (mobileMenuOpen ? 1 : 0) : 1,
          transform: isMobile ? (mobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)') : 'translateY(0)',
          transition: 'all 0.3s ease',
        }}>
          <a href="#"
             style={{
               textDecoration: 'none',
               color: activePage === 'home' ? '#69A297' : '#3A3A3A',
               fontWeight: 500,
               position: 'relative',
               transition: 'all 0.3s ease',
               cursor: 'pointer',
             }} 
             onMouseEnter={(e) => e.target.style.color = '#69A297'}
             onMouseLeave={(e) => e.target.style.color = activePage === 'home' ? '#69A297' : '#3A3A3A'}
             onClick={(e) => {
               e.preventDefault();
               navigateToPage('home');
             }}>
            Start
          </a>
          <a href="#"
             style={{
               textDecoration: 'none',
               color: activePage === 'products' ? '#69A297' : '#3A3A3A',
               fontWeight: 500,
               position: 'relative',
               transition: 'all 0.3s ease',
               cursor: 'pointer',
             }} 
             onMouseEnter={(e) => e.target.style.color = '#69A297'}
             onMouseLeave={(e) => e.target.style.color = activePage === 'products' ? '#69A297' : '#3A3A3A'}
             onClick={(e) => {
               e.preventDefault();
               navigateToPage('products');
             }}>
            Unser Honig
          </a>
          <a href="#"
             style={{
               textDecoration: 'none',
               color: activePage === 'about' ? '#69A297' : '#3A3A3A',
               fontWeight: 500,
               position: 'relative',
               transition: 'all 0.3s ease',
               cursor: 'pointer',
             }} 
             onMouseEnter={(e) => e.target.style.color = '#69A297'}
             onMouseLeave={(e) => e.target.style.color = activePage === 'about' ? '#69A297' : '#3A3A3A'}
             onClick={(e) => {
               e.preventDefault();
               navigateToPage('about');
             }}>
            Über uns
          </a>
          <a href="#"
             style={{
               textDecoration: 'none',
               color: activePage === 'contact' ? '#69A297' : '#3A3A3A',
               fontWeight: 500,
               position: 'relative',
               transition: 'all 0.3s ease',
               cursor: 'pointer',
             }} 
             onMouseEnter={(e) => e.target.style.color = '#69A297'}
             onMouseLeave={(e) => e.target.style.color = activePage === 'contact' ? '#69A297' : '#3A3A3A'}
             onClick={(e) => {
               e.preventDefault();
               navigateToPage('contact');
             }}>
            Kontakt
          </a>
        </div>
      </nav>

      {/* Dynamischer Inhalt */}
      {activePage === 'home' && (
        <section 
          ref={sectionRefs.home}
          style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            paddingTop: '80px',
            ...getFadeInStyle(!isLoading),
          }}
        >
          {/* Video-Hintergrund - Sichtbarkeit verbessert */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0,
            backgroundColor: 'transparent',
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              style={{
                width: '100%',
                height: '120%',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                top: '-10%',
                left: 0,
                opacity: 1,
              }}
            >
              <source src="background.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay leicht transparent machen, damit das Video besser sichtbar ist */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 248, 230, 0.3)',
            }}></div>
          </div>
          
          <div style={{
            maxWidth: '800px',
            zIndex: 10, 
            padding: '0 20px',
            ...getFadeInStyle(!isLoading, 0.2),
          }}>
            <h1 style={{
              fontSize: isMobile ? '2.5rem' : '3.5rem',
              marginBottom: '20px',
              color: '#3A3A3A',
              ...getSlideInStyle(!isLoading, 0.3),
            }}>Honig aus Leidenschaft</h1>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.2rem',
              marginBottom: '40px',
              lineHeight: 1.6,
              ...getSlideInStyle(!isLoading, 0.4),
            }}>Die neue Generation Imker aus der Pfalz bringt dir echten, nachhaltigen Honig direkt vom Imker. Handgemacht und mit Liebe zur Natur.</p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              ...getSlideInStyle(!isLoading, 0.5),
            }}>
              <button
                onMouseOver={(e) => {
                  Object.assign(e.target.style, getButtonStyle(true));
                }}
                onMouseOut={(e) => {
                  Object.assign(e.target.style, getButtonStyle(false));
                }}
                onClick={() => navigateToPage('products')}
                style={getButtonStyle(false)}
              >
                Unser Honig
              </button>
              <button
                onMouseOver={(e) => {
                  Object.assign(e.target.style, getButtonStyle(true));
                }}
                onMouseOut={(e) => {
                  Object.assign(e.target.style, getButtonStyle(false));
                }}
                onClick={() => navigateToPage('about')}
                style={getButtonStyle(false)}
              >
                Über uns
              </button>
            </div>
          </div>

          {/* Bienen-Animation - DEUTLICH LANGSAMER */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 5,
            pointerEvents: 'none',
            transform: `translateY(${scrollY * 0.1}px)`,
            transition: 'transform 0.1s ease-out',
          }}>
            {bees.map(bee => (
              <div
                key={bee.id}
                onClick={() => setShowGame(true)}
                style={{
                  position: 'absolute',
                  width: `${bee.size * 1.5}px`, 
                  height: `${bee.size * 1.5}px`, 
                  left: `${bee.x}%`,
                  top: `${bee.y}%`,
                  backgroundImage: bee.speedX >= 0 
                    ? `url('/biene-rechts.png')` 
                    : `url('/biene-links.png')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  transform: `
                    translateY(${Math.sin(Date.now() * 0.005 + bee.id) * 3}px)
                    scale(${1 + Math.sin(Date.now() * 0.003 + bee.id) * 0.05})
                  `,
                  opacity: 0.8,
                  cursor: 'pointer',
                  zIndex: 5,
                  pointerEvents: 'auto',
                  transition: 'all 0.16s linear',
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Flappy Bee Game - only shown when showGame is true */}
      {showGame && <FlappyBee onClose={handleCloseGame} />}

      {activePage === 'products' && (
        <section 
          ref={sectionRefs.products}
          style={{
            padding: isMobile ? '80px 5%' : '100px 5%',
            backgroundColor: '#FFF8E6',
            minHeight: '100vh',
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
            ...getFadeInStyle(!isLoading),
          }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              marginBottom: '15px',
              color: '#3A3A3A',
            }}>Unser Honig</h2>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              maxWidth: '700px',
              margin: '0 auto',
              color: '#3A3A3A',
              lineHeight: 1.6,
            }}>Hochwertiger Honig aus dem Herzen der Pfalz. Jedes Glas erzählt die Geschichte unserer Bienen und unsere Liebe zur Imkerei.</p>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: isMobile ? '30px' : '60px',
            marginTop: '50px',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <div style={{
              flex: 1,
              minWidth: '300px',
              maxWidth: isMobile ? '100%' : '500px',
              ...getSlideInStyle(!isLoading, 0.2, 'left'),
            }}>
              <div
                onMouseOver={(e) => {
                  e.currentTarget.firstChild.style.transform = 'scale(1.05) rotate(-2deg)';
                  e.currentTarget.style.transform = 'translateY(-10px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.firstChild.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                style={{
                  overflow: 'hidden',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <img 
                  src="/honigglas.jpg"
                  alt="Honiglas Mockup" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
            </div>
            
            <div style={{
              flex: 1,
              minWidth: '300px',
              maxWidth: isMobile ? '100%' : '500px',
              ...getSlideInStyle(!isLoading, 0.3, 'right'),
            }}>
              <h3 style={{
                fontSize: isMobile ? '1.5rem' : '1.8rem',
                marginBottom: '15px',
                color: '#3A3A3A',
              }}>Pfälzer Sommerhonig</h3>
              <p style={{
                marginBottom: '20px',
                lineHeight: 1.6,
                fontSize: isMobile ? '0.95rem' : '1rem',
              }}>
                Unser Sommerhonig ist ein wahres Geschmackserlebnis. Die Bienen sammeln den Nektar von verschiedenen Blüten in der Umgebung von Föckelberg, was diesem Honig seinen einzigartigen, aromatischen Geschmack verleiht.
              </p>
              <p style={{
                marginBottom: '20px',
                lineHeight: 1.6,
                fontSize: isMobile ? '0.95rem' : '1rem',
              }}>
                Jedes Glas wird von uns mit größter Sorgfalt abgefüllt und repräsentiert die Vielfalt der Pfälzer Natur.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px',
                gap: '10px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#69A297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="#69A297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Herkunft: Föckelberg, Pfalz</span>
              </div>
              
              <div style={{
                marginTop: '30px',
                backgroundColor: '#FFECB3',
                padding: isMobile ? '20px' : '30px',
                borderRadius: '20px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                ...getFadeInStyle(!isLoading, 0.5),
              }}>
                <h4 style={{
                  marginBottom: '20px',
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                }}>Jetzt vormerken lassen</h4>
                {formSubmitted ? (
                  <p style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Danke {formData.name}! Wir haben dich für unseren Honig vorgemerkt und werden dich unter {formData.email} kontaktieren, sobald er verfügbar ist.</p>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{
                      marginBottom: '20px',
                    }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: isMobile ? '0.9rem' : '1rem',
                      }}>Name</label>
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Dein Name" 
                        required 
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '12px 15px',
                          border: '2px solid #FFF8E6',
                          borderRadius: '8px',
                          fontSize: isMobile ? '0.9rem' : '1rem',
                          boxSizing: 'border-box',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#69A297';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#FFF8E6';
                          e.target.style.transform = 'scale(1)';
                        }}
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{
                      marginBottom: '20px',
                    }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: isMobile ? '0.9rem' : '1rem',
                      }}>E-Mail</label>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Deine E-Mail" 
                        required 
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '12px 15px',
                          border: '2px solid #FFF8E6',
                          borderRadius: '8px',
                          fontSize: isMobile ? '0.9rem' : '1rem',
                          boxSizing: 'border-box',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#69A297';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#FFF8E6';
                          e.target.style.transform = 'scale(1)';
                        }}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button 
                      type="submit" 
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#5a8c82';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#69A297';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      style={{
                        backgroundColor: '#69A297',
                        color: 'white',
                        border: 'none',
                        padding: isMobile ? '10px 20px' : '12px 25px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Vormerken
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activePage === 'about' && (
        <section 
          ref={sectionRefs.about}
          style={{
            padding: isMobile ? '80px 5%' : '100px 5%',
            backgroundColor: '#FFF8E6',
            minHeight: '100vh',
          }}
        >
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#3A3A3A',
              ...getFadeInStyle(!isLoading),
            }}>Über uns</h2>

            {/* Unsere Geschichte */}
            <div style={{ 
              marginBottom: '50px',
              ...getFadeInStyle(!isLoading, 0.2),
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Unsere Geschichte</h3>
              <p style={{ lineHeight: 1.6, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                Was als gemeinsames Hobby während unserer Studienzeit begann, ist heute unsere Leidenschaft geworden. Wir - Philipp, Thorben und Jonathan - sind drei Freunde, die durch die Liebe zur Natur und die Faszination für Bienen zusammengefunden haben. Aus einem kleinen Bienenstock im Schrebergarten von Thorben's Opa ist mittlerweile die Imkerei Haas, Heil & Müller gewachsen.
              </p>
            </div>

            {/* Das Team - MIT FOTOS */}
            <div style={{ 
              marginBottom: '50px',
              ...getFadeInStyle(!isLoading, 0.3),
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '1.8rem', 
                marginBottom: '40px',
                color: '#69A297',
              }}>Das Team</h3>

              {/* Jonathan - mit Foto */}
              <div style={{ 
                marginBottom: '50px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : '40px',
                alignItems: isMobile ? 'center' : 'flex-start',
                ...getSlideInStyle(!isLoading, 0.1, 'left'),
              }}>
                <div 
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                  style={{
                    flexShrink: 0,
                    width: isMobile ? '200px' : '250px',
                    height: isMobile ? '200px' : '250px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img 
                    src="/team/jonathan.jpg"
                    alt="Jonathan Heil" 
                    style={getImageStyle(false)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: isMobile ? '1.1rem' : '1.3rem', 
                    marginBottom: '10px',
                    color: '#3A3A3A',
                  }}>Jonathan Heil</h4>
                  <p style={{ lineHeight: 1.6, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                    Jonathan ist unser Bienenverstehender. Mit einem Hintergrund in Biologie hat er ein unglaubliches Gespür für die Bedürfnisse unserer Völker. Er kann stundenlang am Bienenstock sitzen und das Verhalten der kleinen Honigproduzenten beobachten. "Die Bienen sind wie ein Superorganismus", sagt er oft, "jede einzelne spielt ihre Rolle perfekt, ohne je einen Führerschein für das Leben bekommen zu haben." Wenn Jonathan nicht gerade bei den Bienen ist, experimentiert er mit neuen, bienenfreundlichen Pflanzungen rund um unsere Standorte.
                  </p>
                </div>
              </div>
              
              {/* Thorben - mit Foto */}
              <div style={{ 
                marginBottom: '50px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row-reverse',
                gap: isMobile ? '20px' : '40px',
                alignItems: isMobile ? 'center' : 'flex-start',
                ...getSlideInStyle(!isLoading, 0.2, 'right'),
              }}>
                <div 
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                  style={{
                    flexShrink: 0,
                    width: isMobile ? '200px' : '250px',
                    height: isMobile ? '200px' : '250px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img 
                    src="/team/thorben.jpg"
                    alt="Thorben Heil" 
                    style={getImageStyle(false)}
                  />
                </div>
                <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                  <h4 style={{ 
                    fontSize: isMobile ? '1.1rem' : '1.3rem', 
                    marginBottom: '10px',
                    color: '#3A3A3A',
                  }}>Thorben Heil</h4>
                  <p style={{ lineHeight: 1.6, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                    Thorben ist der Handwerker in unserem Team. Von der Konstruktion optimaler Bienenstöcke bis hin zur Verfeinerung unserer Honigschleuder – er sorgt dafür, dass unsere Ausrüstung perfekt funktioniert. Mit seinem Hintergrund als Zimmermann achtet er besonders auf nachhaltige Materialien und regionale Holzquellen. "Qualität beginnt beim Zuhause der Bienen", ist sein Motto. Thorben kennt zudem jeden Winkel der Pfälzer Landschaft und hat ein untrügliches Gespür für die besten Standorte unserer Bienenvölker.
                  </p>
                </div>
              </div>
              
              {/* Philipp - mit Foto */}
              <div style={{ 
                marginBottom: '30px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : '40px',
                alignItems: isMobile ? 'center' : 'flex-start',
                ...getSlideInStyle(!isLoading, 0.3, 'left'),
              }}>
                <div 
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                  style={{
                    flexShrink: 0,
                    width: isMobile ? '200px' : '250px',
                    height: isMobile ? '200px' : '250px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img 
                    src="/team/philipp.jpg"
                    alt="Philipp Haas" 
                    style={getImageStyle(false)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: isMobile ? '1.1rem' : '1.3rem', 
                    marginBottom: '10px',
                    color: '#3A3A3A',
                  }}>Philipp Haas</h4>
                  <p style={{ lineHeight: 1.6, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                    Philipp ist unser Genießer und Vermarkter. Mit seiner Leidenschaft für gutes Essen und seinem feinen Geschmackssinn ist er der Qualitätsprüfer unserer Honige. "Jedes Glas erzählt eine Geschichte über die Landschaft, in der die Bienen geflogen sind", erklärt er gerne bei Verkostungen. Philipp kümmert sich auch um unsere Kommunikation und Vermarktung, denn er liebt es, die Begeisterung für unseren Honig mit anderen zu teilen. Wenn er nicht gerade neue Rezepte mit Honig ausprobiert, ist er auf lokalen Märkten anzutreffen, wo er mit Kunden ins Gespräch kommt.
                  </p>
                </div>
              </div>
            </div>

            {/* Unsere Philosophie */}
            <div style={{ 
              marginBottom: '50px',
              ...getFadeInStyle(!isLoading, 0.4),
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Unsere Philosophie</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '15px', fontSize: isMobile ? '0.95rem' : '1rem' }}>
                Was uns verbindet, ist die Überzeugung, dass Imkerei mehr bedeutet als nur Honig zu produzieren. Es geht um den Schutz der Bienen, die Bewahrung der Artenvielfalt und die Förderung eines nachhaltigen Umgangs mit der Natur.
              </p>
              <p style={{ lineHeight: 1.6, marginBottom: '15px', fontSize: isMobile ? '0.95rem' : '1rem' }}>
                Unsere Bienenvölker stehen an ausgewählten Standorten in der Pfalz, wo sie Zugang zu einer vielfältigen und unbelasteten Pflanzenwelt haben. Wir verzichten bewusst auf chemische Behandlungsmittel und setzen stattdessen auf biologische Methoden und präventive Maßnahmen.
              </p>
              <p style={{ lineHeight: 1.6, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                Jeder von uns bringt unterschiedliche Fähigkeiten und Perspektiven mit, aber gemeinsam bilden wir – ähnlich wie ein Bienenvolk – ein perfekt eingespieltes Team. Wir ergänzen uns in unseren Stärken und lernen täglich voneinander.
              </p>
            </div>

            {/* Unsere Vision */}
            <div style={{ 
              marginBottom: '50px',
              ...getFadeInStyle(!isLoading, 0.5),
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Unsere Vision</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '15px', fontSize: isMobile ? '0.95rem' : '1rem' }}>
                Wir möchten nicht nur hervorragenden Honig produzieren, sondern auch das Bewusstsein für die Bedeutung der Bienen in unserem Ökosystem schärfen. Durch Workshops, Führungen und Schulbesuche teilen wir unser Wissen und unsere Begeisterung mit Menschen jeden Alters.
              </p>
              <p style={{ lineHeight: 1.6, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                Für die Zukunft träumen wir von einer Imkerei, die nicht nur regional bekannt ist für ihre Qualität, sondern auch als Vorbild dient für nachhaltiges Wirtschaften im Einklang mit der Natur.
              </p>
            </div>

            {/* Schlussbemerkung */}
            <div 
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ffe19a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FFECB3';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              style={{ 
                backgroundColor: '#FFECB3', 
                padding: isMobile ? '20px' : '25px', 
                borderRadius: '15px',
                marginBottom: '40px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                ...getFadeInStyle(!isLoading, 0.6),
              }}
            >
              <p style={{ 
                lineHeight: 1.6,
                fontWeight: 600,
                fontSize: isMobile ? '1rem' : '1.1rem',
              }}>
                Komm uns besuchen! Wir freuen uns immer über Interessierte, die mehr über Bienen, Honig und nachhaltige Imkerei erfahren möchten. Nach Absprache bieten wir auch Führungen an unseren Bienenständen an.
              </p>
            </div>

            {/* Button zurück zur Startseite */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '40px',
            }}>
              <button
                onMouseOver={(e) => {
                  Object.assign(e.target.style, getButtonStyle(true));
                }}
                onMouseOut={(e) => {
                  Object.assign(e.target.style, getButtonStyle(false));
                }}
                onClick={() => navigateToPage('home')}
                style={getButtonStyle(false)}
              >
                Zurück zur Startseite
              </button>
            </div>
          </div>
        </section>
      )}

      {activePage === 'contact' && (
        <section 
          ref={sectionRefs.contact}
          style={{
            padding: isMobile ? '80px 5%' : '100px 5%',
            backgroundColor: '#FFF8E6',
            minHeight: '100vh',
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
            ...getFadeInStyle(!isLoading),
          }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              marginBottom: '15px',
              color: '#3A3A3A',
            }}>Kontakt</h2>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              maxWidth: '700px',
              margin: '0 auto',
              color: '#3A3A3A',
              lineHeight: 1.6,
            }}>Hast du Fragen zu unserem Honig oder möchtest du eine Bestellung aufgeben? Kontaktiere uns gerne!</p>
          </div>
          
          <div 
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: 'white',
              padding: isMobile ? '30px' : '40px',
              borderRadius: '20px',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              ...getFadeInStyle(!isLoading, 0.2),
            }}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Nachricht wurde gesendet!');
            }}>
              <div style={{
                marginBottom: '20px',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}>Name</label>
                <input 
                  type="text" 
                  placeholder="Dein Name" 
                  required 
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 12px' : '12px 15px',
                    border: '2px solid #FFF8E6',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#69A297';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FFF8E6';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{
                marginBottom: '20px',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}>E-Mail</label>
                <input 
                  type="email" 
                  placeholder="Deine E-Mail" 
                  required 
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 12px' : '12px 15px',
                    border: '2px solid #FFF8E6',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#69A297';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FFF8E6';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{
                marginBottom: '20px',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}>Nachricht</label>
                <textarea 
                  placeholder="Deine Nachricht" 
                  rows="5" 
                  required 
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 12px' : '12px 15px',
                    border: '2px solid #FFF8E6',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#69A297';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FFF8E6';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#5a8c82';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#69A297';
                  e.target.style.transform = 'translateY(0)';
                }}
                style={{
                  backgroundColor: '#69A297',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '10px 20px' : '12px 25px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                Nachricht senden
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFC145',
        padding: '50px 5% 30px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '15px' : '30px',
            marginBottom: '30px',
            flexWrap: 'wrap',
          }}>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'all 0.3s ease',
                 cursor: 'pointer',
                 fontSize: isMobile ? '0.9rem' : '1rem',
               }} 
               onMouseOver={(e) => {
                 e.target.style.color = '#69A297';
                 e.target.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.color = '#3A3A3A';
                 e.target.style.transform = 'translateY(0)';
               }}
               onClick={(e) => {
                 e.preventDefault();
                 navigateToPage('home');
               }}>Start</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'all 0.3s ease',
                 cursor: 'pointer',
                 fontSize: isMobile ? '0.9rem' : '1rem',
               }} 
               onMouseOver={(e) => {
                 e.target.style.color = '#69A297';
                 e.target.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.color = '#3A3A3A';
                 e.target.style.transform = 'translateY(0)';
               }}
               onClick={(e) => {
                 e.preventDefault();
                 navigateToPage('products');
               }}>Unser Honig</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'all 0.3s ease',
                 cursor: 'pointer',
                 fontSize: isMobile ? '0.9rem' : '1rem',
               }} 
               onMouseOver={(e) => {
                 e.target.style.color = '#69A297';
                 e.target.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.color = '#3A3A3A';
                 e.target.style.transform = 'translateY(0)';
               }}
               onClick={(e) => {
                 e.preventDefault();
                 navigateToPage('about');
               }}>Über uns</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'all 0.3s ease',
                 cursor: 'pointer',
                 fontSize: isMobile ? '0.9rem' : '1rem',
               }}
               onMouseOver={(e) => {
                 e.target.style.color = '#69A297';
                 e.target.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.color = '#3A3A3A';
                 e.target.style.transform = 'translateY(0)';
               }}>Datenschutz</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'all 0.3s ease',
                 cursor: 'pointer',
                 fontSize: isMobile ? '0.9rem' : '1rem',
               }}
               onMouseOver={(e) => {
                 e.target.style.color = '#69A297';
                 e.target.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.color = '#3A3A3A';
                 e.target.style.transform = 'translateY(0)';
               }}>Impressum</a>
          </div>
          
          <div style={{
            marginBottom: '30px',
          }}>
            <a href="mailto:info@hhm.de" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 600,
                 transition: 'all 0.3s ease',
                 fontSize: isMobile ? '0.9rem' : '1rem',
               }}
               onMouseOver={(e) => {
                 e.target.style.color = '#69A297';
                 e.target.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.color = '#3A3A3A';
                 e.target.style.transform = 'translateY(0)';
               }}>info@hhm.de</a>
          </div>
          
          <p style={{
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: '#3A3A3A',
            marginTop: '20px',
          }}>© 2025 Haas, Heil & Müller | Alle Rechte vorbehalten</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
