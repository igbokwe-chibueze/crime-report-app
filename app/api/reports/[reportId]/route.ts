// Import Next.js helper to create HTTP responses
import { NextResponse } from "next/server";

// Import session handling from next-auth for authentication
import getServerSession from "next-auth";

// Import authentication options for next-auth
import { authOptions } from "@/lib/auth";

// Import the Prisma client to interact with the database
import { prisma } from "@/lib/prisma";

// Define a PATCH route handler to update the status of a specific report
export async function PATCH(
  request: Request,  // The request object from Next.js
  { params }: { params: { reportId: string } }  // Extract reportId from the URL parameters
) {
  try {
    // Get the current session using the authentication options
    const session = await getServerSession(authOptions);

    // If no session exists (i.e., the user is not authenticated), return a 401 Unauthorized response
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the status from the request body to update the report
    const { status } = await request.json();

    // Update the status of the report in the database using Prisma
    const report = await prisma.report.update({
      where: { id: params.reportId }, // Locate the report by its ID
      data: { status },  // Update the status with the new value
    });

    // Return the updated report details as a JSON response
    return NextResponse.json(report);
  } catch (error) {
    // Log any errors that occur during the update process for debugging
    console.error("Error updating report:", error);

    // Return a 500 Internal Server Error response if the update fails
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}
