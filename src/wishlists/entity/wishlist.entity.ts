import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Wish } from '../../wishes/entity/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
