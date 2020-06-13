import XRegExp from "xregexp";
import { BaseError } from "../errors";

const conflict_detail_parser = XRegExp(
  `
   ^Key\\s
   \\( (?<field> [^\\)]+ ) \\)
   =
   \\( (?<value> [^\\)]+ )\\)
`,
  "x"
);

export class ConflictError extends BaseError {
  public field: string | null = null;
  public value: string | null = null;
  public constraint: string | null = null;
  public details: any;

  constructor(message: string, err: any = null) {
    super();
    if (err) {
      const matches = XRegExp.exec(err.detail, conflict_detail_parser) as any;

      if (matches) {
        this.field = matches.field;
        this.value = matches.value;
      }

      this.details = err.detail;
      this.constraint = err.constraint;
    }

    this.message = message;

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class ForeignKeyViolationError extends BaseError {
  public field: string | null = null;
  public value: string | null = null;
  public details: any;

  constructor(message: string, err: any) {
    super();

    if (err) {
      const matches = XRegExp.exec(err.detail, conflict_detail_parser) as any;
      this.field = matches.field;
      this.value = matches.value;
      this.details = err.details;
    }

    this.message = message;

    Object.setPrototypeOf(this, ForeignKeyViolationError.prototype);
  }
}

export class ExpiredTokenError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, ExpiredTokenError.prototype);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class EntityDeleted extends BaseError {
  constructor(entity_name: string, entity_id: number | string) {
    super();

    this.message = `Entity of type ${entity_name} with id ${entity_id} is deleted.`;

    Object.setPrototypeOf(this, EntityDeleted.prototype);
  }
}

export class InvalidResetTokenError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, InvalidResetTokenError.prototype);
  }
}

export class EntityDoesNotExist extends BaseError {
  constructor(entity_name: string, entity_id: number | string) {
    super();

    this.message = `Entity of type ${entity_name} with id ${entity_id} does not exist.`;

    Object.setPrototypeOf(this, EntityDoesNotExist.prototype);
  }
}

export class DataValidationError extends BaseError {
  public details: any;

  constructor(message: string, details?: any) {
    super();

    this.details = details;
    this.message = message;

    Object.setPrototypeOf(this, DataValidationError.prototype);
  }
}

export class PreconditionFailedError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, PreconditionFailedError.prototype);
  }
}

export class InvalidArgumentError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

export class UnknownPostgresError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, UnknownPostgresError.prototype);
  }
}

export class ReprocessError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, ReprocessError.prototype);
  }
}

export class ParseError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, ParseError.prototype);
  }
}

export class UnhandledEventError extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, UnhandledEventError.prototype);
  }
}

export class TooManyRowsReturned extends BaseError {
  rows_count: number;

  constructor(message: string, rows_count: number) {
    super();

    this.message = message;
    this.rows_count = rows_count;

    Object.setPrototypeOf(this, TooManyRowsReturned.prototype);
  }
}

export class NoRowsReturned extends BaseError {
  constructor(message: string) {
    super();

    this.message = message;

    Object.setPrototypeOf(this, NoRowsReturned.prototype);
  }
}
