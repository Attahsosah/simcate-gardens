import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ role: null }, { status: 401 });
    }

    return NextResponse.json({ 
      role: session.user.role,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      }
    });
  } catch (error) {
    console.error('Error getting user role:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}