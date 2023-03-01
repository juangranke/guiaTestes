let app  = require('../src/app')
let supertest = require('supertest')
let request = supertest(app)

let mainUser = { name: 'Juan Granke', email: 'juangranke20@gmail.com', password: '123456' }

beforeAll(() => {
    // Inserir usuário Juan no banco
    return request.post('/user')
        .send(mainUser)
        .then(res => {})
        .catch(err => {
            console.log(err)
        })
})

afterAll(() => {
    // Remover usuário Juan do banco, assim mantendo o banco limpo.

    return request.delete(`/user/${mainUser.email}`)
        .then(res => {
        
        }).catch(err => {
            console.log(err)
        })
})
/*
beforeEach(() => {

})

afterEach(() => {

})*/

describe('Cadastro de usuario', () => {

    test('Deve cadastrar um usuário com sucesso', () => {
        
        let time = Date.now() // Retorna o tempo atual em milisegundos.
        let email = `${time}@gmai.com`
        let user = {
            name: 'Juan',
            email,
            password: '123456'
        }

        return request.post('/user')
            .send(user)
                .then(res => {
                    expect(res.statusCode).toEqual(200);
                    expect(res.body.email).toEqual(email);
                }).catch(err => {
                    fail(err)
                }) 

    })



    test('Deve impedir que um usuário se cadastre com os dados vazios', () => {

        let user = {
            name: '',
            email: '',
            password: ''
        }

        return request.post('/user')
            .send(user)
                .then(res => {
                    expect(res.statusCode).toEqual(400); // Bad request - dados invalidos
                }).catch(err => {
                    fail(err)
                }) 
    })



    test('Deve impedir que um usuário cadastre o email repetido', () => {

        let time = Date.now() // Retorna o tempo atual em milisegundos.
        let email = `${time}@gmai.com`
        let user = {
            name: 'Juan',
            email,
            password: '123456'
        }

        return request.post('/user')
            .send(user)
                .then(res => {
                    expect(res.statusCode).toEqual(200);
                    expect(res.body.email).toEqual(email);

                    return request.post('/user')
                        .send(user)
                        .then(res => {
                            expect(res.statusCode).toEqual(400)
                            expect(res.body.error).toEqual('E-mail já cadastrado')
                        }).catch(err => {
                            return console.log(err)
                        })
                }).catch(err => {
                    return console.log(err)
                }) 
    })
    })


describe('Autenticação', () => {
    test('Deve me retornar um token quando logar', () => {
        return request.post('/auth')
            .send({
                email: mainUser.email,
                password: mainUser.password
            })
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.token).toBeDefined() // Que recebeu um dados
            })
            .catch(err => {
                fail(err) // Não usado fail, pois está com erro nesta versão do jest.
            })
    })

    test( 'Deve impedir que um usuário não cadastrado se logue', () => {
        return request.post('/auth')
            .send({
                email: 'Umemailquialerw@gmail.com',
                password: '3213213'
            })
            .then(res => {
                expect(res.statusCode).toEqual(403)
                expect(res.body.errors.email).toEqual('E-mail não cadastrado') // Que recebeu um dados
            })
            .catch(err => {
                fail(err) // Não usado fail, pois está com erro nesta versão do jest.
            })
    })


    test( 'Deve impedir que um usuário se logue com uma senha errada', () => {
        return request.post('/auth')
            .send({
                email: 'juangranke20@gmail.com',
                password: '1234567'
            })
            .then(res => {
                expect(res.statusCode).toEqual(403)
                expect(res.body.errors.password).toEqual('Senha incorreta') // Que recebeu um dados
            })
            .catch(err => {
                fail(err) // Não usado fail, pois está com erro nesta versão do jest.
            })
    })

})
