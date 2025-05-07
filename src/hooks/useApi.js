import { useState, useEffect, useCallback } from 'react';
import api from '../api';

// Hook für Produktliste
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getProducts();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Laden der Produkte');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

// Hook für einzelnes Produkt
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      setProduct(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Laden des Produkts');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
};

// Hook für Bestellung/Vormerkung
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await api.createOrder(orderData);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Erstellen der Bestellung');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, success };
};

// Hook für Kontaktformular
export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = async (contactData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await api.sendContactMessage(contactData);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Senden der Nachricht');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error, success };
};

// Hook für Authentifizierung
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Beim ersten Laden prüfen, ob ein Benutzer angemeldet ist
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          setLoading(true);
          const response = await api.getCurrentUser();
          setUser(response.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          // Token ungültig oder abgelaufen
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.login(credentials);
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      
      // Benutzerinformationen abrufen
      const userResponse = await api.getCurrentUser();
      setUser(userResponse.data.data);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler bei der Anmeldung');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      await api.logout();
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, isAuthenticated, loading, error, login, logout };
};
