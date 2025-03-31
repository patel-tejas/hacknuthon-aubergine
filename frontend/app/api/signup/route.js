import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../db/schema/User';
import connectDB from '../../../db/db';

export async function POST(request) {
    await connectDB();

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
        return new Response(
            JSON.stringify({ error: 'Please provide all required fields' }),
            { status: 400 }
        );
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: 'User already exists' }),
                { status: 400 }
            );
        }

        // Trim and hash the password
        const trimmedPassword = password.trim();
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Create and save new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return new Response(
            JSON.stringify({
                message: 'User created successfully',
                token,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                }
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Server error' }),
            { status: 500 }
        );
    }
}
