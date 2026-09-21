import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function logPlayEvent(track: string, artist: string, album: string): Promise<void> {
    await prisma.playEvent.create({
        data: { track, artist, album },
    });
}

export async function getRecentHistory(limit = 100) {
    return prisma.playEvent.findMany({
        orderBy: { playedAt: "desc"},
        take: limit,
    });
}

export async function getMostPlayed(limit = 20) {
    const grouped = await prisma.playEvent.groupBy({
        by: ["track", "artist"],
        _count: { track: true },
        orderBy: { _count: { track: "desc" } },
    });

    return grouped.map((row) => ({
        track: row.track,
        artist: row.artist,
        playCount: row._count.track,
    }));
}
