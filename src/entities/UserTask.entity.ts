import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './Task.entity';
import { User } from './User.entity';

@Entity('UserTask', { schema: 'frendar_dev' })
export class UserTask {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'taskId' })
  taskId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'color', length: 45 })
  color: string;

  @Column('boolean', { name: 'isPrivate' })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Task, (task) => task.userTasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'taskId', referencedColumnName: 'id' }])
  task: Task;

  @ManyToOne(() => User, (user) => user.userTasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
