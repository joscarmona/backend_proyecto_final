import { createTables, testConnection } from './utils/database.js';

const initializeDatabase = async () => {
  console.log('Inicializando base de datos...');
  
  try {
   
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error(' No se pudo conectar a la base de datos');
      process.exit(1);
    }

    
    await createTables();
    
    console.log('Base de datos inicializada correctamente');
    console.log('Tablas creadas:');
    console.log('   - users');
    console.log('   - products');
    console.log('   - favorites');
    console.log('   - notifications');
    
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
};


if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

// initializeDatabase()

export default initializeDatabase;

