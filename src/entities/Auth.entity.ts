import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('Auth', { schema: 'frendar_dev' })
export class Auth {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'snsId', nullable: true, length: 45 })
  snsId: string | null;

  @Column('varchar', { name: 'provider', nullable: true, length: 45 })
  provider: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.auth)
  user: User;
}
