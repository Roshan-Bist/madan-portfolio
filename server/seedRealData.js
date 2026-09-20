const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./Models/profileModel');
const Article = require('./Models/articleModel');
const Auth = require('./Models/AuthModel');

dotenv.config();

const seedRealData = async () => {
    try {
        console.log("Connecting to DB at", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const realProfileData = {
            name: "Madan Saud",
            title: "Agronomy Expert | Sustainable Farming",
            email: "madan.saud@example.com",
            phone: "+47 (Contact via Email)", // Placeholder as phone is required but wasn't provided perfectly
            address: "Stavanger, Norway",
            bio: "I am a dedicated agriculture professional with a strong foundation in modern farming practices, sustainable agriculture, and crop management. Passionate about empowering rural communities and leveraging modern technologies for high-yield, eco-friendly farming solutions.",
            highlights: [
                "Research into sustainable crop management",
                "Implementation of eco-friendly farming solutions",
                "Community outreach and agricultural education",
                "Commitment to environmental preservation",
                "Focus on long-term food security"
            ],
            socialLinks: {
                linkedin: "https://linkedin.com/in/madansaud",
                github: "https://github.com/madansaud", // Assuming generic
                twitter: ""
            },
            skills: [],
            experience: [
                {
                    title: "Agronomy Expert",
                    company: "Sustainable Farming Institute",
                    duration: "2018 - Present",
                    description: "Leading research on sustainable crop management.\nImplementing eco-friendly farming solutions.\nEducating communities about environmental preservation."
                }
            ],
            education: [],
            achievements: [],
            certifications: ["Certified Crop Advisor"],
            languages: ["English", "Nepali"],
            interests: ["Sustainable Farming", "Environmental Conservation"],
            portfolio: ""
        };

        console.log("Updating Profile with real data...");
        // Since there is only one profile, we use updateOne without specific query filter or grab the first
        const existingProfile = await Profile.findOne({});

        if (existingProfile) {
            const result = await Profile.updateOne({ _id: existingProfile._id }, { $set: realProfileData });
            console.log("Profile updated:", result);
        } else {
            const newProfile = new Profile(realProfileData);
            await newProfile.save();
            console.log("Profile created from scratch.");
        }

        console.log("Creating/Updating Admin User...");
        await Auth.deleteMany({});
        const adminUser = new Auth({
            name: "Madan Saud",
            email: "madansaud@gmail.com",
            password: "madan@123"
        });
        await adminUser.save();
        console.log("Admin User created.");

        console.log("Seeding initial Articles...");
        await Article.deleteMany({}); // Clear existing articles for the new persona

        const sampleArticles = [
            {
                title: "The Future of Sustainable Agriculture in Arid Regions",
                content: "Exploring the latest techniques in water conservation, drought-resistant crop varieties, and soil moisture retention strategies that are helping farmers adapt to changing climates.",
                photo: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop", // agriculture field
                author: "Madan Saud"
            },
            {
                title: "Integrating Tech: IoT Sensors for Precision Soil Monitoring",
                content: "A deep dive into how real-time data from localized IoT sensors is revolutionizing how we apply fertilizers and water, reducing waste by up to 30% while increasing crop yield.",
                photo: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop", // tractor/tech
                author: "Madan Saud"
            },
            {
                title: "Organic vs Conventional: A Long-Term Yield Analysis",
                content: "Reviewing a 5-year study on the delayed but compounding benefits of organic soil practices compared to traditional synthetic inputs and their long-term effects on soil biome health.",
                photo: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop", // organic produce
                author: "Madan Saud"
            }
        ];

        await Article.insertMany(sampleArticles);
        console.log(`Seeded ${sampleArticles.length} test articles for Madan Saud.`);

        console.log("Data seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding real data:", error);
        process.exit(1);
    }
};

seedRealData();
