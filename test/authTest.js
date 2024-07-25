process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../server');
const userModel = require('./../models/userModel');
chai.should();
chai.use(chaiHttp);

describe('/Auth test', () => {

    beforeEach(done => {
        console.log('hello');
        userModel.deleteMany({});
        done();
    });
    
    afterEach(done => {
        console.log('hello');
        userModel.deleteMany({});
        done();
    });

    it('it should not create user without name', (done) => {
        const user = {email: 'abs@gmail.com', password: '12345678', confirmPassword: '12345678'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal('Provide your name');
                done();
            });
    });

    it('it should not create user without email', (done) => {
        const user = {name: 'abc', password: '12345678', confirmPassword: '12345678'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal('Provide your email');
                done();
            });
    });

    it('it should not create user without password and confirm password', (done) => {
        const user = {name: 'abc', email: 'abs@gmail.com'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal('Please confirm password');
                done();
            });
    });

    it('it should not create user with wrong email id', (done) => {
        const user = {name: 'abc', email: 'abs', password: '12345678', confirmPassword: '12345678'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal('invalid email address');
                done()
            });
    });

    it('it should not create user with password of length less than 8', (done) => {
        const user = {name: 'abc', email: 'abs@gmail.com', password: '12345', confirmPassword: '12345'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal('password must be minimum 8 characters long');
                done();
            });
    });

    it('it should not create user if password and confirm password do not match', (done) => {
        const user = {name: 'abc', email: 'abs@gmail.com', password: '12345678', confirmPassword: '123459079'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal('Password and confirm password do not match');
                done();
            });
    });

    it('it should not create user if user with given email already exist', (done) => {
        const user1 = {name: 'abc', email: 'abc@gmail.com', password: '12345678', confirmPassword: '12345678'};
        userModel.create(user1);
        const user2 = {name: 'hello', email: 'abc@gmail.com', password: 'hello1234', confirmPassword: 'hello1234'}
        chai.request(server)
            .post('/cinema/signup')
            .send(user2)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('fail');
                res.body.should.have.property('message').equal(`User with email ${user2.email} already exist. Try with diffrent email address`);
                // userModel.deleteMany({});
                done();
            });
    });  
    
    it('it should create user', (done) => {
        const user = {name: 'hello', email: 'hello@gmail.com', password: '12345678', confirmPassword: '12345678'};
        chai.request(server)
            .post('/cinema/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('status').equal('success');
                res.body.should.have.property('token');
                res.body.token.should.be.a('string');
                res.body.should.have.property('data');
                res.body.data.should.have.property('user');
                res.body.data.user.should.be.a('object');
                // userModel.deleteMany({});
                done();
            });
    });    
})

