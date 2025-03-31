import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../db/schema/User';
import connectDB from '../../../db/db';

export async function POST(request) {
  await connectDB();

  const { email, password } = await request.json();
  console.log("Signin attempt for:", email);

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Please provide all required fields' }),
      { status: 400 }
    );
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    // Compare the trimmed password with the stored hash
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("Stored Hash:", user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({
        message: 'Sign in successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,

        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
}
