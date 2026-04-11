import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
        return NextResponse.json({ error: 'Missing from or to parameter' }, { status: 400 });
    }

    const cleanFromRaw = from.split(',')[0].trim().toLowerCase();
    const cleanToRaw = to.split(',')[0].trim().toLowerCase();

    try {
        const filePath = path.join(process.cwd(), 'final.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const buses: any[] = JSON.parse(fileContent);

        const parseTimeToMinutes = (timeStr: string) => {
            if (!timeStr) return 9999;
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
            if (!match) return 9999;
            let [_, h, m, p] = match;
            let hours = parseInt(h);
            const minutes = parseInt(m);
            const ampm = p.toLowerCase();
            
            if (ampm === 'pm' && hours !== 12) hours += 12;
            if (ampm === 'am' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        const filteredBuses = buses.filter(bus => {
            const busFrom = (bus.from || '').toLowerCase();
            const busTo = (bus.to || '').toLowerCase();
            
            const matchFrom = busFrom.includes(cleanFromRaw) || cleanFromRaw.includes(busFrom);
            const matchTo = busTo.includes(cleanToRaw) || cleanToRaw.includes(busTo);
            
            return matchFrom && matchTo;
        });

        const sortedBuses = filteredBuses.sort((a, b) => {
            const timeA = parseTimeToMinutes(a.departure);
            const timeB = parseTimeToMinutes(b.departure);
            return timeA - timeB;
        });

        return NextResponse.json({ buses: sortedBuses });
    } catch (error) {
        console.error('Error loading bus data:', error);
        return NextResponse.json({ error: 'Failed to load bus data' }, { status: 500 });
    }
}
