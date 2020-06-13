import _ from "lodash";
import * as E from "../db_config/errors";
import * as TinyPg from "tinypg";

export abstract class BaseService {
  constructor(protected ctx: ServiceContext) {}

  /**
   * Creates a new object that inherits this service in its prototype chain pinning down the database client.
   *
   * @param {TinyPg.TinyPg} db The database to pin down
   * @returns {this}
   * @memberof BaseService
   */
  withDbContext(db: TinyPg.TinyPg): this {
    return _.create(this, {
      ctx: {
        ...this.ctx,
        db: db,
      },
    });
  }

  /**
   * Expects exactly one row to be in [res] and subsequently returns that row after an optional [transform].
   *
   * @protected
   * @template T
   * @template TRow
   * @param {TinyPg.Result<TRow>} res
   * @param {(x: TRow) => T} [transformer]
   * @returns {(T | TRow)}
   * @memberof BaseService
   */
  protected assertRow<T extends object = any, TRow extends object = T>(
    res: TinyPg.Result<TRow>,
    transformer?: (x: TRow) => T
  ): T | TRow {
    if (_.size(res.rows) !== 1) {
      throw new E.NoRowsReturned("Expected exactly one row to be returned.");
    }

    const [entity] = res.rows;

    return _.isFunction(transformer) ? transformer(entity) : entity;
  }

  /**
   * Expects 0 or 1 row in [res] and optionally transforms the value with [transformer].
   *
   * @protected
   * @template T
   * @template TRow
   * @param {TinyPg.Result<TRow>} res
   * @param {(x: TRow) => T} [transformer]
   * @returns {(T | TRow | null)}
   * @memberof BaseService
   */
  protected firstRow<T extends object = any, TRow extends object = T>(
    res: TinyPg.Result<TRow>,
    transformer?: (x: TRow) => T
  ): T | TRow | null {
    if (res.rows.length > 1) {
      throw new E.TooManyRowsReturned(
        "Multiple rows found, but expected only one.",
        res.rows.length
      );
    }

    if (_.isEmpty(res.rows)) {
      return null;
    }

    const [entity] = res.rows;

    return _.isFunction(transformer) ? transformer(entity) : entity;
  }

  /**
   * Collects zero or more rows into an array and calls [transform] for each.
   *
   * @protected
   * @template T
   * @param {TinyPg.Result<any>} res
   * @param {(data: any) => T} transformer
   * @returns {T[]}
   * @memberof BaseService
   */
  protected allRows<T>(
    res: TinyPg.Result<any>,
    transformer: (data: any) => T
  ): T[] {
    return _.isFunction(transformer) ? _.map(res.rows, transformer) : res.rows;
  }

  /**
   * Expects exactly one row and performs an optional [transformer].
   * If no row is found an error indicating the [entity_name] and identifier [entity_id] is thrown.
   *
   * @protected
   * @template T
   * @param {string} entity_name
   * @param {(string | number)} entity_id
   * @param {TinyPg.Result<T>} results
   * @param {(x: T) => T} [transformer]
   * @returns {T}
   * @memberof BaseService
   */
  protected assertEntityExists<T extends object = any>(
    entity_name: string,
    entity_id: string | number,
    results: TinyPg.Result<T>,
    transformer?: (x: T) => T
  ): T {
    const entity = this.firstRow<T>(results, transformer);

    if (_.isNil(entity)) {
      throw new E.EntityDoesNotExist(entity_name, entity_id);
    }

    if (_.isArray(entity) && _.isEmpty(entity)) {
      throw new E.EntityDoesNotExist(entity_name, entity_id);
    }

    return entity;
  }
}
