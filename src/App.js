import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // State für aktive Seite und Animationen
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bees, setBees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showGame, setShowGame] = useState(false);
  
  // Referenzen für Animationen
  const animationRef = useRef(null);
  const beesRef = useRef([]);

  // Bienen initialisieren
  useEffect(() => {
    if (activePage === 'home') {
      // Bienen erstellen
      const initialBees = [];
      for (let i = 0; i < 8; i++) {
        initialBees.push({
          id: i,
          x: Math.random() * 80 + 10, // 10-90% (x-Position)
          y: Math.random() * 80 + 10, // 10-90% (y-Position)
          size: Math.random() * 20 + 40, // 40-60px (größer als vorher)
          speedX: (Math.random() - 0.5) * 0.8, // Zufällige Richtung und Geschwindigkeit
          speedY: (Math.random() - 0.5) * 0.8,
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
          newSpeedX += (Math.random() - 0.5) * 0.2;
          newSpeedY += (Math.random() - 0.5) * 0.2;
          
          // Maximale Geschwindigkeit begrenzen
          newSpeedX = Math.max(-1.2, Math.min(1.2, newSpeedX));
          newSpeedY = Math.max(-1.2, Math.min(1.2, newSpeedY));
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

  return (
    <div style={{
      fontFamily: "'Montserrat', sans-serif",
      color: '#3A3A3A',
      backgroundColor: '#FFF8E6',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Navigation */}
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
      }}>
        <a href="#" 
           onClick={(e) => {
             e.preventDefault();
             setActivePage('home');
           }}
           style={{
             display: 'flex',
             alignItems: 'center',
             fontWeight: 700,
             fontSize: '1.5rem',
             color: '#3A3A3A',
             textDecoration: 'none',
           }}>
          Haas, Heil & Müller
        </a>
        <div style={{
          display: 'flex',
          gap: '30px'
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
             onClick={(e) => {
               e.preventDefault();
               setActivePage('home');
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
             onClick={(e) => {
               e.preventDefault();
               setActivePage('products');
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
             onClick={(e) => {
               e.preventDefault();
               setActivePage('about');
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
             onClick={(e) => {
               e.preventDefault();
               setActivePage('contact');
             }}>
            Kontakt
          </a>
        </div>
      </nav>

      {/* Dynamischer Inhalt */}
      {activePage === 'home' && (
        <section style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          paddingTop: '80px',
        }}>
          {/* Video-Hintergrund */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: -1,
          }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src="/background.mp4" type="video/mp4" />
              Dein Browser unterstützt keine Videos.
            </video>
            {/* Overlay für bessere Lesbarkeit */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 248, 230, 0.6)',
            }}></div>
          </div>
          
          <div style={{
            maxWidth: '800px',
            zIndex: 10, // Erhöht von 1 auf 10, damit die Buttons klickbar sind
            padding: '0 20px',
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '20px',
              color: '#3A3A3A',
            }}>Honig aus Leidenschaft</h1>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '40px',
              lineHeight: 1.6,
            }}>Die neue Generation Imker aus der Pfalz bringt dir echten, nachhaltigen Honig direkt vom Imker. Handgemacht und mit Liebe zur Natur.</p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {/* Vereinfachte Buttons mit direktem onClick */}
              <button 
                onClick={() => setActivePage('products')}
                style={{
                  display: 'inline-block',
                  padding: '16px 30px',
                  borderRadius: '50px',
                  fontWeight: 600,
                  backgroundColor: '#FFC145',
                  color: '#3A3A3A',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Unser Honig
              </button>
              <button 
                onClick={() => setActivePage('about')}
                style={{
                  display: 'inline-block',
                  padding: '16px 30px',
                  borderRadius: '50px',
                  fontWeight: 600,
                  backgroundColor: '#A3C9A8',
                  color: '#3A3A3A',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Über uns
              </button>
            </div>
          </div>
          {/* Bienen-Animation */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 5,
            pointerEvents: 'none' // Hinzugefügt, damit Klicks durch den Container durchgehen
          }}>
            {bees.map(bee => (
              <div
                key={bee.id}
                onClick={() => setShowGame(true)}
                style={{
                  position: 'absolute',
                  width: `${bee.size * 1.5}px`, // 1.5x größer als vorher
                  height: `${bee.size * 1.5}px`, // 1.5x größer als vorher
                  left: `${bee.x}%`,
                  top: `${bee.y}%`,
                  // Wähle das richtige Bild basierend auf der Flugrichtung
                  backgroundImage: bee.speedX >= 0 
                    ? `url('/biene-rechts.png')` // Original-Biene (nach rechts fliegend)
                    : `url('/biene-links.png')`, // Spiegelverkehrte Biene (nach links fliegend)
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  // Leichte Zitterbewegung statt Rotation hinzufügen
                  transform: `translateY(${Math.sin(Date.now() * 0.01 + bee.id) * 3}px)`,
                  opacity: 0.8,
                  cursor: 'pointer',
                  zIndex: 5,
                  pointerEvents: 'auto', // Bienen selbst bleiben anklickbar
                  transition: 'left 0.1s linear, top 0.1s linear'
                }}
              />
            ))}
          </div>
        </section>
      )}

      {activePage === 'products' && (
        <section style={{
          padding: '100px 5%',
          backgroundColor: 'white',
          minHeight: '100vh',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              marginBottom: '15px',
              color: '#3A3A3A',
            }}>Unser Honig</h2>
            <p style={{
              fontSize: '1.1rem',
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
            gap: '60px',
            marginTop: '50px',
          }}>
            <div style={{
              flex: 1,
              minWidth: '300px',
              maxWidth: '500px',
            }}>
              <img 
                src="https://via.placeholder.com/500x500?text=Honig"
                alt="Honiglas Mockup" 
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>
            
            <div style={{
              flex: 1,
              minWidth: '300px',
              maxWidth: '500px',
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '15px',
                color: '#3A3A3A',
              }}>Pfälzer Sommerhonig</h3>
              <p style={{
                marginBottom: '20px',
                lineHeight: 1.6,
              }}>
                Unser Sommerhonig ist ein wahres Geschmackserlebnis. Die Bienen sammeln den Nektar von verschiedenen Blüten in der Umgebung von Föckelberg, was diesem Honig seinen einzigartigen, aromatischen Geschmack verleiht.
              </p>
              <p style={{
                marginBottom: '20px',
                lineHeight: 1.6,
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
                <span>Herkunft: Föckelberg, Pfalz</span>
              </div>
              
              <div style={{
                marginTop: '30px',
                backgroundColor: '#FFECB3',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              }}>
                <h4 style={{
                  marginBottom: '20px',
                  fontSize: '1.3rem',
                }}>Jetzt vormerken lassen</h4>
                {formSubmitted ? (
                  <p>Danke {formData.name}! Wir haben dich für unseren Honig vorgemerkt und werden dich unter {formData.email} kontaktieren, sobald er verfügbar ist.</p>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{
                      marginBottom: '20px',
                    }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                      }}>Name</label>
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Dein Name" 
                        required 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #FFF8E6',
                          borderRadius: '8px',
                          fontSize: '1rem',
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
                      }}>E-Mail</label>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Deine E-Mail" 
                        required 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #FFF8E6',
                          borderRadius: '8px',
                          fontSize: '1rem',
                        }}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit" style={{
                      backgroundColor: '#69A297',
                      color: 'white',
                      border: 'none',
                      padding: '12px 25px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}>Vormerken</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activePage === 'about' && (
        <section style={{
          padding: '100px 5%',
          backgroundColor: '#FFF8E6',
          minHeight: '100vh',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '40px',
          }}>Über uns</h2>
          <p style={{
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>Wir sind die neue Generation Imker aus der Pfalz. Aus Leidenschaft für Bienen, Natur und gutes Essen.</p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
          }}>
            <button
              onClick={() => setActivePage('home')}
              style={{
                padding: '14px 25px',
                borderRadius: '50px',
                backgroundColor: '#FFC145',
                color: '#3A3A3A',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Zurück zur Startseite
            </button>
          </div>
        </section>
      )}

      {/* Kontaktseite */}
      {activePage === 'contact' && (
        <section style={{
          padding: '100px 5%',
          backgroundColor: '#FFF8E6',
          minHeight: '100vh',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              marginBottom: '15px',
              color: '#3A3A3A',
            }}>Kontakt</h2>
            <p style={{
              fontSize: '1.1rem',
              maxWidth: '700px',
              margin: '0 auto',
              color: '#3A3A3A',
              lineHeight: 1.6,
            }}>Hast du Fragen zu unserem Honig oder möchtest du eine Bestellung aufgeben? Kontaktiere uns gerne!</p>
          </div>
          
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
          }}>
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
                }}>Name</label>
                <input 
                  type="text" 
                  placeholder="Dein Name" 
                  required 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #FFF8E6',
                    borderRadius: '8px',
                    fontSize: '1rem',
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
                }}>E-Mail</label>
                <input 
                  type="email" 
                  placeholder="Deine E-Mail" 
                  required 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #FFF8E6',
                    borderRadius: '8px',
                    fontSize: '1rem',
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
                }}>Nachricht</label>
                <textarea 
                  placeholder="Deine Nachricht" 
                  rows="5" 
                  required 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #FFF8E6',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                  }}
                />
              </div>
              
              <button type="submit" style={{
                backgroundColor: '#69A297',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}>Nachricht senden</button>
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
            gap: '30px',
            marginBottom: '30px',
            flexWrap: 'wrap',
          }}>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'color 0.3s ease',
                 cursor: 'pointer',
               }} 
               onClick={(e) => {
                 e.preventDefault();
                 setActivePage('home');
               }}>Start</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'color 0.3s ease',
                 cursor: 'pointer',
               }} 
               onClick={(e) => {
                 e.preventDefault();
                 setActivePage('products');
               }}>Unser Honig</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'color 0.3s ease',
                 cursor: 'pointer',
               }} 
               onClick={(e) => {
                 e.preventDefault();
                 setActivePage('about');
               }}>Über uns</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'color 0.3s ease',
                 cursor: 'pointer',
               }}>Datenschutz</a>
            <a href="#" 
               style={{
                 color: '#3A3A3A',
                 textDecoration: 'none',
                 fontWeight: 500,
                 transition: 'color 0.3s ease',
                 cursor: 'pointer',
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
                 transition: 'color 0.3s ease',
               }}>info@hhm.de</a>
          </div>
          
          <p style={{
            fontSize: '0.9rem',
            color: '#3A3A3A',
            marginTop: '20px',
          }}>© 2025 Haas, Heil & Müller | Alle Rechte vorbehalten</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
