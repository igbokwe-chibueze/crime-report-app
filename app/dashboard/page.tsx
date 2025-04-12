"use client"; // This directive enables React Server Components to run on the client side.

import { useSession } from "next-auth/react"; // Hook to access user session data.
import { useEffect, useState } from "react"; // React hooks.
import { Report, ReportStatus, ReportType } from "@prisma/client"; // Types from the Prisma schema.
import { signOut } from "next-auth/react"; // Function to handle sign-out.

export default function Dashboard() {
  // Get session info (user data) using NextAuth
  const { data: session } = useSession();

  // State for fetched reports
  const [reports, setReports] = useState<Report[]>([]);
  // Filter by report status (e.g. PENDING, RESOLVED, etc.)
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  // Filter by report type (e.g. FIRE, MEDICAL, etc.)
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  // Loading state to show spinner while fetching data
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  // Function to fetch reports from API
  const fetchReports = async () => {
    setIsLoading(true); // Start loading spinner
    try {
      const response = await fetch("/api/reports"); // Fetch data from API route
      const data = await response.json(); // Parse JSON
      setReports(data); // Store data in state
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  // Function to update a report's status via PATCH request
  const updateReportStatus = async (
    reportId: string,
    newStatus: ReportStatus
  ) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Send updated status
      });

      // Refresh report list on success
      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  // Apply filters to the list of reports
  const filteredReports = reports.filter((report) => {
    const statusMatch = filter === "ALL" || report.status === filter;
    const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
    return statusMatch && typeMatch;
  });

  // Assign a color based on report status for visual labels
  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      RESOLVED: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      DISMISSED:
        "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
    };
    return colors[status];
  };

  // Show loading spinner while fetching reports
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation bar */}
      <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-neutral-400">
                {session?.user?.name || "Admin"}
              </span>
              <button
                onClick={() => signOut()} // Sign the user out
                className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            {/* Filter by report status */}
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as ReportStatus | "ALL")
              }
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ReportStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Filter by report type */}
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as ReportType | "ALL")
              }
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            >
              <option value="ALL">All Types</option>
              {Object.values(ReportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Display total number of matching reports */}
          <div className="text-neutral-400">
            {filteredReports.length} Reports
          </div>
        </div>

        {/* Report cards */}
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <div className="flex justify-between items-start gap-6">
                <div className="space-y-4 flex-1">
                  {/* Report title and status badge */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-medium text-neutral-200">
                      {report.title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {/* Report description */}
                  <p className="text-neutral-400 text-sm">
                    {report.description}
                  </p>

                  {/* Metadata: type, location, date */}
                  <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                      </div>
                      {report.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                      </div>
                      {report.location || "N/A"}
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                      </div>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Optional image if attached to the report */}
                  {report.image && (
                    <img
                      src={report.image}
                      alt="Report"
                      className="mt-4 rounded-lg border border-neutral-800"
                    />
                  )}
                </div>

                {/* Status update dropdown */}
                <select
                  value={report.status}
                  onChange={(e) =>
                    updateReportStatus(
                      report.id,
                      e.target.value as ReportStatus
                    )
                  }
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                >
                  {Object.values(ReportStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* Fallback when no matching reports are found */}
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
              No reports found matching the selected filters.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
