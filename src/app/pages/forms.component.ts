import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { CardComponent } from '../components/ui/card.component';
import { SwitchComponent } from '../components/ui/switch.component';

interface FormErrors { name: string; email: string; password: string; profile: string; }

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CardComponent, SwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="columns">
      <div class="column is-8">
        <app-card title="Formulários" icon="mdi-form-select">
          <!-- Tabs header -->
          <div class="tabs is-boxed is-small">
            <ul>
              <li *ngFor="let tab of tabs; let i = index" [class.is-active]="activeTab() === i">
                <a (click)="activeTab.set(i)">
                  <span class="icon is-small"><i class="mdi" [class]="tab.icon"></i></span>
                  <span>{{ tab.label }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Tab 1: Cadastro -->
          <div *ngIf="activeTab() === 0">
            <form (ngSubmit)="handleSubmit()">
              <p class="tx-section-divider">Informações Pessoais</p>
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Nome completo *</label>
                    <div class="control has-icons-left">
                      <input class="input" [class.is-danger]="errors().name" name="name" [(ngModel)]="form.name" placeholder="Digite o nome" />
                      <span class="icon is-small is-left"><i class="mdi mdi-account"></i></span>
                    </div>
                    <p *ngIf="errors().name" class="help is-danger">{{ errors().name }}</p>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">E-mail *</label>
                    <div class="control has-icons-left">
                      <input class="input" type="email" [class.is-danger]="errors().email" name="email" [(ngModel)]="form.email" placeholder="email@exemplo.com" />
                      <span class="icon is-small is-left"><i class="mdi mdi-email"></i></span>
                    </div>
                    <p *ngIf="errors().email" class="help is-danger">{{ errors().email }}</p>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Telefone</label>
                    <div class="control has-icons-left">
                      <input class="input" name="phone" [(ngModel)]="form.phone" placeholder="(11) 99999-9999" />
                      <span class="icon is-small is-left"><i class="mdi mdi-phone"></i></span>
                    </div>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Data de nascimento</label>
                    <div class="control has-icons-left">
                      <input class="input" type="date" name="birthdate" [(ngModel)]="form.birthdate" />
                      <span class="icon is-small is-left"><i class="mdi mdi-calendar"></i></span>
                    </div>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Cidade</label>
                    <div class="control has-icons-left">
                      <input class="input" name="city" [(ngModel)]="form.city" placeholder="Digite uma cidade..." list="city-list" />
                      <span class="icon is-small is-left"><i class="mdi mdi-map-marker"></i></span>
                      <datalist id="city-list">
                        <option *ngFor="let c of cities" [value]="c"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
                <div class="column is-12">
                  <div class="field">
                    <label class="label">Biografia</label>
                    <textarea class="textarea" rows="3" maxlength="300" name="bio" [(ngModel)]="form.bio" placeholder="Fale um pouco sobre você..."></textarea>
                    <p class="help has-text-right">{{ form.bio.length }} / 300</p>
                  </div>
                </div>
              </div>

              <p class="tx-section-divider">Conta & Acesso</p>
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Senha *</label>
                    <div class="control has-icons-left">
                      <input class="input" type="password" [class.is-danger]="errors().password" name="password" [(ngModel)]="form.password" placeholder="Mínimo 8 caracteres" />
                      <span class="icon is-small is-left"><i class="mdi mdi-lock"></i></span>
                    </div>
                    <p *ngIf="errors().password" class="help is-danger">{{ errors().password }}</p>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Perfil *</label>
                    <div class="control has-icons-left">
                      <div class="select is-fullwidth" [class.is-danger]="errors().profile">
                        <select name="profile" [(ngModel)]="form.profile">
                          <option value="">-- Selecione --</option>
                          <option value="admin">Administrador</option>
                          <option value="manager">Gerente</option>
                          <option value="operator">Operador</option>
                          <option value="viewer">Visualizador</option>
                        </select>
                      </div>
                      <span class="icon is-small is-left"><i class="mdi mdi-account-cog"></i></span>
                    </div>
                    <p *ngIf="errors().profile" class="help is-danger">{{ errors().profile }}</p>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Horário de trabalho</label>
                    <div class="control has-icons-left">
                      <input class="input" type="time" name="workTime" [(ngModel)]="form.workTime" />
                      <span class="icon is-small is-left"><i class="mdi mdi-clock"></i></span>
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Tag de interesse</label>
                    <div class="control has-icons-left">
                      <input class="input" name="tagInput" [(ngModel)]="tagInput" placeholder="Pressione Enter para adicionar" (keydown.enter)="addTag($event)" />
                      <span class="icon is-small is-left"><i class="mdi mdi-label"></i></span>
                    </div>
                    <div style="margin-top: 0.4rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                      <span *ngFor="let t of form.tags; let i = index" class="tag is-primary">
                        {{ t }}
                        <button type="button" class="delete is-small" (click)="removeTag(i)"></button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p class="tx-section-divider">Preferências</p>
              <div class="columns is-multiline">
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Status da conta</label>
                    <app-switch type="is-success" [value]="form.active" (valueChange)="form.active = $event">
                      {{ form.active ? 'Ativo' : 'Inativo' }}
                    </app-switch>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Notificações por e-mail</label>
                    <app-switch type="is-info" [value]="form.notifications" (valueChange)="form.notifications = $event">
                      {{ form.notifications ? 'Habilitado' : 'Desabilitado' }}
                    </app-switch>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Avaliação</label>
                    <div class="tx-rate is-medium">
                      <span
                        *ngFor="let star of [1,2,3,4,5]"
                        class="mdi mdi-star tx-star"
                        [class.is-filled]="star <= form.rating"
                        (click)="form.rating = star"
                      ></span>
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Gênero</label>
                    <div class="tx-radio-group">
                      <label class="radio"><input type="radio" name="gender" value="M" [(ngModel)]="form.gender" /> Masculino</label>
                      <label class="radio"><input type="radio" name="gender" value="F" [(ngModel)]="form.gender" /> Feminino</label>
                      <label class="radio"><input type="radio" name="gender" value="O" [(ngModel)]="form.gender" /> Outro</label>
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Permissões</label>
                    <div class="tx-check-group">
                      <label class="checkbox"><input type="checkbox" (change)="togglePerm('read', $event)" [checked]="form.permissions.includes('read')" /> Leitura</label>
                      <label class="checkbox"><input type="checkbox" (change)="togglePerm('write', $event)" [checked]="form.permissions.includes('write')" /> Escrita</label>
                      <label class="checkbox"><input type="checkbox" (change)="togglePerm('delete', $event)" [checked]="form.permissions.includes('delete')" /> Exclusão</label>
                      <label class="checkbox"><input type="checkbox" (change)="togglePerm('admin', $event)" [checked]="form.permissions.includes('admin')" /> Admin</label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tx-form-actions">
                <button type="submit" class="button is-primary" [class.is-loading]="saving()" [disabled]="saving()">
                  <span class="mdi mdi-content-save" style="margin-right: 0.25rem;"></span>
                  Salvar cadastro
                </button>
                <button type="button" class="button is-light" (click)="handleReset()">
                  <span class="mdi mdi-refresh" style="margin-right: 0.25rem;"></span>
                  Limpar
                </button>
              </div>
            </form>
          </div>

          <!-- Tab 2: Componentes (showcase) -->
          <div *ngIf="activeTab() === 1">
            <p class="tx-section-divider">Inputs — Variantes e Estados</p>
            <div class="tx-showcase-grid">
              <div class="tx-showcase-item">
                <p class="tx-component-label">Padrão com ícone</p>
                <div class="field"><div class="control has-icons-left"><input class="input" placeholder="Digite aqui..." /><span class="icon is-small is-left"><i class="mdi mdi-pencil"></i></span></div></div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Sucesso</p>
                <div class="field"><div class="control has-icons-left"><input class="input is-success" value="valor válido" /><span class="icon is-small is-left"><i class="mdi mdi-check"></i></span></div><p class="help is-success">Campo validado!</p></div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Erro</p>
                <div class="field"><div class="control has-icons-left"><input class="input is-danger" value="" placeholder="Obrigatório" /><span class="icon is-small is-left"><i class="mdi mdi-alert-circle"></i></span></div><p class="help is-danger">Campo obrigatório</p></div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Aviso</p>
                <div class="field"><div class="control has-icons-left"><input class="input is-warning" value="valor?" /><span class="icon is-small is-left"><i class="mdi mdi-alert"></i></span></div><p class="help is-warning">Verifique o valor</p></div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Desabilitado</p>
                <div class="field"><div class="control"><input class="input" disabled value="não editável" /></div></div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Somente leitura</p>
                <div class="field"><div class="control"><input class="input" readonly value="somente leitura" /></div></div>
              </div>
            </div>

            <p class="tx-section-divider">Switches</p>
            <div class="tx-check-group">
              <app-switch [value]="demo.switch1" (valueChange)="demo.switch1 = $event">Padrão</app-switch>
              <app-switch type="is-success" [value]="demo.switch2" (valueChange)="demo.switch2 = $event">Sucesso</app-switch>
              <app-switch type="is-info" [value]="demo.switch3" (valueChange)="demo.switch3 = $event">Info</app-switch>
              <app-switch type="is-warning" [value]="demo.switch4" (valueChange)="demo.switch4 = $event">Aviso</app-switch>
              <app-switch type="is-danger" [value]="demo.switch5" (valueChange)="demo.switch5 = $event">Perigo</app-switch>
              <app-switch [value]="false" [disabled]="true">Desabilitado</app-switch>
              <app-switch size="is-small" [value]="demo.switch6" (valueChange)="demo.switch6 = $event">Pequeno</app-switch>
              <app-switch size="is-large" [value]="demo.switch7" (valueChange)="demo.switch7 = $event">Grande</app-switch>
            </div>

            <p class="tx-section-divider">Slider</p>
            <div class="columns">
              <div class="column is-6">
                <p class="tx-component-label">Volume (0–100)</p>
                <input type="range" min="0" max="100" [(ngModel)]="demo.slider1" name="slider1" style="width:100%; accent-color: var(--tx-primary);" />
                <p class="tx-component-label" style="margin-top:0.5rem;">Valor: {{ demo.slider1 }}</p>
              </div>
              <div class="column is-6">
                <p class="tx-component-label">Orçamento</p>
                <input type="range" min="0" max="10000" step="500" [(ngModel)]="demo.slider2" name="slider2" style="width:100%; accent-color: var(--tx-success);" />
                <p class="tx-component-label" style="margin-top:0.5rem;">R$ {{ demo.slider2.toLocaleString('pt-BR') }}</p>
              </div>
            </div>

            <p class="tx-section-divider">Rate</p>
            <div class="tx-showcase-grid">
              <div class="tx-showcase-item">
                <p class="tx-component-label">5 estrelas</p>
                <div class="tx-rate">
                  <span *ngFor="let star of [1,2,3,4,5]" class="mdi mdi-star tx-star" [class.is-filled]="star <= demo.rate1" (click)="demo.rate1 = star"></span>
                </div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Médio</p>
                <div class="tx-rate is-medium">
                  <span *ngFor="let star of [1,2,3,4,5]" class="mdi mdi-star tx-star" [class.is-filled]="star <= demo.rate2" (click)="demo.rate2 = star"></span>
                </div>
              </div>
              <div class="tx-showcase-item">
                <p class="tx-component-label">Somente leitura</p>
                <div class="tx-rate is-disabled">
                  <span *ngFor="let star of [1,2,3,4,5]" class="mdi mdi-star tx-star" [class.is-filled]="star <= 4"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: Layouts -->
          <div *ngIf="activeTab() === 2">
            <p class="tx-section-divider">Formulário Horizontal</p>
            <div class="tx-layout-demo">
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label">Nome</label></div>
                <div class="field-body"><div class="field"><div class="control"><input class="input" [(ngModel)]="layout.name" name="lname" placeholder="Nome completo" /></div></div></div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label">E-mail</label></div>
                <div class="field-body"><div class="field"><div class="control"><input class="input" type="email" [(ngModel)]="layout.email" name="lemail" placeholder="email@exemplo.com" /></div></div></div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label">Perfil</label></div>
                <div class="field-body"><div class="field"><div class="control"><div class="select is-fullwidth"><select [(ngModel)]="layout.role" name="lrole"><option value="admin">Administrador</option><option value="user">Usuário</option></select></div></div></div></div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label">Ativo</label></div>
                <div class="field-body"><app-switch type="is-success" [value]="layout.active" (valueChange)="layout.active = $event"></app-switch></div>
              </div>
            </div>

            <p class="tx-section-divider">Formulário por Etapas</p>
            <div class="tx-layout-demo">
              <div class="tx-steps">
                <div *ngFor="let s of [1,2,3]" class="tx-step" [class.is-active]="activeStep() === s" [class.is-done]="activeStep() > s">
                  <div class="tx-step-marker">{{ s }}</div>
                  <div class="tx-step-label">{{ stepLabels[s - 1] }}</div>
                </div>
              </div>

              <div *ngIf="activeStep() === 1" style="padding: 1rem 0;">
                <div class="columns">
                  <div class="column is-6"><div class="field"><label class="label">Nome</label><input class="input" [(ngModel)]="wizard.name" name="wname" placeholder="Nome completo" /></div></div>
                  <div class="column is-6"><div class="field"><label class="label">E-mail</label><input class="input" type="email" [(ngModel)]="wizard.email" name="wemail" placeholder="email@exemplo.com" /></div></div>
                </div>
              </div>
              <div *ngIf="activeStep() === 2" style="padding: 1rem 0;">
                <div class="columns">
                  <div class="column is-8"><div class="field"><label class="label">Endereço</label><input class="input" [(ngModel)]="wizard.address" name="waddress" placeholder="Rua, número" /></div></div>
                  <div class="column is-4"><div class="field"><label class="label">Cidade</label><input class="input" [(ngModel)]="wizard.city" name="wcity" placeholder="Cidade" /></div></div>
                </div>
              </div>
              <div *ngIf="activeStep() === 3" style="padding: 1rem 0;">
                <p style="font-size: 0.875rem; color: var(--tx-text-muted);">Confirme os dados antes de finalizar:</p>
                <ul style="margin-top: 0.75rem; font-size: 0.875rem; line-height: 2;">
                  <li><strong>Nome:</strong> {{ wizard.name || '—' }}</li>
                  <li><strong>E-mail:</strong> {{ wizard.email || '—' }}</li>
                  <li><strong>Endereço:</strong> {{ wizard.address || '—' }}</li>
                  <li><strong>Cidade:</strong> {{ wizard.city || '—' }}</li>
                </ul>
              </div>

              <div class="tx-steps-nav">
                <button *ngIf="activeStep() > 1" class="button is-light" (click)="activeStep.set(activeStep() - 1)">
                  <span class="mdi mdi-arrow-left" style="margin-right: 0.25rem;"></span>
                  Anterior
                </button>
                <button *ngIf="activeStep() < 3" class="button is-primary" (click)="activeStep.set(activeStep() + 1)">
                  Próximo
                  <span class="mdi mdi-arrow-right" style="margin-left: 0.25rem;"></span>
                </button>
                <button *ngIf="activeStep() === 3" class="button is-success" (click)="ui.notifySuccess('Cadastro finalizado!')">
                  <span class="mdi mdi-check" style="margin-right: 0.25rem;"></span>
                  Finalizar
                </button>
              </div>
            </div>
          </div>

        </app-card>
      </div>

      <div class="column is-4">
        <app-card title="Dados do Formulário" icon="mdi-code-json">
          <pre class="tx-json-preview">{{ formPreview() }}</pre>
        </app-card>

        <app-card title="Componentes Utilizados" icon="mdi-puzzle" style="margin-top: 1rem; display: block;">
          <div style="font-size: 0.82rem; color: var(--tx-text); line-height: 2;">
            <ul style="list-style: none; padding: 0;">
              <li *ngFor="let comp of componentsUsed">
                <span class="mdi mdi-check-circle" style="color: var(--tx-success); margin-right: 0.4rem;"></span>
                {{ comp }}
              </li>
            </ul>
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class FormsComponent {
  readonly ui = inject(UiService);

  readonly tabs = [
    { label: 'Cadastro', icon: 'mdi-account-plus' },
    { label: 'Componentes', icon: 'mdi-puzzle' },
    { label: 'Layouts', icon: 'mdi-view-dashboard' },
  ];

  readonly activeTab = signal<number>(0);
  readonly activeStep = signal<number>(1);
  readonly saving = signal<boolean>(false);
  readonly errors = signal<FormErrors>({ name: '', email: '', password: '', profile: '' });

  readonly stepLabels = ['Dados Pessoais', 'Endereço', 'Confirmar'];

  form = {
    name: '', email: '', phone: '', birthdate: '', city: '', bio: '',
    password: '', profile: '', workTime: '',
    tags: [] as string[], active: true, notifications: true, rating: 4,
    gender: 'M', permissions: ['read'] as string[],
  };
  tagInput = '';

  demo = {
    switch1: true, switch2: true, switch3: false, switch4: false, switch5: false, switch6: true, switch7: true,
    slider1: 60, slider2: 2500,
    rate1: 3, rate2: 4,
  };

  layout = { name: '', email: '', role: 'admin', active: true };
  wizard = { name: '', email: '', address: '', city: '' };

  readonly cities = ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte', 'Porto Alegre', 'Salvador', 'Fortaleza', 'Manaus', 'Recife', 'Brasília'];

  readonly componentsUsed = [
    'input (text, email, password, textarea)',
    'select (com ícone e múltiplo)',
    'checkbox e radio (com tipos)',
    'app-switch (todos os tipos)',
    'range (slider nativo)',
    'tx-rate (estrelas)',
    'input type="date"',
    'input type="time"',
    'datalist (autocomplete)',
    'tag inputs (taginput)',
    'tabs (is-boxed)',
    'tx-steps (form wizard)',
    'field is-horizontal',
    'field grouped + addons',
  ];

  readonly formPreview = computed(() => JSON.stringify(this.form, null, 2));

  validate(): boolean {
    const e: FormErrors = { name: '', email: '', password: '', profile: '' };
    if (!this.form.name) e.name = 'Nome é obrigatório';
    if (!this.form.email) e.email = 'E-mail é obrigatório';
    if (!this.form.password) e.password = 'Senha é obrigatória';
    else if (this.form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (!this.form.profile) e.profile = 'Selecione um perfil';
    this.errors.set(e);
    return !Object.values(e).some(Boolean);
  }

  async handleSubmit(): Promise<void> {
    if (!this.validate()) return;
    this.saving.set(true);
    await new Promise((r) => setTimeout(r, 800));
    this.saving.set(false);
    this.ui.notifySuccess('Cadastro salvo com sucesso!');
  }

  handleReset(): void {
    this.form = {
      name: '', email: '', phone: '', birthdate: '', city: '', bio: '',
      password: '', profile: '', workTime: '',
      tags: [], active: true, notifications: true, rating: 4,
      gender: 'M', permissions: ['read'],
    };
    this.tagInput = '';
    this.errors.set({ name: '', email: '', password: '', profile: '' });
  }

  togglePerm(perm: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.form.permissions.includes(perm)) this.form.permissions = [...this.form.permissions, perm];
    } else {
      this.form.permissions = this.form.permissions.filter((p) => p !== perm);
    }
  }

  addTag(e: Event): void {
    e.preventDefault();
    const v = this.tagInput.trim();
    if (v && !this.form.tags.includes(v)) this.form.tags = [...this.form.tags, v];
    this.tagInput = '';
  }

  removeTag(i: number): void {
    this.form.tags = this.form.tags.filter((_, idx) => idx !== i);
  }
}
