DROP TABLE IF EXISTS todos CASCADE;
CREATE TABLE todos (
  id SERIAL PRIMARY KEY NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  todo_name VARCHAR(255) NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_date TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
)