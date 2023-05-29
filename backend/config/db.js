import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_ONLINE)
        console.log(`Mongodb Connected ${conn.connection.host}`)
    } catch (error) {
        console.error(`Errro: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB