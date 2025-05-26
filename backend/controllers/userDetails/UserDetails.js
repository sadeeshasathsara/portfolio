import UserDetails from "../../models/UserDetails.js";

export const getProfile = async (req, res) => {
    try {
        let profile = await UserDetails.findOne({ profileId: 'main' });

        if (!profile) {
            // Create a new profile with default empty values
            profile = new UserDetails({
                profileId: 'main',
                // Basic Section
                fullName: '',
                displayName: '',
                nameWithInitials: '',
                profilePicture: '',
                birthday: null,
                bio: '',

                // Contact Info
                phone: '',
                address: {
                    houseNo: '',
                    street: '',
                    city: '',
                    district: '',
                    province: '',
                    country: ''
                },

                // Social Media
                socialMedia: {
                    facebook: '',
                    instagram: '',
                    linkedin: '',
                    twitter: '',
                    dribbble: '',
                    github: '',
                    whatsapp: ''
                },

                // About Section
                intro: '',
                myJourney: '',
                numberOfProjects: 0,
                numberOfTechnologies: 0,
                yearsExperience: 0,
                clientSatisfactionRate: 0,

                // Expertise
                expertise: [{ title: '', description: '' }],

                // Projects
                projectsIntro: '',

                // Contact Section
                contactIntro: ''
            });

            await profile.save();
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveProfile = async (req, res) => {
    try {
        const profileData = req.body;

        // Ensure we don't modify profileId
        delete profileData.profileId;

        const updatedProfile = await UserDetails.findOneAndUpdate(
            { profileId: 'main' },
            { $set: profileData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};