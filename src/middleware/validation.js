// Middleware para validar datos de registro de usuario
const validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Validar nombre
  if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Debe proporcionar un email válido');
  }

  // Validar contraseña
  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos de registro inválidos',
      details: errors
    });
  }

  next();
};

// Middleware para validar datos de login
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('El email es requerido');
  }

  if (!password) {
    errors.push('La contraseña es requerida');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos de login inválidos',
      details: errors
    });
  }

  next();
};

// Middleware para validar datos de post
const validatePost = (req, res, next) => {
  const { title, description, category, location, item_condition, price } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }

  if (!description || description.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }

  if (!category) {
    errors.push('La categoría es requerida');
  }

  if (!location) {
    errors.push('La ubicación es requerida');
  }

  if (!item_condition) {
    errors.push('La condición del artículo es requerida');
  }

  if (!price || isNaN(price) || price < 0) {
    errors.push('El precio debe ser un número válido mayor o igual a 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos del post inválidos',
      details: errors
    });
  }

  next();
};

// Middleware para validar mensaje de interés
const validateInterested = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || message.trim().length < 5) {
    return res.status(400).json({
      error: 'Mensaje inválido',
      message: 'El mensaje debe tener al menos 5 caracteres'
    });
  }

  next();
};

// Middleware para validar parámetros numéricos
const validateNumericParam = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName];
    
    if (!value || isNaN(value) || parseInt(value) <= 0) {
      return res.status(400).json({
        error: 'Parámetro inválido',
        message: `El parámetro ${paramName} debe ser un número válido mayor a 0`
      });
    }

    req.params[paramName] = parseInt(value);
    next();
  };
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePost,
  validateInterested,
  validateNumericParam
};

