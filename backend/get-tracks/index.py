import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p31823890_wepperi_music_platfo')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """Получение списка треков из БД с фильтрацией по жанру, исполнителю, поисковому запросу"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    params = event.get('queryStringParameters') or {}
    user_id = params.get('user_id')
    genre = params.get('genre', '')
    search = params.get('q', '').lower().replace("'", "")
    limit = min(int(params.get('limit', 50)), 100)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    conditions = []
    if user_id:
        conditions.append(f"t.user_id = {int(user_id)}")
    if genre:
        safe_genre = genre.replace("'", "")
        conditions.append(f"t.genre = '{safe_genre}'")
    if search:
        conditions.append(
            f"(LOWER(t.title) LIKE '%{search}%' OR LOWER(t.artist) LIKE '%{search}%' OR LOWER(t.genre) LIKE '%{search}%')"
        )

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    cur.execute(f"""
        SELECT t.id, t.title, t.artist, t.genre, t.duration, t.audio_url, t.cover_url, t.plays, t.created_at,
               u.name as uploader_name
        FROM {SCHEMA}.tracks t
        JOIN {SCHEMA}.users u ON u.id = t.user_id
        {where}
        ORDER BY t.created_at DESC
        LIMIT {limit}
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    tracks = []
    for row in rows:
        tracks.append({
            'id': row[0],
            'title': row[1],
            'artist': row[2],
            'genre': row[3],
            'duration': row[4],
            'audio_url': row[5],
            'cover_url': row[6] or '',
            'plays': row[7],
            'created_at': str(row[8]),
            'uploader_name': row[9],
        })

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'tracks': tracks})
    }
