import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { CardComponent } from '../components/ui/card.component';
import { SwitchComponent } from '../components/ui/switch.component';
import { ModalComponent } from '../components/ui/modal.component';
import { TooltipDirective } from '../components/ui/tooltip.directive';

interface UserRow {
  id: number; name: string; email: string; phone: string;
  role: string; status: string; date: string; color: string;
}
interface ProductRow {
  id: number; name: string; category: string; price: number; stock: number; rating: number;
  active: boolean; icon: string; color: string; description: string; sku: string;
  supplier: string; weight: string; createdAt: string; sales: number;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CardComponent, SwitchComponent, ModalComponent, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <!-- Users -->
      <app-card title="Gerenciamento de Usuários" icon="mdi-account-group">
        <ng-template #toolbar>
          <div class="tx-table-toolbar">
            <div class="tx-table-search">
              <div class="control has-icons-left">
                <input class="input is-small" [(ngModel)]="search" name="search" placeholder="Buscar..." />
                <span class="icon is-small is-left"><i class="mdi mdi-magnify"></i></span>
              </div>
            </div>
            <button class="button is-small is-primary" (click)="openAddModal()">
              <span class="mdi mdi-plus" style="margin-right:0.25rem;"></span>Novo
            </button>
            <button class="button is-small is-light">
              <span class="mdi mdi-download" style="margin-right:0.25rem;"></span>Exportar
            </button>
          </div>
        </ng-template>

        <div *ngIf="checkedRows().length > 0" class="tx-bulk-bar">
          <span class="tx-bulk-count">
            <span class="mdi mdi-checkbox-multiple-marked"></span>
            {{ checkedRows().length }} selecionado{{ checkedRows().length > 1 ? 's' : '' }}
          </span>
          <button class="button is-small is-danger is-outlined" (click)="bulkDelete()">
            <span class="mdi mdi-delete" style="margin-right:0.25rem;"></span>Excluir selecionados
          </button>
          <button class="button is-small is-light" (click)="checkedRows.set([])">
            <span class="mdi mdi-close" style="margin-right:0.25rem;"></span>Limpar seleção
          </button>
        </div>

        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th><input type="checkbox" [checked]="allChecked()" (change)="toggleAll($event)" /></th>
                <th (click)="sortUsers('id')" style="cursor: pointer;">#</th>
                <th (click)="sortUsers('name')" style="cursor: pointer;">Nome</th>
                <th (click)="sortUsers('email')" style="cursor: pointer;">E-mail</th>
                <th (click)="sortUsers('role')" style="cursor: pointer;">Perfil</th>
                <th class="has-text-centered">Status</th>
                <th>Cadastro</th>
                <th class="has-text-centered">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of pagedUsers()">
                <td><input type="checkbox" [checked]="isChecked(row)" (change)="toggleRow(row, $event)" /></td>
                <td><span class="tx-row-id">#{{ row.id }}</span></td>
                <td>
                  <div class="tx-row-name">
                    <div class="tx-row-avatar" [style.--avatar-color]="row.color">{{ row.name[0] }}</div>
                    {{ row.name }}
                  </div>
                </td>
                <td><a [href]="'mailto:' + row.email" style="color: var(--tx-text);">{{ row.email }}</a></td>
                <td><span class="tag is-light">{{ row.role }}</span></td>
                <td class="has-text-centered">
                  <span class="tag" [class]="row.status === 'Ativo' ? 'is-success is-light' : 'is-danger is-light'">
                    <span class="mdi" [class]="row.status === 'Ativo' ? 'mdi-check-circle' : 'mdi-close-circle'"></span>
                    {{ row.status }}
                  </span>
                </td>
                <td>{{ row.date }}</td>
                <td>
                  <div class="tx-row-actions">
                    <button class="button is-small is-info is-outlined" appTooltip="Editar" (click)="openEditModal(row)">
                      <span class="mdi mdi-pencil"></span>
                    </button>
                    <button class="button is-small is-danger is-outlined" appTooltip="Excluir" (click)="openDeleteModal(row)">
                      <span class="mdi mdi-delete"></span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredUsers().length === 0">
                <td colspan="8">
                  <div class="tx-table-empty">
                    <span class="mdi mdi-magnify tx-table-empty-icon"></span>
                    Nenhum resultado encontrado
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="tx-table-footer">
          <span class="tx-table-count">
            Exibindo {{ filteredUsers().length }} de {{ usersData().length }} registros
          </span>
          <div class="field" style="margin: 0;">
            <div class="select is-small">
              <select [(ngModel)]="perPageUsers" name="perPage">
                <option [ngValue]="5">5 por página</option>
                <option [ngValue]="10">10 por página</option>
                <option [ngValue]="20">20 por página</option>
              </select>
            </div>
          </div>
          <nav class="pagination is-small" *ngIf="totalPages() > 1">
            <button class="pagination-previous" [disabled]="currentPageUsers() === 1" (click)="currentPageUsers.set(currentPageUsers() - 1)">Anterior</button>
            <button class="pagination-next" [disabled]="currentPageUsers() === totalPages()" (click)="currentPageUsers.set(currentPageUsers() + 1)">Próximo</button>
            <ul class="pagination-list">
              <li *ngFor="let p of pages()">
                <button class="pagination-link" [class.is-current]="p === currentPageUsers()" (click)="currentPageUsers.set(p)">{{ p }}</button>
              </li>
            </ul>
          </nav>
        </div>
      </app-card>

