const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    // Testear a la ruta GET /cafes
    it('Obteniendo un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto', async () =>{
        const response = await request(server).get('/cafes').send()
        const status = response.statusCode

        expect(status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body).toContain(response.body[0])
    })

    // Comprobar que se obtiene un código 404 al intentar eliminar un café con un id que no existe
    it('Obteniendo status code 404 al intentar eliminar un café con id que no existe', async () => {
        const jwt = "token"
        const id_coffeToEliminate = 5
        
        const response = await request(server).delete(`/cafes/${id_coffeToEliminate}`).set("Authorization", jwt).send()
        const status = response.statusCode

        expect(status).toBe(404)
    })

    // Testear que la ruta POST /cafes agrega un nuevo café y devuelve un status code 201
    it('Se agrega un nuevo café y se obtiene un status code 201', async () => {
        const id = Math.floor(Math.random() * 999)
        const newCoffee = {
            id,
            // id: 3,
            nombre: "Espresso"    	
        }

        // const { body: coffees } = await request(server).post("/cafes").send(newCoffee)
        const response = await request(server).post("/cafes").send(newCoffee)
        console.log('Contenido de response.body: ', response.body)

        // expect(coffees).toContainEqual(newCoffee)
        expect(response.body).toContainEqual(newCoffee)
        expect(response.statusCode).toBe(201)
    })

    // Verificar si la ruta PUT /cafes devuelve un status code 400 al intentar actualizar un café enviando un id por parámetro diferente al id enviado en el payload
    it('Obteniendo un status code 400 al intentar actualizar un café con id por parámetro diferente al id enviado en el payload', async () => {
        const id_coffeToUpdate = 6
        const coffeeToUpdate = {
            id: 2,
            nombre: "Ristretto"
        }

        const response = await request(server).put(`/cafes/${id_coffeToUpdate}`).send(coffeeToUpdate)

        expect(response.statusCode).toBe(400)
    })
});