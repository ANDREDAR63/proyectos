export const presets = [
  {
    id: 'react-card',
    language: 'JavaScript · React',
    name: 'Componente React',
    code: `export default function Card({ title, children }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>{children}</p>
    </article>
  );
}
`,
  },
  {
    id: 'js-fetch',
    language: 'JavaScript',
    name: 'Fetch asíncrono',
    code: `async function fetchUsers(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const users = await response.json();
  return users.filter((user) => user.active);
}
`,
  },
  {
    id: 'python-fib',
    language: 'Python',
    name: 'Generador Fibonacci',
    code: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


print(list(fibonacci(10)))
`,
  },
  {
    id: 'java-controller',
    language: 'Java · Spring Boot',
    name: 'Controlador REST',
    code: `@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> findAll() {
        return service.findAll();
    }
}
`,
  },
  {
    id: 'php-laravel',
    language: 'PHP · Laravel',
    name: 'Controlador Laravel',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    public function index()
    {
        return Post::latest()->paginate(10);
    }
}
`,
  },
  {
    id: 'css-flex',
    language: 'HTML · CSS',
    name: 'Flexbox + HTML',
    code: `<div class="flex items-center justify-between gap-4">
  <h1 class="text-2xl font-bold">CodeTyping</h1>
  <button class="rounded bg-blue-600 px-4 py-2">
    Empezar
  </button>
</div>
`,
  },
]
