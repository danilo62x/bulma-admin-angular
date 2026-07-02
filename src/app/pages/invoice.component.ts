import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { UiService } from '../core/services/ui.service';

interface InvoiceItem {
  desc: string;
  detail: string;
  qty: number;
  unit: number;
}

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="tx-invoice-topbar">
        <div>
          <h1 class="title is-4" style="margin-bottom: 0.25rem;">Fatura</h1>
          <p class="subtitle is-6 has-text-grey">Detalhamento da cobrança e itens do pedido.</p>
        </div>
        <div class="buttons">
          <button class="button is-primary" (click)="ui.notifySuccess('Download da fatura iniciado!')">
            <span class="icon"><span class="mdi mdi-download"></span></span><span>Baixar PDF</span>
          </button>
          <button class="button is-light" (click)="ui.notifySuccess('Enviando para a impressora...')">
            <span class="icon"><span class="mdi mdi-printer"></span></span><span>Imprimir</span>
          </button>
          <button class="button is-light" (click)="ui.notifySuccess('Fatura enviada por email!')">
            <span class="icon"><span class="mdi mdi-email-outline"></span></span><span>Enviar</span>
          </button>
        </div>
      </div>

      <div class="box tx-invoice">
        <div class="tx-invoice-header">
          <div class="tx-invoice-brand">
            <div class="tx-invoice-logo"><span class="mdi mdi-flash"></span></div>
            <div>
              <p class="tx-invoice-company">Acme Tecnologia Ltda.</p>
              <p class="has-text-grey is-size-7">contato&#64;acme.com.br</p>
            </div>
          </div>
          <div class="tx-invoice-meta">
            <h2 class="title is-5" style="margin-bottom: 0.25rem;">FATURA #2026-0042</h2>
            <p class="has-text-grey is-size-7">Emissão: 28/05/2026</p>
            <p class="has-text-grey is-size-7">Vencimento: 12/06/2026</p>
            <span class="tag mt-2" [class]="paid ? 'is-success is-light' : 'is-warning is-light'">
              {{ paid ? 'Pago' : 'Pendente' }}
            </span>
          </div>
        </div>

        <div class="columns tx-invoice-parties">
          <div class="column">
            <p class="tx-invoice-label">De</p>
            <p class="tx-invoice-party-name">Acme Tecnologia Ltda.</p>
            <p class="tx-invoice-party-line">CNPJ: 12.345.678/0001-90</p>
            <p class="tx-invoice-party-line">Av. Paulista, 1000 — Sala 142</p>
            <p class="tx-invoice-party-line">São Paulo, SP — 01310-100</p>
          </div>
          <div class="column has-text-right-tablet">
            <p class="tx-invoice-label">Para</p>
            <p class="tx-invoice-party-name">Marina Costa — Studio MC</p>
            <p class="tx-invoice-party-line">CNPJ: 98.765.432/0001-21</p>
            <p class="tx-invoice-party-line">Rua das Flores, 250 — Conj. 8</p>
            <p class="tx-invoice-party-line">Belo Horizonte, MG — 30140-071</p>
          </div>
        </div>

        <div class="table-container">
          <table class="table is-fullwidth tx-invoice-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th class="has-text-centered">Qtd.</th>
                <th class="has-text-right">Preço unit.</th>
                <th class="has-text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of ITEMS">
                <td>
                  <p class="tx-invoice-item-desc">{{ item.desc }}</p>
                  <p class="has-text-grey is-size-7">{{ item.detail }}</p>
                </td>
                <td class="has-text-centered">{{ item.qty }}</td>
                <td class="has-text-right">{{ brl(item.unit) }}</td>
                <td class="has-text-right tx-invoice-item-total">{{ brl(item.qty * item.unit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="tx-invoice-summary-wrap">
          <div class="tx-invoice-summary">
            <div class="tx-invoice-summary-row">
              <span class="has-text-grey">Subtotal</span>
              <span class="has-text-weight-medium">{{ brl(subtotal) }}</span>
            </div>
            <div class="tx-invoice-summary-row">
              <span class="has-text-grey">Desconto</span>
              <span class="has-text-weight-medium has-text-success">− {{ brl(discount) }}</span>
            </div>
            <div class="tx-invoice-summary-row">
              <span class="has-text-grey">Impostos (5%)</span>
              <span class="has-text-weight-medium">{{ brl(tax) }}</span>
            </div>
            <div class="tx-invoice-summary-row tx-invoice-summary-total">
              <span class="has-text-weight-semibold">Total</span>
              <span class="tx-invoice-total-value">{{ brl(total) }}</span>
            </div>
          </div>
        </div>

        <div class="notification tx-invoice-note">
          <div class="tx-invoice-note-inner">
            <span class="mdi mdi-information-outline tx-invoice-note-icon"></span>
            <div>
              <p class="has-text-weight-medium">Observações</p>
              <p class="is-size-7" style="margin-top: 0.25rem;">
                Pagamento via PIX, boleto ou cartão de crédito. Em caso de atraso, será aplicada multa
                de 2% acrescida de juros de 1% ao mês. Obrigado pela preferência!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .tx-invoice-topbar { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; }
      .tx-invoice-topbar .buttons { margin-bottom: 0; }
      .tx-invoice { max-width: 56rem; margin: 0 auto; padding: 2.5rem; }
      .tx-invoice-header { display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid var(--tx-border); padding-bottom: 2rem; margin-bottom: 2rem; }
      .tx-invoice-brand { display: flex; align-items: center; gap: 0.75rem; }
      .tx-invoice-logo { width: 48px; height: 48px; border-radius: 12px; background: var(--tx-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
      .tx-invoice-company { font-size: 1.1rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-invoice-meta { text-align: right; }
      .tx-invoice-parties { margin-bottom: 1rem; }
      .tx-invoice-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--tx-text-muted); margin-bottom: 0.5rem; }
      .tx-invoice-party-name { font-size: 0.9rem; font-weight: 600; color: var(--tx-text-heading); }
      .tx-invoice-party-line { font-size: 0.875rem; color: var(--tx-text); }
      .tx-invoice-table thead th { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tx-text-muted); border-bottom: 1px solid var(--tx-border); }
      .tx-invoice-item-desc { font-weight: 600; color: var(--tx-text-heading); }
      .tx-invoice-item-total { font-weight: 600; color: var(--tx-text-heading); }
      .tx-invoice-summary-wrap { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
      .tx-invoice-summary { width: 100%; max-width: 20rem; display: flex; flex-direction: column; gap: 0.75rem; }
      .tx-invoice-summary-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; }
      .tx-invoice-summary-total { border-top: 1px solid var(--tx-border); padding-top: 0.75rem; }
      .tx-invoice-total-value { font-size: 1.25rem; font-weight: 800; color: var(--tx-primary); }
      .tx-invoice-note { margin-top: 2rem; background: var(--tx-body-bg); }
      .tx-invoice-note-inner { display: flex; align-items: flex-start; gap: 0.75rem; }
      .tx-invoice-note-icon { color: var(--tx-primary); font-size: 1.2rem; flex-shrink: 0; }
      @media print { .tx-invoice-topbar { display: none; } }
      @media screen and (max-width: 768px) { .tx-invoice-meta { text-align: left; } .tx-invoice { padding: 1.5rem; } }
    `,
  ],
})
export class InvoiceComponent {
  readonly ui = inject(UiService);

  readonly ITEMS: InvoiceItem[] = [
    { desc: 'Plano Pro — assinatura anual', detail: '01/06/2026 a 31/05/2027', qty: 1, unit: 1548.0 },
    { desc: 'Usuários adicionais', detail: '5 assentos extras', qty: 5, unit: 29.0 },
    { desc: 'Armazenamento extra', detail: 'Pacote de 250 GB', qty: 2, unit: 49.0 },
    { desc: 'Suporte prioritário 24/7', detail: 'Add-on mensal', qty: 1, unit: 199.0 },
  ];

  private readonly BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  brl = (v: number) => this.BRL.format(v);

  readonly subtotal = this.ITEMS.reduce((sum, i) => sum + i.qty * i.unit, 0);
  readonly discount = 90.0;
  readonly taxBase = this.subtotal - this.discount;
  readonly tax = this.taxBase * 0.05;
  readonly total = this.taxBase + this.tax;
  readonly paid = false;
}
