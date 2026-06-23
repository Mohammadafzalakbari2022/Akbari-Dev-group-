import { getPrisma } from "@/lib/prisma";
import type { AboutSection, TeamMemberDto } from "./types";
import { MOCK_ABOUT_SECTIONS, MOCK_TEAM_MEMBERS } from "./mock-products";

export async function getAboutSections(): Promise<AboutSection[]> {
  const prisma = getPrisma();
  if (!prisma) return MOCK_ABOUT_SECTIONS;

  try {
    const pages = await prisma.page.findMany({
      where: {
        published: true,
        slug: { in: ["story", "mission", "vision", "values"] },
      },
    });

    if (pages.length === 0) return MOCK_ABOUT_SECTIONS;

    return pages.map((p) => ({
      slug: p.slug,
      titleJson: p.titleJson,
      contentJson: p.contentJson,
    }));
  } catch {
    return MOCK_ABOUT_SECTIONS;
  }
}

export async function getTeamMembers(): Promise<TeamMemberDto[]> {
  const prisma = getPrisma();
  if (!prisma) return MOCK_TEAM_MEMBERS;

  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { sortOrder: "asc" },
    });

    if (members.length === 0) return MOCK_TEAM_MEMBERS;

    return members;
  } catch {
    return MOCK_TEAM_MEMBERS;
  }
}
