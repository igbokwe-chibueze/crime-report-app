// Import the Next.js helper to create HTTP responses
import { NextResponse } from "next/server";

// Import the Prisma client to interact with the database
import { PrismaClient } from "@prisma/client";

// Initialize a Prisma client instance to interact with the database
const prisma = new PrismaClient();

// Define a GET route handler to fetch the details of a specific report by reportId
export async function GET(
  request: Request,  // The request object from Next.js
  { params }: { params: { reportId: string } } // Extract reportId from the URL parameters
) {
  try {
    // Query the Prisma client to find a unique report based on the provided reportId
    const report = await prisma.report.findUnique({
      where: {
        reportId: params.reportId, // Use the reportId parameter from the URL
      },
    });

    // If no report is found, return a 404 error response
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Return the report details as a JSON response if found
    return NextResponse.json(report);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error fetching report details:", error);

    // Return a 500 Internal Server Error response if something goes wrong
    return NextResponse.json(
      { error: "Failed to fetch report details" },
      { status: 500 }
    );
  }
}
