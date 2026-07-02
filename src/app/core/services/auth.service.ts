import { Injectable, computed, signal } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const STORAGE_KEY = 'app.auth';

const MOCK_USERS = [
  { id: 1, email: 'admin@template.com', password: 'admin123', name: 'Admin Usuário', role: 'Administrador' },
  { id: 2, email: 'user@template.com', password: 'user123', name: 'Usuário Comum', role: 'Operador' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.restore());
  readonly isAuthenticated = computed(() => this.user() !== null);

  async login(email: string, password: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 600));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const u: User = { id: found.id, name: found.name, email: found.email, role: found.role };
    this.user.set(u);
    this.persist();
    return true;
  }

  logout(): void {
    this.user.set(null);
    this.persist();
  }

  updateProfile(patch: Partial<User>): void {
    const cur = this.user();
    if (!cur) return;
    this.user.set({ ...cur, ...patch });
    this.persist();
  }

  private persist(): void {
    try {
      const u = this.user();
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private restore(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
