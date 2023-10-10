import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request, res: Response) {
  return new Response(JSON.stringify({ message: "Hello World!" }), {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: NextRequest, res: NextResponse) {

  const body = await req.json();

  try {
    const response = await axios.post(
      "http://localhost:5001/npm-checker/us-central1/api/checkDeprecated",
      body
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(error);
  }
}
