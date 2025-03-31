const { connect, set } = require('mongoose');

const connectDB = async () => {
    try {
        set('strictQuery', false);
        await connect("mongodb+srv://tejas:hn5NumpMCz4WhM1g@cluster0.ogdjiko.mongodb.net/hacknuthon?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;
