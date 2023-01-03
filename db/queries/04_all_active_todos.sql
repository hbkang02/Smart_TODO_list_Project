UPDATE todos
  SET is_active = false
  WHERE user_id = 1
  AND todos.id = 1;

