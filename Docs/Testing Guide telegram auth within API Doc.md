# Testing Telegram Authentication Without a Frontend

Telegram Mini Apps pass user parameters (`id`, `username`, `first_name`, `auth_date`) signed with your Bot Token as a raw query string called `initData`. 

Because your Bot Token is configured in your `backend/.env` file, you can construct a **real, cryptographically valid** `init_data` string for any test Telegram user and test your authentication endpoints directly in **Swagger UI**.

---

## Step-by-Step Testing Guide via Swagger UI

### Step 1: Generate a Signed `init_data` String
Run this one-line Python command in your terminal to generate a fresh, cryptographically valid `init_data` string signed by your test bot token:

```bash
backend/.venv/bin/python -c "
import hashlib, hmac, json, time, urllib.parse

bot_token = '8763906329:AAHAPAwWeBmNWWSrgZgWmRSM9HsQAMf4fZw'
user_info = {'id': 987654321, 'first_name': 'Abebe', 'last_name': 'Bikila', 'username': 'abebebikila'}
params = {
    'query_id': 'AAHdFBwAAAAAAI4UHBV4z4g-',
    'user': json.dumps(user_info, separators=(',', ':')),
    'auth_date': str(int(time.time())),
}
data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(params.items()))
secret_key = hmac.new(b'WebAppData', bot_token.encode('utf-8'), hashlib.sha256).digest()
params['hash'] = hmac.new(secret_key, data_check_string.encode('utf-8'), hashlib.sha256).hexdigest()
print(urllib.parse.urlencode(params))
"
```

Copy the generated `query_id=...&user=...&auth_date=...&hash=...` string from your terminal output.

---

### Step 2: Test `POST /api/v1/auth/telegram` in Swagger UI
1. Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.
2. Expand the `POST /api/v1/auth/telegram` route under the **Authentication** category.
3. Click **"Try it out"**.
4. Paste the generated `init_data` string into the JSON request body:

```json
{
  "init_data": "PASTE_YOUR_GENERATED_INIT_DATA_STRING_HERE"
}
```

5. Click **Execute**.

#### Expected Result (`200 OK`)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "eac9bb84-3646-4a45-b047-b93323c3b584",
    "telegram_user_id": 987654321,
    "username": "abebebikila",
    "role": "EMPLOYEE",
    "status": "ACTIVE",
    "has_employee_profile": false,
    "has_employer_profile": false
  }
}
```

---

### Step 3: Test Protected Endpoint `GET /api/v1/users/me`
1. Copy the `access_token` string returned from Step 2.
2. At the top right of the Swagger UI page, click the green **"Authorize"** button.
3. Paste your token into the **Value** box and click **Authorize**.
4. Expand the `GET /api/v1/users/me` route under the **Users** category, click **"Try it out"**, and click **Execute**.

#### Expected Result (`200 OK`)
Returns your authenticated user profile details!