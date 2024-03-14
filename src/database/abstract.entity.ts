import { Column } from "typeorm";

export class AbstractEntity<T> {
  @Column('int', { nullable: false, primary: true })
  id: number;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  edited: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}