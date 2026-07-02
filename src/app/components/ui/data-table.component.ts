import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import {
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/angular-table';

/**
 * Column config for the generic DataTable. `format` returns plain text;
 * `html` returns trusted markup (e.g. a status tag) rendered via innerHTML.
 */
export interface DataColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => string;
  html?: (row: T) => string;
}

/**
 * Generic data table powered by @tanstack/angular-table (sorting, global
 * filter, client pagination), styled with Bulma.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-datatable">
      @if (searchable()) {
        <div class="field" style="max-width: 320px; margin-bottom: 1rem;">
          <div class="control has-icons-left">
            <input
              class="input"
              type="text"
              [ngModel]="globalFilter()"
              (ngModelChange)="globalFilter.set($event)"
              [placeholder]="'common.search' | transloco"
            />
            <span class="icon is-left"><i class="mdi mdi-magnify"></i></span>
          </div>
        </div>
      }

      <div class="table-container">
        <table class="table is-fullwidth is-hoverable">
          <thead>
            @for (hg of table.getHeaderGroups(); track hg.id) {
              <tr>
                @for (header of hg.headers; track header.id) {
                  <th
                    [style.cursor]="header.column.getCanSort() ? 'pointer' : 'default'"
                    [style.text-align]="columnById(header.column.id)?.align || 'left'"
                    (click)="header.column.getToggleSortingHandler()?.($event)"
                  >
                    {{ columnById(header.column.id)?.header }}
                    @if (header.column.getIsSorted() === 'asc') {
                      <span class="mdi mdi-arrow-up"></span>
                    } @else if (header.column.getIsSorted() === 'desc') {
                      <span class="mdi mdi-arrow-down"></span>
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody>
            @if (table.getRowModel().rows.length === 0) {
              <tr>
                <td
                  [attr.colspan]="columns().length"
                  class="has-text-centered has-text-grey"
                  style="padding: 2.5rem;"
                >
                  {{ 'common.noResults' | transloco }}
                </td>
              </tr>
            }
            @for (row of table.getRowModel().rows; track row.id) {
              <tr>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td [style.text-align]="columnById(cell.column.id)?.align || 'left'">
                    @let col = columnById(cell.column.id);
                    @if (col?.html) {
                      <span [innerHTML]="col!.html!(row.original)"></span>
                    } @else if (col?.format) {
                      {{ col!.format!(cell.getValue(), row.original) }}
                    } @else {
                      {{ cell.getValue() }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="level is-mobile" style="margin-top: 1rem;">
        <div class="level-left">
          <span class="is-size-7 has-text-grey">
            {{ table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 }}–{{
              min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )
            }}
            / {{ table.getFilteredRowModel().rows.length }}
          </span>
        </div>
        <div class="level-right">
          <div class="buttons has-addons">
            <button class="button is-small" [disabled]="!table.getCanPreviousPage()" (click)="table.previousPage()">
              {{ 'common.previous' | transloco }}
            </button>
            <button class="button is-small" [disabled]="!table.getCanNextPage()" (click)="table.nextPage()">
              {{ 'common.next' | transloco }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DataTableComponent<T> {
  readonly columns = input.required<DataColumn<T>[]>();
  readonly data = input.required<T[]>();
  readonly pageSize = input(10);
  readonly searchable = input(true);

  protected globalFilter = signal('');
  private sorting = signal<SortingState>([]);

  protected min = Math.min;
  protected columnById = (id: string) => this.columns().find((c) => c.key === id);

  private columnDefs = computed<ColumnDef<T, any>[]>(() =>
    this.columns().map((c) => ({
      id: c.key,
      accessorKey: c.key,
      header: c.header,
      enableSorting: c.sortable !== false,
    }))
  );

  protected table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columnDefs(),
    state: { sorting: this.sorting(), globalFilter: this.globalFilter() },
    onSortingChange: (updater) =>
      this.sorting.set(typeof updater === 'function' ? updater(this.sorting()) : updater),
    onGlobalFilterChange: (updater) =>
      this.globalFilter.set(typeof updater === 'function' ? updater(this.globalFilter()) : updater),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: this.pageSize() } },
  }));
}
