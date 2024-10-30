import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { jest } from '@jest/globals';

// Mock database
interface Document {
    id: number;
    title: string;
    description: string;
    coordinates: { latitude: string; longitude: string };
}

const mockDB: { documents: Document[]; links: any[]; sessions: any[]; users: any[] } = {
    documents: [],
    links: [],
    sessions: [],
    users: []
};

// Mock Express app
const app = express();
app.use(bodyParser.json());

// Mock routes 'links'
app.get('/documents', (req, res) => {
    if (mockDB.sessions.length === 0) {
        res.status(401).send('Unauthorized');
        return;
    }
    if (mockDB.documents.length === 0) {
        res.status(500).send('Internal Server Error');
        return;
    }
    
    res.json(mockDB.documents);
});

app.get('/documents/:id', (req, res) => {
    if (mockDB.sessions.length === 0) {
        res.status(401).send('Unauthorized');
        return;
    }
    const document = mockDB.documents.find(doc => doc.id === parseInt(req.params.id));
    if (document) {
        res.json(document);
    } else {
        res.status(404).send('Not Found');
    }
});

app.post('/documents', (req, res) => {
    if (mockDB.sessions.length === 0) {
        res.status(401).send('Unauthorized');
        return;
    }
    if (Object.keys(req.body).length === 0) {
        res.status(400).send('Bad Request');
        return;
    }
    const newDocument = { id: mockDB.documents.length + 1, ...req.body };
    mockDB.documents.push(newDocument);
    res.status(201).json({ message: 'Document created successfully', id: newDocument.id });
});

app.patch('/documents/:id', (req, res) => {
    if (mockDB.sessions.length === 0) {
        res.status(401).send('Unauthorized');
        return;
    }
    if (Object.keys(req.body).length === 0) {
        res.status(400).send('Bad Request');
        return;
    }
    const document = mockDB.documents.find(doc => doc.id === parseInt(req.params.id));
    if (document) {
        Object.assign(document, req.body);
        res.json(document);
    } else {
        res.status(404).send('Not Found');
    }
});

app.delete('/documents/:id', (req, res) => {
    if (mockDB.sessions.length === 0) {
        res.status(401).send('Unauthorized');
        return;
    }
    const index = mockDB.documents.findIndex(doc => doc.id === parseInt(req.params.id));
    if (index !== -1) {
        mockDB.documents.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Not Found');
    }
});

//Mock routes 'sessions'
app.post('/sessions', (req, res) => {
    const Test_email = 'sofia@test.com'
    const Test_password = '123456'
    
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'The request was malformed or missing required parameters.'});
        return;
    }

    if (email !== Test_email || password !== Test_password) {
        res.status(401).json({ message: 'Incorrect credentials.' });
        return;
    }

    const newSession = {
        email,
        "name": "Sofia",
        "surname": "Garcia",
        "role": "RESIDENT"
    };

    mockDB.sessions.push(newSession);
    res.status(201).json(newSession);
});

app.get('/sessions/current', (req, res) => {
    if (mockDB.sessions.length === 0) {
        res.status(401).json({ message: 'No authenticated user.' });
    } else {
        res.status(200).json(mockDB.sessions);
    }
});

// Tests
describe('API End-to-End Tests', () => {
    beforeAll(() => {
        const newSession = {
            "email": "sofia@test.com",
            "name": "Sofia",
            "surname": "Garcia",
            "role": "RESIDENT"
        };

        mockDB.sessions.push(newSession);
    });

    it('should create a new document', async () => {
        const response = await request(app)
            .post('/documents')
            .send({
                title: 'Test Document',
                description: 'This is a test document',
                coordinates: { latitude: '0', longitude: '0' }
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Document created successfully');
        expect(response.body.id).toBe(1);
    });

    it('should retrieve all documents', async () => {
        const response = await request(app).get('/documents');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('should retrieve a specific document', async () => {
        const response = await request(app).get('/documents/1');
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Test Document');
    });

    it('should update a document', async () => {
        const response = await request(app)
            .patch('/documents/1')
            .send({ title: 'Updated Test Document' });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Test Document');
    });

    it('should delete a document', async () => {
        const response = await request(app).delete('/documents/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for a non-existent document', async () => {
        const response = await request(app).get('/documents/999');
        expect(response.status).toBe(404);
    });
});



describe('API End-to-End Error Tests', () => {
    describe('GET /documents', () => {
        beforeAll(() => {
            mockDB.sessions = [];
        });

        it('should return 401 when user is unauthorized', async () => {
            const response = await request(app).get('/documents');
            expect(response.status).toBe(401);
        });
        
        it('should return 500 when internal error happens', async () => {
            const newSession = {
                "email": "sofia@test.com",
                "name": "Sofia",
                "surname": "Garcia",
                "role": "RESIDENT"
            };
        
            mockDB.sessions.push(newSession);


            mockDB.documents = [];
            const response = await request(app).get('/documents');
            expect(response.status).toBe(500);
        });
    });
    
    describe('GET /documents/:id', () => {
        it('should return 401 when user is unauthorized', async () => {
            mockDB.sessions = [];
            const response = await request(app).get('/documents');
            expect(response.status).toBe(401);
        });

        it('should return 404 when document is not found', async () => {
            const newSession = {
                "email": "sofia@test.com",
                "name": "Sofia",
                "surname": "Garcia",
                "role": "RESIDENT"
            };
        
            mockDB.sessions.push(newSession);
            const response = await request(app).get('/documents/999');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /documents', () => {
        it('should return 401 when user is unauthorized', async () => {
            mockDB.sessions = [];
            const response = await request(app)
                .post('/documents')
                .send({
                    title: 'Test Document',
                    description: 'This is a test document'
                });
            expect(response.status).toBe(401);
        });

        it('should return 400 when request is malformed', async () => {
            const newSession = {
                "email": "sofia@test.com",
                "name": "Sofia",
                "surname": "Garcia",
                "role": "RESIDENT"
            };
        
            mockDB.sessions.push(newSession);

            const response = await request(app)
            .post('/documents')
            .send();
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /documents/:id', () => {
        it('should return 401 when user is unauthorized', async () => {
            mockDB.sessions = [];
            const response = await request(app)
                .patch('/documents/1')
                .send({ title: 'Updated Test Document' });
            expect(response.status).toBe(401);
        });

        it('should return 400 when request is malformed', async () => {
            const newSession = {
                "email": "sofia@test.com",
                "name": "Sofia",
                "surname": "Garcia",
                "role": "RESIDENT"
            };

            mockDB.sessions.push(newSession);

            const newDocument = { id: mockDB.documents.length + 1,
                title: 'Test Document',
                description: 'This is a test document',
                coordinates: { latitude: '0', longitude: '0' }
            };
            mockDB.documents.push(newDocument);

            const response = await request(app)
                .patch('/documents/1')
                .send();

            expect(response.status).toBe(400);
        });

        it('should return 404 when document is not found', async () => {
            const response = await request(app)
                .patch('/documents/999')
                .send({ title: 'Updated Test Document' });
            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /documents/:id', () => {
        it('should return 401 when user is unauthorized', async () => {
            mockDB.sessions = [];
            const response = await request(app).delete('/documents/1');
            expect(response.status).toBe(401);
        });

        it('should return 404 when document is not found', async () => {
            const newSession = {
                "email": "sofia@test.com",
                "name": "Sofia",
                "surname": "Garcia",
                "role": "RESIDENT"
            };

            mockDB.sessions.push(newSession);

            const response = await request(app).delete('/documents/999');
            expect(response.status).toBe(404);
        });
    });
});