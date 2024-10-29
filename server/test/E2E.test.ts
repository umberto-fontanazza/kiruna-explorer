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

// Mock routes
app.get('/documents', (req, res) => {
    res.json(mockDB.documents);
});

app.get('/documents/:id', (req, res) => {
    const document = mockDB.documents.find(doc => doc.id === parseInt(req.params.id));
    if (document) {
        res.json(document);
    } else {
        res.status(404).send('Not Found');
    }
});

app.post('/documents', (req, res) => {
    const newDocument = { id: mockDB.documents.length + 1, ...req.body };
    mockDB.documents.push(newDocument);
    res.status(201).json({ message: 'Document created successfully', id: newDocument.id });
});

app.patch('/documents/:id', (req, res) => {
    const document = mockDB.documents.find(doc => doc.id === parseInt(req.params.id));
    if (document) {
        Object.assign(document, req.body);
        res.json(document);
    } else {
        res.status(404).send('Not Found');
    }
});

app.delete('/documents/:id', (req, res) => {
    const index = mockDB.documents.findIndex(doc => doc.id === parseInt(req.params.id));
    if (index !== -1) {
        mockDB.documents.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Not Found');
    }
});

// Tests
describe('API End-to-End Tests', () => {
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
