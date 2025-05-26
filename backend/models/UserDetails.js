import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchema = new Schema({
    houseNo: String,
    street: String,
    city: String,
    district: String,
    province: String,
    country: String
});

const socialMediaSchema = new Schema({
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String,
    dribbble: String,
    github: String,
    whatsapp: String
});

const expertiseSchema = new Schema({
    title: String,
    description: String
});

const userDetailsSchema = new Schema({
    profileId: {
        type: String,
        required: true,
        unique: true,
        default: 'main'
    },
    // Basic Section
    fullName: String,
    displayName: String,
    nameWithInitials: String,
    profilePicture: String,
    birthday: Date,
    bio: String,

    // Contact Info
    phone: String,
    address: addressSchema,

    // Social Media
    socialMedia: socialMediaSchema,

    // About Section
    intro: String,
    myJourney: String,
    numberOfProjects: Number,
    numberOfTechnologies: Number,
    yearsExperience: Number,
    clientSatisfactionRate: Number,

    // Expertise
    expertise: [expertiseSchema],

    // Projects
    projectsIntro: String,

    // Contact Section
    contactIntro: String
}, { timestamps: true });

export default mongoose.model('UserDetails', userDetailsSchema);