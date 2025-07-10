const Post = require('../models/Post');

class PostController {
  // Crear un nuevo post
  static async create(req, res) {
    try {
      const { title, description, category, location, item_condition, price, picture } = req.body;
      const userId = req.user.id;

      const newPost = await Post.create({
        user_id: userId,
        title,
        description,
        category,
        location,
        item_condition,
        price: parseFloat(price),
        picture: picture || null
      });

      res.status(201).json({
        message: 'Post creado exitosamente',
        post: newPost
      });

    } catch (error) {
      console.error('Error al crear post:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al crear el post'
      });
    }
  }

  // Obtener todos los posts
  static async getAll(req, res) {
    try {
      const { category, search } = req.query;
      let posts;

      if (search) {
        posts = await Post.search(search);
      } else if (category) {
        posts = await Post.findByCategory(category);
      } else {
        posts = await Post.findAll();
      }

      res.json({
        message: 'Posts obtenidos exitosamente',
        posts,
        count: posts.length
      });

    } catch (error) {
      console.error('Error al obtener posts:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener los posts'
      });
    }
  }

  // Obtener un post por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          error: 'Post no encontrado',
          message: 'El post solicitado no existe'
        });
      }

      res.json({
        message: 'Post obtenido exitosamente',
        post
      });

    } catch (error) {
      console.error('Error al obtener post:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener el post'
      });
    }
  }

  // Obtener posts del usuario autenticado
  static async getMyPosts(req, res) {
    try {
      const userId = req.user.id;
      const posts = await Post.findByUserId(userId);

      res.json({
        message: 'Posts del usuario obtenidos exitosamente',
        posts,
        count: posts.length
      });

    } catch (error) {
      console.error('Error al obtener posts del usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener los posts del usuario'
      });
    }
  }

  // Obtener posts de un usuario específico
  static async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const posts = await Post.findByUserId(userId);

      res.json({
        message: 'Posts del usuario obtenidos exitosamente',
        posts,
        count: posts.length
      });

    } catch (error) {
      console.error('Error al obtener posts del usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener los posts del usuario'
      });
    }
  }

  // Actualizar un post
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, location, item_condition, price, picture } = req.body;
      const userId = req.user.id;

      // Verificar que el post existe y pertenece al usuario
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          error: 'Post no encontrado',
          message: 'El post solicitado no existe'
        });
      }

      if (existingPost.user_id !== userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para editar este post'
        });
      }

      const updatedPost = await Post.update(id, {
        title: title || existingPost.title,
        description: description || existingPost.description,
        category: category || existingPost.category,
        location: location || existingPost.location,
        item_condition: item_condition || existingPost.item_condition,
        price: price ? parseFloat(price) : existingPost.price,
        picture: picture !== undefined ? picture : existingPost.picture
      });

      res.json({
        message: 'Post actualizado exitosamente',
        post: updatedPost
      });

    } catch (error) {
      console.error('Error al actualizar post:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar el post'
      });
    }
  }

  // Eliminar un post
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verificar que el post existe y pertenece al usuario
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          error: 'Post no encontrado',
          message: 'El post solicitado no existe'
        });
      }

      if (existingPost.user_id !== userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para eliminar este post'
        });
      }

      await Post.delete(id);

      res.json({
        message: 'Post eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar post:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al eliminar el post'
      });
    }
  }
}

module.exports = PostController;

