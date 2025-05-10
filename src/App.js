import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // State für aktive Seite und Animationen
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bees, setBees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Referenzen für Animationen
  const animationRef = useRef(null);
  const beesRef = useRef([]);
  const videoRef = useRef(null);

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
          {/* Video-Hintergrund - Sichtbarkeit verbessert */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0, // Erhöht von -1 auf 0, damit das Video über dem Hintergrund liegt
            backgroundColor: 'transparent', // War vorher #FFF8E6
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
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 1, // Volle Sichtbarkeit sicherstellen
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
              backgroundColor: 'rgba(255, 248, 230, 0.3)', // Von 0.5 auf 0.3 reduziert für bessere Sichtbarkeit
            }}></div>
          </div>
          
          <div style={{
            maxWidth: '800px',
            zIndex: 10, 
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
            pointerEvents: 'none' 
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
                  transform: `translateY(${Math.sin(Date.now() * 0.01 + bee.id) * 3}px)`,
                  opacity: 0.8,
                  cursor: 'pointer',
                  zIndex: 5,
                  pointerEvents: 'auto',
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
                src="/honigglas.jpg"
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
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#3A3A3A',
            }}>Über uns</h2>

            {/* Unsere Geschichte */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{ 
                fontSize: '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Unsere Geschichte</h3>
              <p style={{ lineHeight: 1.6 }}>
                Was als gemeinsames Hobby während unserer Studienzeit begann, ist heute unsere Leidenschaft geworden. Wir - Philipp, Thorben und Jonathan - sind drei Freunde, die durch die Liebe zur Natur und die Faszination für Bienen zusammengefunden haben. Aus einem kleinen Bienenstock im Schrebergarten von Thorben's Opa ist mittlerweile die Imkerei Haas, Heil & Müller gewachsen.
              </p>
            </div>

            {/* Das Team */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{ 
                fontSize: '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Das Team</h3>
              
              {/* Jonathan */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  marginBottom: '10px',
                  color: '#3A3A3A',
                }}>Jonathan Heil</h4>
                <p style={{ lineHeight: 1.6 }}>
                  Jonathan ist unser Bienenverstehender. Mit einem Hintergrund in Biologie hat er ein unglaubliches Gespür für die Bedürfnisse unserer Völker. Er kann stundenlang am Bienenstock sitzen und das Verhalten der kleinen Honigproduzenten beobachten. "Die Bienen sind wie ein Superorganismus", sagt er oft, "jede einzelne spielt ihre Rolle perfekt, ohne je einen Führerschein für das Leben bekommen zu haben." Wenn Jonathan nicht gerade bei den Bienen ist, experimentiert er mit neuen, bienenfreundlichen Pflanzungen rund um unsere Standorte.
                </p>
              </div>
              
              {/* Thorben */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  marginBottom: '10px',
                  color: '#3A3A3A',
                }}>Thorben Heil</h4>
                <p style={{ lineHeight: 1.6 }}>
                  Thorben ist der Handwerker in unserem Team. Von der Konstruktion optimaler Bienenstöcke bis hin zur Verfeinerung unserer Honigschleuder – er sorgt dafür, dass unsere Ausrüstung perfekt funktioniert. Mit seinem Hintergrund als Zimmermann achtet er besonders auf nachhaltige Materialien und regionale Holzquellen. "Qualität beginnt beim Zuhause der Bienen", ist sein Motto. Thorben kennt zudem jeden Winkel der Pfälzer Landschaft und hat ein untrügliches Gespür für die besten Standorte unserer Bienenvölker.
                </p>
              </div>
              
              {/* Philipp */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  marginBottom: '10px',
                  color: '#3A3A3A',
                }}>Philipp Haas</h4>
                <p style={{ lineHeight: 1.6 }}>
                  Philipp ist unser Genießer und Vermarkter. Mit seiner Leidenschaft für gutes Essen und seinem feinen Geschmackssinn ist er der Qualitätsprüfer unserer Honige. "Jedes Glas erzählt eine Geschichte über die Landschaft, in der die Bienen geflogen sind", erklärt er gerne bei Verkostungen. Philipp kümmert sich auch um unsere Kommunikation und Vermarktung, denn er liebt es, die Begeisterung für unseren Honig mit anderen zu teilen. Wenn er nicht gerade neue Rezepte mit Honig ausprobiert, ist er auf lokalen Märkten anzutreffen, wo er mit Kunden ins Gespräch kommt.
                </p>
              </div>
            </div>

            {/* Unsere Philosophie */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{ 
                fontSize: '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Unsere Philosophie</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '15px' }}>
                Was uns verbindet, ist die Überzeugung, dass Imkerei mehr bedeutet als nur Honig zu produzieren. Es geht um den Schutz der Bienen, die Bewahrung der Artenvielfalt und die Förderung eines nachhaltigen Umgangs mit der Natur.
              </p>
              <p style={{ lineHeight: 1.6, marginBottom: '15px' }}>
                Unsere Bienenvölker stehen an ausgewählten Standorten in der Pfalz, wo sie Zugang zu einer vielfältigen und unbelasteten Pflanzenwelt haben. Wir verzichten bewusst auf chemische Behandlungsmittel und setzen stattdessen auf biologische Methoden und präventive Maßnahmen.
              </p>
              <p style={{ lineHeight: 1.6 }}>
                Jeder von uns bringt unterschiedliche Fähigkeiten und Perspektiven mit, aber gemeinsam bilden wir – ähnlich wie ein Bienenvolk – ein perfekt eingespieltes Team. Wir ergänzen uns in unseren Stärken und lernen täglich voneinander.
              </p>
            </div>

            {/* Unsere Vision */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{ 
                fontSize: '1.8rem', 
                marginBottom: '20px',
                color: '#69A297',
              }}>Unsere Vision</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '15px' }}>
                Wir möchten nicht nur hervorragenden Honig produzieren, sondern auch das Bewusstsein für die Bedeutung der Bienen in unserem Ökosystem schärfen. Durch Workshops, Führungen und Schulbesuche teilen wir unser Wissen und unsere Begeisterung mit Menschen jeden Alters.
              </p>
              <p style={{ lineHeight: 1.6 }}>
                Für die Zukunft träumen wir von einer Imkerei, die nicht nur regional bekannt ist für ihre Qualität, sondern auch als Vorbild dient für nachhaltiges Wirtschaften im Einklang mit der Natur.
              </p>
            </div>

            {/* Schlussbemerkung */}
            <div style={{ 
              backgroundColor: '#FFECB3', 
              padding: '25px', 
              borderRadius: '15px',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              <p style={{ 
                lineHeight: 1.6,
                fontWeight: 600,
                fontSize: '1.1rem',
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
          </div>
        </section>
      )}

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
