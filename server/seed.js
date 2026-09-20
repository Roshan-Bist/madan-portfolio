const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Auth = require("./Models/AuthModel");
const Profile = require("./Models/profileModel");

dotenv.config();

const seedData = async () => {
    try {
        console.log("Connecting to DB at", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        console.log("Clearing existing data...");
        await Auth.deleteMany({});
        await Profile.deleteMany({});
        console.log("Data cleared.");

        console.log("Creating Admin User...");
        const adminUser = new Auth({
            name: "Madan Saud",
            email: "madansaud@gmail.com",
            password: "madan@123" // Will be hashed by pre('save') hook
        });
        await adminUser.save();
        console.log("Admin User created.");

        console.log("Creating Profile...");
        const profile = new Profile({
            name: "Roshan Bist",
            title: "Agronomist | Bachelor in Agriculture",
            email: "admin@example.com",
            phone: "+1234567890",
            address: "Agricultural District",
            bio: "Passionate Agronomist specializing in sustainable farming practices and crop optimization.",
            socialLinks: {
                linkedin: "https://linkedin.com/in/roshanbist",
                github: "https://github.com/roshanbist",
                twitter: "https://twitter.com/roshanbist"
            },
            skills: ["Crop Science", "Soil Analysis", "Pest Management", "Sustainable Agriculture", "Farm Economics"],
            experience: [
                {
                    title: "Junior Agronomist",
                    company: "AgriTech Farms",
                    duration: "2023 - Present",
                    description: "Leading field trials and optimizing crop yields."
                }
            ],
            education: [
                {
                    degree: "B.Sc. Agriculture",
                    school: "National Agriculture University",
                    year: "2022"
                }
            ],
            achievements: ["Best Field Researcher Award"],
            certifications: ["Certified Crop Specialist"],
            languages: ["English", "Nepali"],
            interests: ["Farming", "Sustainability", "Hiking"],
            portfolio: "https://roshanbist.com"
        });
        await profile.save();
        console.log("Profile created.");



        console.log("Data seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
