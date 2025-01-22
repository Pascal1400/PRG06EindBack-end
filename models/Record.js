import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    name: {type: String, required: true},
    recordName: {type: String, required: true},
    description: {type: String, required: true}
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: process.env.BASE_URL+`/records/${ret.id}`
                },
                collection: {
                    href: process.env.BASE_URL+`/records`
                }
            }

            delete ret._id
            delete ret.__v
        }
    }
});

const Record = mongoose.model('Record', recordSchema);

export default Record;