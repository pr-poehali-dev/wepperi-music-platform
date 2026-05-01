import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p31823890_wepperi_music_platfo')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

def make_token(user_id: int) -> str:
    return hashlib.sha256(f"{user_id}{secrets.token_hex(16)}".encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей Wavely"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if action == 'register':
            name = (body.get('name') or '').strip()
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            if not name or not email or not password:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}
            if len(password) < 6:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}'")
            if cur.fetchone():
                return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}

            salt = secrets.token_hex(16)
            pwd_hash = hash_password(password, salt)
            stored = f"{salt}:{pwd_hash}"

            cur.execute(
                f"INSERT INTO {SCHEMA}.users (name, email, password_hash) VALUES ('{name}', '{email}', '{stored}') RETURNING id"
            )
            user_id = cur.fetchone()[0]
            conn.commit()

            token = make_token(user_id)
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'ok': True,
                    'token': token,
                    'user': {'id': user_id, 'name': name, 'email': email}
                })
            }

        elif action == 'login':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            if not email or not password:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Введите email и пароль'})}

            cur.execute(f"SELECT id, name, email, password_hash FROM {SCHEMA}.users WHERE email = '{email}'")
            row = cur.fetchone()

            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            user_id, name, user_email, stored = row
            salt, pwd_hash = stored.split(':', 1)

            if hash_password(password, salt) != pwd_hash:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            token = make_token(user_id)
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'ok': True,
                    'token': token,
                    'user': {'id': user_id, 'name': name, 'email': user_email}
                })
            }

        else:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неизвестное действие'})}

    finally:
        cur.close()
        conn.close()