      <!-- Products -->
      <app-card title="Catálogo de Produtos" icon="mdi-package-variant" style="margin-top: 1rem; display: block;">
        <ng-template #toolbar>
          <div class="tx-table-toolbar">
            <div class="tx-table-search">
              <div class="control has-icons-left">
                <input class="input is-small" [(ngModel)]="productSearch" name="productSearch" placeholder="Buscar produto..." />
                <span class="icon is-small is-left"><i class="mdi mdi-magnify"></i></span>
              </div>
            </div>
            <div class="select is-small">
              <select [(ngModel)]="productCategory" name="productCategory">
                <option value="">Todas</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Periférico">Periférico</option>
                <option value="Acessório">Acessório</option>
              </select>
            </div>
          </div>
        </ng-template>

        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th style="width: 30px;"></th>
                <th>Produto</th>
                <th>Categoria</th>
                <th class="has-text-right">Preço</th>
                <th class="has-text-centered">Estoque</th>
                <th class="has-text-centered">Avaliação</th>
                <th class="has-text-centered">Status</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let row of filteredProducts()">
                <tr (click)="toggleDetail(row.id)" style="cursor:pointer;">
                  <td><span class="mdi" [class]="expandedRow() === row.id ? 'mdi-chevron-up' : 'mdi-chevron-right'"></span></td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span class="mdi" [class]="row.icon" [style.color]="row.color" style="font-size: 1.3rem;"></span>
                      <span style="font-weight: 500;">{{ row.name }}</span>
                    </div>
                  </td>
                  <td><span class="tag is-info is-light">{{ row.category }}</span></td>
                  <td class="has-text-right"><strong>R$ {{ row.price.toFixed(2) }}</strong></td>
                  <td class="has-text-centered">
                    <span class="tag" [class]="row.stock > 10 ? 'is-success is-light' : row.stock > 0 ? 'is-warning is-light' : 'is-danger is-light'">
                      {{ row.stock > 0 ? row.stock + ' un.' : 'Esgotado' }}
                    </span>
                  </td>
                  <td class="has-text-centered">
                    <div class="tx-rate is-small is-disabled" style="justify-content: center;">
                      <span *ngFor="let star of [1,2,3,4,5]" class="mdi mdi-star tx-star" [class.is-filled]="star <= row.rating"></span>
                    </div>
                  </td>
                  <td class="has-text-centered" (click)="$event.stopPropagation()">
                    <app-switch type="is-success" size="is-small" [value]="row.active" (valueChange)="row.active = $event"></app-switch>
                  </td>
                </tr>
                <tr *ngIf="expandedRow() === row.id">
                  <td colspan="7" class="tx-detail-row">
                    <div class="tx-detail-grid">
                      <div><p class="tx-detail-label">Descrição</p><p class="tx-detail-value">{{ row.description }}</p></div>
                      <div><p class="tx-detail-label">SKU</p><p class="tx-detail-value">{{ row.sku }}</p></div>
                      <div><p class="tx-detail-label">Fornecedor</p><p class="tx-detail-value">{{ row.supplier }}</p></div>
                      <div><p class="tx-detail-label">Peso</p><p class="tx-detail-value">{{ row.weight }}</p></div>
                      <div><p class="tx-detail-label">Cadastrado em</p><p class="tx-detail-value">{{ row.createdAt }}</p></div>
                      <div><p class="tx-detail-label">Vendas</p><p class="tx-detail-value">{{ row.sales }} unidades</p></div>
                    </div>
                  </td>
                </tr>
              </ng-container>
              <tr *ngIf="filteredProducts().length === 0">
                <td colspan="7">
                  <div class="tx-table-empty">
                    <span class="mdi mdi-package-variant tx-table-empty-icon"></span>
                    Nenhum produto encontrado
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>

