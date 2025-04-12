// Import Next.js helper to create HTTP responses
import { NextResponse } from "next/server";

// Import the ReportType from Prisma client to ensure correct report type handling
import { ReportType } from "@prisma/client";

// Import the Prisma client to interact with the database
import { prisma } from "@/lib/prisma";

// Define a POST route handler to create a new report
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data to extract the report details
    const {
      reportId,       // Unique identifier for the report
      type,            // Type of the report (e.g., Theft, Fire Outbreak)
      specificType,    // Specific category under the report type
      title,           // Title or headline of the report
      description,     // Detailed description of the report
      location,        // Location where the incident occurred
      latitude,        // Latitude coordinate (optional)
      longitude,       // Longitude coordinate (optional)
      image,           // Optional image associated with the report
      status,          // Current status of the report (default to "PENDING")
    } = await request.json();

    // Create a new report record in the database using Prisma
    const report = await prisma.report.create({
      data: {
        reportId,       // Use the provided reportId
        type: type as ReportType,  // Ensure the type is correctly typed using ReportType
        title,          // Title of the report
        description,    // Report description
        reportType: specificType,  // Specific type of report (e.g., theft, medical emergency)
        location,       // Location of the incident
        latitude: latitude || null,  // If no latitude is provided, default to null
        longitude: longitude || null, // If no longitude is provided, default to null
        image: image || null,  // If no image is provided, default to null
        status: status || "PENDING", // Default status is "PENDING" if not provided
      },
    });

    // Return a success response with the newly created report's ID and a success message
    return NextResponse.json({
      success: true,
      reportId: report.reportId,  // Return the unique reportId
      message: "Report submitted successfully", // Success message
    });
  } catch (error) {
    // Log any errors that occur during the report creation process for debugging
    console.error("Error creating report:", error);

    // Return a failure response with an error message
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit report",  // Return a failure message
      },
      { status: 500 }  // Return a 500 Internal Server Error status if something went wrong
    );
  }
}
