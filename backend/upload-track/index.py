import json
import os
import base64
import uuid
import psycopg2
import boto3
import re

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p31823890_wepperi_music_platfo')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def s3_client():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

def cdn_url(key: str) -> str:
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

def safe(s: str) -> str:
    return re.sub(r"['\"\\\x00]", '', str(s))

def handler(event: dict, context) -> dict:
    """Загрузка аудиофайла и обложки трека в S3, сохранение метаданных в БД"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    user_id = body.get('user_id')
    title = safe(body.get('title', ''))
    artist = safe(body.get('artist', ''))
    genre = safe(body.get('genre', 'Other'))
    description = safe(body.get('description', ''))
    duration = int(body.get('duration') or 0)
    audio_b64 = body.get('audio_b64', '')
    audio_mime = body.get('audio_mime', 'audio/mpeg')
    cover_b64 = body.get('cover_b64', '')
    cover_mime = body.get('cover_mime', 'image/jpeg')

    if not user_id or not title or not artist or not audio_b64:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': 'Заполните все обязательные поля'})
        }

    s3 = s3_client()
    uid = str(uuid.uuid4())

    ext_map = {
        'audio/mpeg': 'mp3', 'audio/mp3': 'mp3',
        'audio/wav': 'wav', 'audio/ogg': 'ogg', 'audio/flac': 'flac',
        'audio/x-m4a': 'm4a', 'audio/mp4': 'm4a',
    }
    audio_ext = ext_map.get(audio_mime, 'mp3')
    audio_key = f"tracks/{uid}/audio.{audio_ext}"
    audio_data = base64.b64decode(audio_b64)
    s3.put_object(Bucket='files', Key=audio_key, Body=audio_data, ContentType=audio_mime)
    audio_url = cdn_url(audio_key)

    cover_url = ''
    if cover_b64:
        cover_ext = 'jpg' if 'jpeg' in cover_mime else cover_mime.split('/')[-1]
        cover_key = f"tracks/{uid}/cover.{cover_ext}"
        cover_data = base64.b64decode(cover_b64)
        s3.put_object(Bucket='files', Key=cover_key, Body=cover_data, ContentType=cover_mime)
        cover_url = cdn_url(cover_key)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.tracks
            (user_id, title, artist, genre, description, duration, audio_url, cover_url)
            VALUES ({int(user_id)}, '{title}', '{artist}', '{genre}', '{description}', {duration}, '{audio_url}', '{cover_url}')
            RETURNING id"""
    )
    track_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'ok': True,
            'track': {
                'id': track_id,
                'title': title,
                'artist': artist,
                'genre': genre,
                'audio_url': audio_url,
                'cover_url': cover_url,
                'duration': duration,
            }
        })
    }
