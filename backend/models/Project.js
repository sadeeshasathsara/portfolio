import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    liveUrl: {
        type: String,
        default: ''
    },
    githubUrl: {
        type: String,
        default: ''
    },
    tools: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Add text index for searching
projectSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text'
});

export default mongoose.model('Project', projectSchema);