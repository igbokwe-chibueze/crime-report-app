import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();
    const report = await prisma.report.update({
      where: { id: params.reportId },
      data: { status },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}