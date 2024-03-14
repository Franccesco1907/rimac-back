import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'planet' })
export class Planet extends AbstractEntity<Planet> {
  @Column('text', { nullable: false })
  climate: string;
  @Column('text', { nullable: false })
  diameter: string;
  @Column('text', { nullable: false })
  gravity: string;
  @Column('text', { nullable: false })
  name: string;
  @Column('text', { nullable: false })
  population: string;
  @Column('text', { nullable: false })
  terrain: string;
  @Column('text', { nullable: false })
  url: string;
  // @Column('text', { nullable: false, array: true, default: [] })
  // residents: string[];
}
