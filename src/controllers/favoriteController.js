const Favorite = require('../models/Favorite');
const Post = require('../models/Post');

class FavoriteController {
  // Agregar a favoritos
  static async add(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      // Verificar que el post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          error: 'Post no encontrado',
          message: 'El post solicitado no existe'
        });
      }

      // Verificar si ya está en favoritos
      const alreadyFavorite = await Favorite.exists(userId, postId);
      if (alreadyFavorite) {
        return res.status(409).json({
          error: 'Ya está en favoritos',
          message: 'Este post ya está en tu lista de favoritos'
        });
      }

      const favorite = await Favorite.create(userId, postId);

      res.status(201).json({
        message: 'Post agregado a favoritos exitosamente',
        favorite
      });

    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al agregar a favoritos'
      });
    }
  }

  // Obtener favoritos del usuario autenticado
  static async getMyFavorites(req, res) {
    try {
      const userId = req.user.id;
      const favorites = await Favorite.findByUserId(userId);

      res.json({
        message: 'Favoritos obtenidos exitosamente',
        favorites,
        count: favorites.length
      });

    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener los favoritos'
      });
    }
  }

  // Obtener todos los favoritos (admin)
  static async getAll(req, res) {
    try {
      const favorites = await Favorite.findAll();

      res.json({
        message: 'Todos los favoritos obtenidos exitosamente',
        favorites,
        count: favorites.length
      });

    } catch (error) {
      console.error('Error al obtener todos los favoritos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener todos los favoritos'
      });
    }
  }

  // Eliminar de favoritos
  static async remove(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      // Verificar si está en favoritos
      const exists = await Favorite.exists(userId, postId);
      if (!exists) {
        return res.status(404).json({
          error: 'No está en favoritos',
          message: 'Este post no está en tu lista de favoritos'
        });
      }

      await Favorite.delete(userId, postId);

      res.json({
        message: 'Post eliminado de favoritos exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al eliminar de favoritos'
      });
    }
  }

  // Verificar si un post está en favoritos
  static async checkFavorite(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const isFavorite = await Favorite.exists(userId, postId);

      res.json({
        message: 'Estado de favorito verificado',
        isFavorite
      });

    } catch (error) {
      console.error('Error al verificar favorito:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al verificar el estado de favorito'
      });
    }
  }
}

module.exports = FavoriteController;

