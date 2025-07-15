const request = require("supertest");
const server = require("../index");

describe("Operaciones de la API REST marketplace", () => {
    // Testear a la ruta GET /api/products
    it('Obteniendo un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto', async () =>{
        const response = await request(server).get('/api/products').send()
        const status = response.statusCode

        expect(status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body).toContain(response.body[0])
    })

    // Comprobar que se obtiene un código 404 al intentar eliminar un producto con un id que no existe
    it('Obteniendo status code 404 al intentar eliminar un producto con id que no existe', async () => {
        const jwt = "token"
        const id_productToEliminate = 50
        
        const response = await request(server).delete(`/api/products/${id_productToEliminate}`).set("Authorization", jwt).send()
        const status = response.statusCode

        expect(status).toBe(404)
    })

    // Testear que la ruta POST /api/products agrega un nuevo producto y devuelve un status code 201
    it('Se agrega un nuevo producto y se obtiene un status code 201', async () => {
        const id = Math.floor(Math.random() * 999)
        const newProduct = {
            imagen_url: "SIN IMAGEN",
            title: "Cartera de cuero",
            price: "25.000",
            location: "Santiago",
            condition: "Usado",
            description: "Cartera en buen estado, color café oscuro.",
            category: "Mujer"   	
        }

        const response = await request(server).post("/api/products").send(newProduct)
        console.log('Contenido de response.body: ', response.body)

        expect(response.body).toContainEqual(newProduct)
        expect(response.statusCode).toBe(201)
    })

    // Verificar si la ruta PUT /api/products/:id devuelve un status code 404 al intentar actualizar un producto con id que no existe
    it('Obteniendo un status code 404 al intentar actualizar un producto con id que no existe', async () => {
        const id_productToUpdate = 50
        const productToUpdate = {
            imagen_url: "SIN IMAGEN",
            title: "Cartera de cuero",
            price: "25.000",
            location: "Santiago",
            condition: "Usado",
            description: "Cartera en buen estado, color café oscuro.",
            category: "Mujer" 
        }

        const response = await request(server).put(`/api/products/${id_productToUpdate}`).send(productToUpdate)

        expect(response.statusCode).toBe(400)
    })
});