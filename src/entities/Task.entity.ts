import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column('varchar', { name: 'title', length: 64 })
  title: string;

  @Column('varchar', { name: 'location', length: 255 })
  location: string;

  @Column('datetime', { name: 'startTime', nullable: true })
  startTime: Date;

  @Column('datetime', { name: 'endTime', nullable: true })
  endTime: Date;

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
