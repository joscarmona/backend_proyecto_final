const Interested = require('../models/Interested');
const Post = require('../models/Post');

class InterestedController {
  // Expresar interés en un post
  static async create(req, res) {
    try {
      const { postId } = req.params;
      const { message } = req.body;
      const userId = req.user.id;

      // Verificar que el post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          error: 'Post no encontrado',
          message: 'El post solicitado no existe'
        });
      }

      // Verificar que el usuario no sea el dueño del post
      if (post.user_id === userId) {
        return res.status(400).json({
          error: 'Acción no permitida',
          message: 'No puedes expresar interés en tu propio post'
        });
      }

      const interested = await Interested.create({
        user_id: userId,
        post_id: postId,
        message
      });

      res.status(201).json({
        message: 'Interés expresado exitosamente',
        interested
      });

    } catch (error) {
      console.error('Error al expresar interés:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al expresar interés'
      });
    }
  }

  // Obtener interesados en un post específico
  static async getByPost(req, res) {
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

      // Solo el dueño del post puede ver los interesados
      if (post.user_id !== userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'Solo el dueño del post puede ver los interesados'
        });
      }

      const interested = await Interested.findByPostId(postId);

      res.json({
        message: 'Interesados obtenidos exitosamente',
        interested,
        count: interested.length
      });

    } catch (error) {
      console.error('Error al obtener interesados:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener los interesados'
      });
    }
  }

  // Obtener intereses del usuario autenticado
  static async getMyInterests(req, res) {
    try {
      const userId = req.user.id;
      const interests = await Interested.findByUserId(userId);

      res.json({
        message: 'Intereses obtenidos exitosamente',
        interests,
        count: interests.length
      });

    } catch (error) {
      console.error('Error al obtener intereses:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener los intereses'
      });
    }
  }

  // Obtener todos los intereses (admin)
  static async getAll(req, res) {
    try {
      const interests = await Interested.findAll();

      res.json({
        message: 'Todos los intereses obtenidos exitosamente',
        interests,
        count: interests.length
      });

    } catch (error) {
      console.error('Error al obtener todos los intereses:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener todos los intereses'
      });
    }
  }

  // Obtener un interés específico por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const interested = await Interested.findById(id);
      if (!interested) {
        return res.status(404).json({
          error: 'Interés no encontrado',
          message: 'El interés solicitado no existe'
        });
      }

      // Solo el usuario que expresó el interés o el dueño del post pueden verlo
      if (interested.user_id !== userId && interested.post_owner_id !== userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para ver este interés'
        });
      }

      res.json({
        message: 'Interés obtenido exitosamente',
        interested
      });

    } catch (error) {
      console.error('Error al obtener interés:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener el interés'
      });
    }
  }

  // Actualizar mensaje de interés
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user.id;

      const existingInterested = await Interested.findById(id);
      if (!existingInterested) {
        return res.status(404).json({
          error: 'Interés no encontrado',
          message: 'El interés solicitado no existe'
        });
      }

      // Solo el usuario que expresó el interés puede actualizarlo
      if (existingInterested.user_id !== userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para editar este interés'
        });
      }

      const updatedInterested = await Interested.update(id, message);

      res.json({
        message: 'Interés actualizado exitosamente',
        interested: updatedInterested
      });

    } catch (error) {
      console.error('Error al actualizar interés:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar el interés'
      });
    }
  }

  // Eliminar interés
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const existingInterested = await Interested.findById(id);
      if (!existingInterested) {
        return res.status(404).json({
          error: 'Interés no encontrado',
          message: 'El interés solicitado no existe'
        });
      }

      // Solo el usuario que expresó el interés puede eliminarlo
      if (existingInterested.user_id !== userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para eliminar este interés'
        });
      }

      await Interested.delete(id);

      res.json({
        message: 'Interés eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar interés:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al eliminar el interés'
      });
    }
  }
}

module.exports = InterestedController;

