import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';
import { UserTask } from './UserTask.entity';

@Entity('Task', { schema: 'frendar_dev' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', nullable: true, length: 64 })
  title: string | null;

  @Column('varchar', { name: 'location', nullable: true, length: 255 })
  location: string | null;

  @Column('datetime', { name: 'startTime', nullable: true })
  startTime: Date | null;

  @Column('datetime', { name: 'endTime', nullable: true })
  endTime: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column('int', { name: 'userId', comment: '일정의 관리자 아이디' })
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => UserTask, (userTask) => userTask.task)
  userTasks: UserTask[];
}
