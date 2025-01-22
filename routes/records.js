import express from "express";
import Record from "../models/Record.js";
import {faker} from "@faker-js/faker";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const records = await Record.find({});

        const collection = {
            "items": records,
            "_links": {
                "self": {
                    "href": process.env.BASE_URL+"/records"
                },
                "collection": {
                    "href": process.env.BASE_URL+"/records"
                }
            }
        }
        res.status(200).json(collection)
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.post('/', async (req, res) => {
    try {
        const {name, recordName, description} = req.body;

        const record = await Record.create({
            name: name,
            recordName: recordName,
            description: description
        })

        res.status(201).json(record)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.send();
})

router.post('/seed/:amount', async (req, res) => {
    try {
        await Record.deleteMany({});
        const amount = req.params.amount;

        for (let i = 0; i < amount; i++) {
            await Record.create({
                name: faker.person.fullName(),
                recordName: faker.lorem.lines(1),
                description: faker.lorem.lines({min: 1, max:3})
            });
        }

        res.status(201).json({succes:true})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const record = await Record.findById(id);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(record);
    } catch (error) {
        res.status(404).json({ error: error.message});
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, recordName, description } = req.body;

    try {
        const updateRecord = await Record.findByIdAndUpdate(
            id,
            { name, recordName, description },
            { new: true, runValidators: true }
        );

        if (!updateRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json(updateRecord);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteRecord = await Record.findByIdAndDelete(id);

        if (!deleteRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(204).json({ message: "Succesvol verwijderd:" });
    } catch (error) {
        res.status(404).json({ error: error.message});
    }
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.send();
})
export default router