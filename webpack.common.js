const path = require('path');

module.exports = {
  // Puntos de entrada para tus archivos JavaScript
  entry: {
    app: './src/app.js',     // Punto de entrada principal para tu aplicación
    login: './src/login.js'  // Punto de entrada para el script de login
  },
  output: {
    path: path.resolve(__dirname, 'dist'),  // Directorio de salida
    filename: '[name].bundle.js',  // Nomenclatura de los archivos de salida basada en el nombre de entrada
    
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Aplicar la regla a los archivos JavaScript
        exclude: /node_modules/,  // Excluir la carpeta node_modules
        use: {
          loader: 'babel-loader',  // Usar babel-loader para transpilar el código JS
          options: {
            presets: ['@babel/preset-env']  // Usar el preset-env para compatibilidad con navegadores antiguos
          }
        }
      }
    ]
  },
  
};