      <!-- User Modal -->
      <app-modal [open]="showUserModal()" (openChange)="showUserModal.set($event)" width="480px">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ editingUser() ? 'Editar Usuário' : 'Novo Usuário' }}</p>
          <button class="delete" (click)="showUserModal.set(false)"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Nome</label>
            <div class="control has-icons-left">
              <input class="input" [class.is-danger]="!userForm.name" name="uname" [(ngModel)]="userForm.name" placeholder="Nome completo" />
              <span class="icon is-small is-left"><i class="mdi mdi-account"></i></span>
            </div>
            <p *ngIf="!userForm.name" class="help is-danger">Nome obrigatório</p>
          </div>
          <div class="field">
            <label class="label">E-mail</label>
            <div class="control has-icons-left">
              <input class="input" type="email" [class.is-danger]="!userForm.email" name="uemail" [(ngModel)]="userForm.email" placeholder="email@exemplo.com" />
              <span class="icon is-small is-left"><i class="mdi mdi-email"></i></span>
            </div>
            <p *ngIf="!userForm.email" class="help is-danger">E-mail obrigatório</p>
          </div>
          <div class="field">
            <label class="label">Telefone</label>
            <div class="control has-icons-left">
              <input class="input" name="uphone" [(ngModel)]="userForm.phone" placeholder="(11) 99999-9999" />
              <span class="icon is-small is-left"><i class="mdi mdi-phone"></i></span>
            </div>
          </div>
          <div class="field">
            <label class="label">Perfil</label>
            <div class="control has-icons-left">
              <div class="select is-fullwidth">
                <select [(ngModel)]="userForm.role" name="urole">
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Operador">Operador</option>
                  <option value="Visualizador">Visualizador</option>
                </select>
              </div>
              <span class="icon is-small is-left"><i class="mdi mdi-account-cog"></i></span>
            </div>
          </div>
          <div class="field">
            <label class="label">Status</label>
            <app-switch type="is-success" [value]="userForm.active" (valueChange)="userForm.active = $event">
              {{ userForm.active ? 'Ativo' : 'Inativo' }}
            </app-switch>
          </div>
        </section>
        <footer class="modal-card-foot tx-modal-foot">
          <button class="button" (click)="showUserModal.set(false)">Cancelar</button>
          <button class="button is-primary" (click)="saveUser()">
            <span class="mdi mdi-content-save" style="margin-right:0.25rem;"></span>
            Salvar
          </button>
        </footer>
      </app-modal>

      <!-- Delete confirmation -->
      <app-modal [open]="showDeleteModal()" (openChange)="showDeleteModal.set($event)" width="400px">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirmar exclusão</p>
        </header>
        <section class="modal-card-body">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <span class="mdi mdi-alert-circle" style="font-size: 2rem; color: var(--tx-danger); flex-shrink: 0;"></span>
            <div>
              <p style="font-size: 0.9rem; font-weight: 600; color: var(--tx-text-heading);">
                Excluir "{{ deletingUser()?.name }}"?
              </p>
              <p style="font-size: 0.875rem; color: var(--tx-text-muted); margin-top: 0.5rem;">
                Esta ação não pode ser desfeita. O usuário será removido permanentemente.
              </p>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot tx-modal-foot">
          <button class="button" (click)="showDeleteModal.set(false)">Cancelar</button>
          <button class="button is-danger" (click)="confirmDelete()">
            <span class="mdi mdi-delete" style="margin-right:0.25rem;"></span>
            Excluir
          </button>
        </footer>
      </app-modal>
    </div>
  `,
})
export class TablesComponent {
  readonly ui = inject(UiService);

  search = '';
  perPageUsers = 10;
  productSearch = '';
  productCategory = '';

  readonly currentPageUsers = signal<number>(1);
  readonly showUserModal = signal<boolean>(false);
  readonly showDeleteModal = signal<boolean>(false);
  readonly editingUser = signal<UserRow | null>(null);
  readonly deletingUser = signal<UserRow | null>(null);
  readonly checkedRows = signal<UserRow[]>([]);
  readonly expandedRow = signal<number | null>(null);
  readonly sortField = signal<string>('id');
  readonly sortDir = signal<1 | -1>(1);

  userForm = { name: '', email: '', phone: '', role: 'Operador', active: true };

  readonly avatarColors = ['#485fc7', '#48c774', '#3273dc', '#f59e0b', '#f14668', '#9b59b6', '#1abc9c', '#e67e22'];
  readonly namesData = ['João Silva', 'Maria Santos', 'Carlos Lima', 'Ana Costa', 'Pedro Oliveira', 'Lucia Fernandes', 'Roberto Alves', 'Fernanda Ramos', 'Thiago Souza', 'Camila Barbosa', 'Diego Martins', 'Beatriz Carvalho', 'Rodrigo Pereira', 'Juliana Rocha', 'Marcelo Gomes', 'Patricia Teixeira', 'Anderson Lima', 'Renata Moreira', 'Felipe Nascimento', 'Claudia Ribeiro'];
  readonly handles = ['joao', 'maria', 'carlos', 'ana', 'pedro', 'lucia', 'roberto', 'fernanda', 'thiago', 'camila', 'diego', 'beatriz', 'rodrigo', 'juliana', 'marcelo', 'patricia', 'anderson', 'renata', 'felipe', 'claudia'];
  readonly phones = ['(11) 98765-4321', '(21) 99876-5432', '(41) 97654-3210', '(31) 96543-2109', '(51) 95432-1098', '(71) 94321-0987', '(85) 93210-9876', '(92) 92109-8765', '(81) 91098-7654', '(11) 90987-6543', '(21) 89876-5432', '(41) 88765-4321', '(31) 87654-3210', '(51) 86543-2109', '(11) 85432-1098', '(21) 84321-0987', '(41) 83210-9876', '(31) 82109-8765', '(51) 81098-7654', '(11) 80987-6543'];

  readonly usersData = signal<UserRow[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: this.namesData[i],
      email: this.handles[i] + '@empresa.com',
      phone: this.phones[i],
      role: ['Administrador', 'Gerente', 'Operador', 'Visualizador', 'Operador'][i % 5],
      status: i % 5 === 3 ? 'Inativo' : 'Ativo',
      date: `${String((i % 28) + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/2025`,
      color: this.avatarColors[i % this.avatarColors.length],
    }))
  );

  readonly filteredUsers = computed(() => {
    let rows = this.usersData();
    const q = this.search.toLowerCase();
    if (q) {
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.role.toLowerCase().includes(q));
    }
    const f = this.sortField();
    const dir = this.sortDir();
    rows = [...rows].sort((a: any, b: any) => {
      const av = a[f], bv = b[f];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return rows;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredUsers().length / this.perPageUsers)));

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly pagedUsers = computed(() => {
    const page = this.currentPageUsers();
    const per = this.perPageUsers;
    return this.filteredUsers().slice((page - 1) * per, page * per);
  });

  readonly allChecked = computed(() => {
    const paged = this.pagedUsers();
    const checked = this.checkedRows();
    return paged.length > 0 && paged.every((r) => checked.some((c) => c.id === r.id));
  });

  sortUsers(field: string): void {
    if (this.sortField() === field) this.sortDir.set(this.sortDir() === 1 ? -1 : 1);
    else { this.sortField.set(field); this.sortDir.set(1); }
  }

  isChecked(row: UserRow): boolean {
    return this.checkedRows().some((r) => r.id === row.id);
  }

  toggleRow(row: UserRow, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) this.checkedRows.update((arr) => [...arr, row]);
    else this.checkedRows.update((arr) => arr.filter((r) => r.id !== row.id));
  }

  toggleAll(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    const paged = this.pagedUsers();
    if (checked) {
      this.checkedRows.update((arr) => {
        const next = [...arr];
        paged.forEach((r) => { if (!next.some((c) => c.id === r.id)) next.push(r); });
        return next;
      });
    } else {
      const ids = new Set(paged.map((r) => r.id));
      this.checkedRows.update((arr) => arr.filter((r) => !ids.has(r.id)));
    }
  }

  openAddModal(): void {
    this.editingUser.set(null);
    this.userForm = { name: '', email: '', phone: '', role: 'Operador', active: true };
    this.showUserModal.set(true);
  }

  openEditModal(row: UserRow): void {
    this.editingUser.set(row);
    this.userForm = { name: row.name, email: row.email, phone: row.phone, role: row.role, active: row.status === 'Ativo' };
    this.showUserModal.set(true);
  }

  openDeleteModal(row: UserRow): void {
    this.deletingUser.set(row);
    this.showDeleteModal.set(true);
  }

  saveUser(): void {
    if (!this.userForm.name || !this.userForm.email) return;
    const editing = this.editingUser();
    if (editing) {
      this.usersData.update((arr) =>
        arr.map((r) =>
          r.id === editing.id
            ? { ...r, name: this.userForm.name, email: this.userForm.email, phone: this.userForm.phone, role: this.userForm.role, status: this.userForm.active ? 'Ativo' : 'Inativo' }
            : r
        )
      );
      this.ui.notifySuccess('Usuário atualizado!');
    } else {
      this.usersData.update((arr) => [
        ...arr,
        {
          id: arr.length + 1,
          name: this.userForm.name,
          email: this.userForm.email,
          phone: this.userForm.phone,
          role: this.userForm.role,
          status: this.userForm.active ? 'Ativo' : 'Inativo',
          date: new Date().toLocaleDateString('pt-BR'),
          color: this.avatarColors[arr.length % this.avatarColors.length],
        },
      ]);
      this.ui.notifySuccess('Usuário criado!');
    }
    this.showUserModal.set(false);
  }

  confirmDelete(): void {
    const u = this.deletingUser();
    if (!u) return;
    this.usersData.update((arr) => arr.filter((r) => r.id !== u.id));
    this.checkedRows.update((arr) => arr.filter((r) => r.id !== u.id));
    this.showDeleteModal.set(false);
    this.ui.notifySuccess('Usuário excluído!');
  }

  bulkDelete(): void {
    const ids = new Set(this.checkedRows().map((r) => r.id));
    this.usersData.update((arr) => arr.filter((r) => !ids.has(r.id)));
    const count = this.checkedRows().length;
    this.checkedRows.set([]);
    this.ui.notifySuccess(`${count} usuário${count > 1 ? 's' : ''} excluído${count > 1 ? 's' : ''}!`);
  }

  // ─── Products ─────────────────────────────────────────────
  readonly productsData = signal<ProductRow[]>([
    { id: 1, name: 'Teclado Mecânico', category: 'Periférico', price: 459.90, stock: 23, rating: 5, active: true, icon: 'mdi-keyboard', color: '#485fc7', description: 'Teclado mecânico com switches Blue, retroiluminação RGB e layout ABNT2.', sku: 'TECL-MEC-001', supplier: 'TechBrasil', weight: '980g', createdAt: '10/01/2025', sales: 142 },
    { id: 2, name: 'Monitor 27" 4K', category: 'Hardware', price: 2199.90, stock: 8, rating: 5, active: true, icon: 'mdi-monitor', color: '#3273dc', description: 'Monitor IPS 4K com 144Hz, HDR400 e resposta de 1ms. Ideal para design e jogos.', sku: 'MON-27-4K-002', supplier: 'DisplayTech', weight: '5.2kg', createdAt: '15/01/2025', sales: 67 },
    { id: 3, name: 'Mouse Sem Fio', category: 'Periférico', price: 189.90, stock: 45, rating: 4, active: true, icon: 'mdi-mouse', color: '#48c774', description: 'Mouse wireless com DPI ajustável até 4800, bateria de 12 meses e receptor USB.', sku: 'MOUS-WL-003', supplier: 'TechBrasil', weight: '95g', createdAt: '20/01/2025', sales: 289 },
    { id: 4, name: 'SSD NVMe 1TB', category: 'Hardware', price: 399.90, stock: 0, rating: 5, active: false, icon: 'mdi-harddisk', color: '#f59e0b', description: 'SSD NVMe PCIe 4.0 com velocidade de leitura de 7000MB/s e escrita de 6500MB/s.', sku: 'SSD-NVMe-004', supplier: 'StoragePro', weight: '8g', createdAt: '25/01/2025', sales: 198 },
    { id: 5, name: 'Headset USB', category: 'Periférico', price: 299.90, stock: 15, rating: 4, active: true, icon: 'mdi-headset', color: '#9b59b6', description: 'Headset USB com microfone retrátil, drivers de 50mm e cancelamento de ruído passivo.', sku: 'HEAD-USB-005', supplier: 'AudioMax', weight: '320g', createdAt: '01/02/2025', sales: 94 },
    { id: 6, name: 'Suporte para Notebook', category: 'Acessório', price: 129.90, stock: 67, rating: 3, active: true, icon: 'mdi-laptop', color: '#1abc9c', description: 'Suporte ergonômico em alumínio para notebooks de 11 a 17 polegadas. Refrigeração passiva.', sku: 'SUP-NB-006', supplier: 'ErgoPro', weight: '650g', createdAt: '05/02/2025', sales: 213 },
    { id: 7, name: 'Licença Office 365', category: 'Software', price: 599.00, stock: 999, rating: 4, active: true, icon: 'mdi-microsoft-office', color: '#e67e22', description: 'Licença anual para 1 usuário com acesso a Word, Excel, PowerPoint, Teams e 1TB de OneDrive.', sku: 'OFF-365-007', supplier: 'Microsoft BR', weight: 'N/A', createdAt: '10/02/2025', sales: 445 },
    { id: 8, name: 'Webcam Full HD', category: 'Periférico', price: 249.90, stock: 5, rating: 4, active: true, icon: 'mdi-webcam', color: '#e74c3c', description: 'Webcam 1080p30fps com microfone estéreo embutido, autofoco e compatível com Windows/Mac/Linux.', sku: 'WEB-FHD-008', supplier: 'VideoTech', weight: '180g', createdAt: '15/02/2025', sales: 156 },
    { id: 9, name: 'Hub USB-C 7 em 1', category: 'Acessório', price: 179.90, stock: 32, rating: 5, active: true, icon: 'mdi-usb-port', color: '#2c3e50', description: 'Hub USB-C com HDMI 4K, 3x USB-A 3.0, SD/MicroSD, USB-C PD 87W. Alumínio escovado.', sku: 'HUB-7IN1-009', supplier: 'ConnectMax', weight: '72g', createdAt: '20/02/2025', sales: 327 },
    { id: 10, name: 'Mousepad XL', category: 'Acessório', price: 89.90, stock: 88, rating: 4, active: true, icon: 'mdi-surface-usb', color: '#27ae60', description: 'Mousepad extra large 900x400mm com base antiderrapante e bordas costuradas.', sku: 'MPAD-XL-010', supplier: 'GamerGear', weight: '450g', createdAt: '01/03/2025', sales: 512 },
  ]);

  readonly filteredProducts = computed(() => {
    return this.productsData().filter((p) => {
      const matchSearch = !this.productSearch || p.name.toLowerCase().includes(this.productSearch.toLowerCase());
      const matchCat = !this.productCategory || p.category === this.productCategory;
      return matchSearch && matchCat;
    });
  });

  toggleDetail(id: number): void {
    this.expandedRow.update((cur) => (cur === id ? null : id));
  }
}
