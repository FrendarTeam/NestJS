import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('RefreshToken', { schema: 'frendar_dev' })
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'refreshToken', nullable: true, length: 255 })
  refreshToken: string;

  @Column('varchar', { name: 'deviceInfo', nullable: true, length: 255 })
  deviceInfo: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column('int', { name: 'userId' })
  userId: number;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
