import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
        return NextResponse.json({ error: 'Missing from or to parameter' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'buses.db');

    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                resolve(NextResponse.json({ error: 'Database connection failed' }, { status: 500 }));
                return;
            }
        });

        db.all(
            `SELECT * FROM buses WHERE LOWER(source) = LOWER(?) AND LOWER(destination) = LOWER(?) ORDER BY departure ASC`,
            [from, to],
            (err, rows) => {
                db.close();
                if (err) {
                    resolve(NextResponse.json({ error: 'Database query failed' }, { status: 500 }));
                } else {
                    resolve(NextResponse.json({ buses: rows }));
                }
            }
        );
    });
}
