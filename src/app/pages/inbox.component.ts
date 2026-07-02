import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { ModalComponent } from '../components/ui/modal.component';

type FolderId = 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash';

interface Folder {
  id: FolderId;
  label: string;
  icon: string;
}

interface Email {
  id: string;
  folder: FolderId;
  sender: string;
  initials: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  starred: boolean;
  accent: string;
}

const ACCENTS = ['#485fc7', '#48c774', '#f59e0b', '#f14668', '#3273dc'];

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="tx-inbox-head">
        <div>
          <h1 class="title is-5" style="margin-bottom: 0.15rem;">Caixa de entrada</h1>
          <p class="is-size-7 has-text-grey">Gerencie suas mensagens em um só lugar.</p>
        </div>
        <button class="button is-primary" (click)="composeOpen.set(true)">
          <span class="icon"><span class="mdi mdi-email-plus"></span></span>
          <span>Escrever</span>
        </button>
      </div>

      <div class="columns">
        <aside class="column is-3-desktop is-2-widescreen is-hidden-touch">
          <div class="box" style="padding: 0.5rem;">
            <aside class="menu">
              <ul class="menu-list">
                <li *ngFor="let f of FOLDERS">
                  <a class="tx-folder-link" [class.is-active]="activeFolder() === f.id" (click)="changeFolder(f.id)">
                    <span class="tx-folder-label">
                      <span class="mdi" [class]="f.icon"></span>
                      {{ f.label }}
                    </span>
                    <span
                      *ngIf="folderCounts()[f.id] > 0"
                      class="tag is-rounded"
                      [class]="activeFolder() === f.id ? 'is-primary' : 'is-light'"
                    >
                      {{ folderCounts()[f.id] }}
                    </span>
                  </a>
                </li>
              </ul>
            </aside>
          </div>
        </aside>

        <div class="column is-12 is-hidden-desktop">
          <div class="field">
            <div class="control has-icons-left">
              <span class="select is-fullwidth">
                <select [ngModel]="activeFolder()" (ngModelChange)="changeFolder($event)">
                  <option *ngFor="let f of FOLDERS" [value]="f.id">
                    {{ f.label }}{{ folderCounts()[f.id] > 0 ? ' (' + folderCounts()[f.id] + ')' : '' }}
                  </option>
                </select>
              </span>
              <span class="icon is-left"><i class="mdi mdi-folder"></i></span>
            </div>
          </div>
        </div>

        <section class="column is-4-desktop is-4-widescreen" [class.is-hidden-touch]="selected()">
          <div class="box" style="padding: 0;">
            <div class="tx-inbox-search">
              <div class="control has-icons-left">
                <input class="input is-small" type="text" placeholder="Buscar e-mails..." [(ngModel)]="search" />
                <span class="icon is-left"><i class="mdi mdi-magnify"></i></span>
              </div>
            </div>
            <ul class="tx-email-list">
              <li *ngFor="let e of list()">
                <a class="tx-email-item" [class.is-selected]="selectedId() === e.id" (click)="openEmail(e.id)">
                  <span class="tx-email-avatar" [style.--avatar-color]="e.accent">{{ e.initials }}</span>
                  <div class="tx-email-main">
                    <div class="tx-email-row">
                      <span class="tx-email-sender" [class.is-unread]="e.unread">{{ e.sender }}</span>
                      <span class="is-size-7 has-text-grey">{{ e.time }}</span>
                    </div>
                    <p class="tx-email-subject" [class.is-unread]="e.unread">{{ e.subject }}</p>
                    <p class="tx-email-preview">{{ e.preview }}</p>
                  </div>
                  <div class="tx-email-aside">
                    <span *ngIf="e.unread" class="tx-email-dot"></span>
                    <span class="tx-email-star" [class.is-starred]="e.starred" (click)="$event.stopPropagation(); toggleStar(e.id)">
                      <span class="mdi" [class]="e.starred ? 'mdi-star' : 'mdi-star-outline'"></span>
                    </span>
                  </div>
                </a>
              </li>
              <li *ngIf="list().length === 0" class="tx-email-empty">
                <span class="mdi mdi-email-off-outline" style="font-size: 1.6rem;"></span>
                <p class="is-size-7 has-text-grey">Nenhuma mensagem nesta pasta.</p>
              </li>
            </ul>
          </div>
        </section>

        <section class="column" [class.is-hidden-touch]="!selected()">
          <div class="box tx-reading-pane">
            <ng-container *ngIf="selected() as sel; else emptyPane">
              <header class="tx-reading-head">
                <div class="tx-reading-from">
                  <button class="button is-light is-small is-hidden-desktop" aria-label="Voltar" (click)="selectedId.set(null)">
                    <span class="icon"><span class="mdi mdi-arrow-left"></span></span>
                  </button>
                  <span class="tx-email-avatar is-large" [style.--avatar-color]="sel.accent">{{ sel.initials }}</span>
                  <div>
                    <h2 class="tx-reading-subject">{{ sel.subject }}</h2>
                    <p class="is-size-7" style="color: var(--tx-text);">{{ sel.sender }}</p>
                    <p class="is-size-7 has-text-grey">{{ sel.email }}</p>
                  </div>
                </div>
                <div class="tx-reading-actions">
                  <button class="button is-light is-small" [class.tx-star-active]="sel.starred" title="Favoritar" (click)="toggleStar(sel.id)">
                    <span class="icon"><span class="mdi" [class]="sel.starred ? 'mdi-star' : 'mdi-star-outline'"></span></span>
                  </button>
                  <button class="button is-light is-small" title="Arquivar" (click)="ui.notifySuccess('Mensagem arquivada')">
                    <span class="icon"><span class="mdi mdi-download"></span></span>
                  </button>
                  <button class="button is-light is-small" title="Excluir" (click)="deleteEmail()">
                    <span class="icon"><span class="mdi mdi-delete"></span></span>
                  </button>
                </div>
              </header>
              <div class="tx-reading-body">{{ sel.body }}</div>
              <footer class="tx-reading-foot">
                <button class="button is-light" (click)="composeOpen.set(true)">
                  <span class="icon"><span class="mdi mdi-reply"></span></span>
                  <span>Responder</span>
                </button>
              </footer>
            </ng-container>
            <ng-template #emptyPane>
              <div class="tx-reading-empty">
                <span class="tx-reading-empty-icon"><span class="mdi mdi-email-outline"></span></span>
                <p class="has-text-weight-medium" style="color: var(--tx-text-heading);">Selecione uma mensagem</p>
                <p class="is-size-7 has-text-grey">Escolha um e-mail na lista para visualizar o conteúdo.</p>
              </div>
            </ng-template>
          </div>
        </section>
      </div>

      <app-modal [open]="composeOpen()" (openChange)="composeOpen.set($event)" width="560px">
        <header class="modal-card-head">
          <div>
            <p class="modal-card-title">Nova mensagem</p>
            <p class="is-size-7 has-text-grey">Escreva e envie um e-mail</p>
          </div>
          <button class="delete" (click)="composeOpen.set(false)"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Para</label>
            <div class="control has-icons-left">
              <input class="input" type="email" placeholder="destinatario@email.com" [(ngModel)]="composeForm.to" />
              <span class="icon is-left"><i class="mdi mdi-account"></i></span>
            </div>
          </div>
          <div class="field">
            <label class="label">Assunto</label>
            <div class="control has-icons-left">
              <input class="input" type="text" placeholder="Assunto da mensagem" [(ngModel)]="composeForm.subject" />
              <span class="icon is-left"><i class="mdi mdi-format-title"></i></span>
            </div>
          </div>
          <div class="field">
            <label class="label">Mensagem</label>
            <div class="control">
              <textarea class="textarea" rows="6" placeholder="Escreva sua mensagem..." [(ngModel)]="composeForm.body"></textarea>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot tx-modal-foot">
          <button class="button" (click)="composeOpen.set(false)">Cancelar</button>
          <button class="button is-primary" (click)="sendMessage()">
            <span class="icon"><span class="mdi mdi-send"></span></span>
            <span>Enviar</span>
          </button>
        </footer>
      </app-modal>
    </div>
  `,
  styles: [
    `
      .tx-inbox-head { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
      @media (min-width: 769px) { .tx-inbox-head { flex-direction: row; align-items: flex-end; justify-content: space-between; } }
      /* Bulma '.menu-list a' (0,1,1) outweighs '.tx-folder-link'; scope to .menu-list a
         so the row really lays out label + count badge inline instead of wrapping. */
      .menu-list a.tx-folder-link { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
      .tx-folder-link .tag { flex-shrink: 0; }
      /* Keep the count badge readable on the active (primary) folder */
      .menu-list a.tx-folder-link.is-active .tag.is-primary { background: rgba(255, 255, 255, 0.25); color: #fff; }
      .tx-folder-label { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
      .tx-folder-label .mdi { font-size: 1.1rem; }
      .tx-inbox-search { padding: 0.75rem; border-bottom: 1px solid var(--tx-border-subtle); }
      .tx-email-list { max-height: 640px; overflow-y: auto; }
      .tx-email-item { display: flex; gap: 0.75rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--tx-border-subtle); transition: background var(--tx-transition); cursor: pointer; }
      .tx-email-item:hover { background: var(--tx-body-bg); }
      .tx-email-item.is-selected { background: rgba(72, 95, 199, 0.08); }
      .tx-email-avatar { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; color: #fff; background: var(--avatar-color, var(--tx-primary)); }
      .tx-email-avatar.is-large { width: 2.75rem; height: 2.75rem; font-size: 0.85rem; }
      .tx-email-main { min-width: 0; flex: 1; }
      .tx-email-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
      .tx-email-sender { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.875rem; color: var(--tx-text); }
      .tx-email-sender.is-unread { font-weight: 600; color: var(--tx-text-heading); }
      .tx-email-subject { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.875rem; color: var(--tx-text-muted); }
      .tx-email-subject.is-unread { font-weight: 500; color: var(--tx-text-heading); }
      .tx-email-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; color: var(--tx-text-muted); }
      .tx-email-aside { display: flex; flex-shrink: 0; flex-direction: column; align-items: center; justify-content: space-between; gap: 0.5rem; }
      .tx-email-dot { width: 0.5rem; height: 0.5rem; border-radius: 999px; background: var(--tx-primary); }
      .tx-email-star { margin-top: auto; color: var(--tx-text-light); cursor: pointer; }
      .tx-email-star:hover, .tx-email-star.is-starred { color: var(--tx-warning); }
      .tx-email-empty { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 3rem 1rem; color: var(--tx-text-muted); }
      .tx-reading-pane { padding: 0; min-height: 460px; display: flex; flex-direction: column; }
      .tx-reading-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; padding: 1.25rem; border-bottom: 1px solid var(--tx-border-subtle); }
      .tx-reading-from { display: flex; align-items: flex-start; gap: 0.75rem; }
      .tx-reading-subject { font-size: 1rem; font-weight: 600; color: var(--tx-text-heading); }
      .tx-reading-actions { display: flex; align-items: center; gap: 0.35rem; }
      .tx-reading-actions .tx-star-active .mdi { color: var(--tx-warning); }
      .tx-reading-body { flex: 1; padding: 1.25rem; font-size: 0.875rem; line-height: 1.6; color: var(--tx-text); white-space: pre-line; }
      .tx-reading-foot { padding: 1.25rem; border-top: 1px solid var(--tx-border-subtle); }
      .tx-reading-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6rem; min-height: 400px; padding: 2.5rem; text-align: center; }
      .tx-reading-empty-icon { display: inline-flex; align-items: center; justify-content: center; width: 3.5rem; height: 3.5rem; border-radius: var(--tx-radius); background: rgba(72, 95, 199, 0.1); color: var(--tx-primary); }
      .tx-reading-empty-icon .mdi { font-size: 1.6rem; }
      .tx-modal-foot { justify-content: flex-end; }
    `,
  ],
})
export class InboxComponent {
  readonly ui = inject(UiService);

  readonly FOLDERS: Folder[] = [
    { id: 'inbox', label: 'Caixa de entrada', icon: 'mdi-email' },
    { id: 'sent', label: 'Enviados', icon: 'mdi-send' },
    { id: 'drafts', label: 'Rascunhos', icon: 'mdi-pencil' },
    { id: 'starred', label: 'Com estrela', icon: 'mdi-star' },
    { id: 'trash', label: 'Lixeira', icon: 'mdi-delete' },
  ];

  readonly emails = signal<Email[]>([
    { id: '1', folder: 'inbox', sender: 'Marina Costa', initials: 'MC', email: 'marina.costa@empresa.com', subject: 'Proposta comercial atualizada', preview: 'Olá! Segue em anexo a versão revisada da proposta com os novos valores...', body: 'Olá!\n\nSegue em anexo a versão revisada da proposta comercial com os novos valores discutidos na reunião de ontem. Ajustei as condições de pagamento e incluí o desconto para contrato anual.\n\nPode revisar e me dizer se podemos seguir? Fico no aguardo.\n\nAbraços,\nMarina', time: '09:42', unread: true, starred: true, accent: ACCENTS[0] },
    { id: '2', folder: 'inbox', sender: 'Equipe Financeiro', initials: 'EF', email: 'financeiro@empresa.com', subject: 'Fatura de maio disponível', preview: 'Sua fatura referente ao mês de maio já está disponível para download...', body: 'Prezado cliente,\n\nSua fatura referente ao mês de maio já está disponível para download no portal. O vencimento é dia 10/06/2026.\n\nQualquer dúvida estamos à disposição.\n\nAtenciosamente,\nEquipe Financeiro', time: '08:15', unread: true, starred: false, accent: ACCENTS[1] },
    { id: '3', folder: 'inbox', sender: 'Lucas Pereira', initials: 'LP', email: 'lucas.p@parceiro.io', subject: 'Re: Integração da API', preview: 'Perfeito, consegui rodar os testes aqui e tudo passou. Vamos para produção?', body: 'Fala!\n\nPerfeito, consegui rodar os testes aqui no ambiente de homologação e tudo passou sem erros. As credenciais novas funcionaram normalmente.\n\nPodemos agendar o deploy para produção ainda esta semana?\n\nValeu,\nLucas', time: 'Ontem', unread: true, starred: false, accent: ACCENTS[2] },
    { id: '4', folder: 'inbox', sender: 'Aline Souza', initials: 'AS', email: 'aline.souza@design.co', subject: 'Mockups da nova landing page', preview: 'Terminei os mockups da home e da página de preços. Dá uma olhada...', body: 'Oi!\n\nTerminei os mockups da home e da página de preços. Tentei seguir o novo guia de marca com as cores atualizadas.\n\nDeixei os arquivos no Figma, o link está no canal do projeto. Aguardo seu feedback!\n\nAbraços,\nAline', time: 'Ontem', unread: false, starred: true, accent: ACCENTS[3] },
    { id: '5', folder: 'inbox', sender: 'Rafael Lima', initials: 'RL', email: 'rafael@enterprise.com', subject: 'Reunião de alinhamento - quinta', preview: 'Pessoal, vamos confirmar a reunião de alinhamento para quinta às 14h?', body: 'Pessoal,\n\nVamos confirmar a reunião de alinhamento para quinta-feira às 14h? Pauta:\n\n- Roadmap do trimestre\n- Métricas de retenção\n- Próximos contratos\n\nMandem confirmação de presença.\n\nObrigado,\nRafael', time: '23 mai', unread: false, starred: false, accent: ACCENTS[4] },
    { id: '6', folder: 'sent', sender: 'Você', initials: 'EU', email: 'voce@empresa.com', subject: 'Re: Proposta comercial atualizada', preview: 'Recebido, Marina! Vou revisar hoje à tarde e te retorno até amanhã.', body: 'Recebido, Marina!\n\nVou revisar hoje à tarde e te retorno até amanhã com qualquer ajuste necessário. À primeira vista parece ótimo.\n\nObrigado,', time: '10:05', unread: false, starred: false, accent: ACCENTS[0] },
    { id: '7', folder: 'sent', sender: 'Você', initials: 'EU', email: 'voce@empresa.com', subject: 'Relatório semanal', preview: 'Segue o relatório semanal com os principais indicadores da equipe.', body: 'Time,\n\nSegue o relatório semanal com os principais indicadores. Crescemos 8% em conversões e reduzimos o tempo de resposta do suporte.\n\nDetalhes no anexo.', time: '22 mai', unread: false, starred: false, accent: ACCENTS[1] },
    { id: '8', folder: 'drafts', sender: 'Rascunho', initials: 'RA', email: 'voce@empresa.com', subject: 'Ideias para o próximo evento', preview: 'Algumas ideias iniciais para o evento de lançamento do produto...', body: 'Algumas ideias iniciais para o evento de lançamento do produto:\n\n- Local: auditório principal\n- Formato híbrido (presencial + online)\n- Convidar parceiros estratégicos\n\n(rascunho não finalizado)', time: '20 mai', unread: false, starred: false, accent: ACCENTS[2] },
  ]);

  readonly activeFolder = signal<FolderId>('inbox');
  readonly selectedId = signal<string | null>('1');
  search = '';
  readonly searchSig = signal('');
  readonly composeOpen = signal(false);
  composeForm = { to: '', subject: '', body: '' };

  readonly folderCounts = computed<Record<FolderId, number>>(() => {
    const counts: Record<FolderId, number> = { inbox: 0, sent: 0, drafts: 0, starred: 0, trash: 0 };
    for (const e of this.emails()) {
      if (e.folder === 'inbox' && e.unread) counts.inbox++;
      if (e.folder === 'sent') counts.sent++;
      if (e.folder === 'drafts') counts.drafts++;
      if (e.starred) counts.starred++;
      if (e.folder === 'trash') counts.trash++;
    }
    return counts;
  });

  readonly list = computed(() =>
    this.emails().filter((e) => {
      const inFolder = this.activeFolder() === 'starred' ? e.starred : e.folder === this.activeFolder();
      if (!inFolder) return false;
      const q = this.search.toLowerCase();
      if (q) {
        return (
          e.sender.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.preview.toLowerCase().includes(q)
        );
      }
      return true;
    })
  );

  readonly selected = computed(() => this.emails().find((e) => e.id === this.selectedId()) ?? null);

  openEmail(id: string): void {
    this.selectedId.set(id);
    this.emails.update((arr) => arr.map((e) => (e.id === id ? { ...e, unread: false } : e)));
  }

  toggleStar(id: string): void {
    this.emails.update((arr) => arr.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  }

  changeFolder(id: FolderId): void {
    this.activeFolder.set(id);
    this.selectedId.set(null);
  }

  deleteEmail(): void {
    const sel = this.selected();
    if (!sel) return;
    this.emails.update((arr) => arr.map((e) => (e.id === sel.id ? { ...e, folder: 'trash' as FolderId } : e)));
    this.selectedId.set(null);
    this.ui.notifySuccess('Mensagem movida para a lixeira');
  }

  sendMessage(): void {
    this.composeOpen.set(false);
    this.composeForm = { to: '', subject: '', body: '' };
    this.ui.notifySuccess('Mensagem enviada com sucesso');
  }
}
