import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('Friend', { schema: 'frendar_dev' })
export class Friend {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'fromUserId' })
  fromUserId: number;

  @Column('int', { name: 'toUserId' })
  toUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.friends, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'toUserId', referencedColumnName: 'id' }])
  toUser: User;

  @ManyToOne(() => User, (user) => user.friends2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'fromUserId', referencedColumnName: 'id' }])
  fromUser: User;
}
