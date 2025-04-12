// app/api/reports/route.ts

// Import helper to construct HTTP responses
import { NextResponse } from "next/server";

// Import enums for report status and type
import { ReportStatus, ReportType } from "@prisma/client";

// Import Prisma client instance for database operations
import { prisma } from "@/lib/prisma";

// Import server session utility and authentication config
import getServerSession from "next-auth"; 
import { authOptions } from "@/lib/auth";

// Handle GET requests to retrieve reports
export async function GET(req: Request) {
  try {
    // Validate user session before proceeding (authentication check)
    const session = await getServerSession(authOptions);

    // Return a 401 Unauthorized response if the user is not authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ReportStatus | undefined;
    const type = searchParams.get("type") as ReportType | undefined;

    // Log query parameters to aid in debugging
    console.log("Query Params:", { status, type });

    // Dynamically build the query filter based on optional status and type
    const where: Record<string, any> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    // Fetch reports from the database using the constructed filters
    const reports = await prisma.report.findMany({
      where, // Apply filters if present
      orderBy: { createdAt: "desc" }, // Sort reports by most recent
      select: {
        // Only return necessary fields for performance and clarity
        id: true,
        reportId: true,
        type: true,
        title: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return the filtered and sorted reports as JSON
    return NextResponse.json(reports);
  } catch (error) {
    // Log any errors that occur during execution
    console.error("Failed to fetch reports:", error);

    // Return a 500 Internal Server Error response
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
