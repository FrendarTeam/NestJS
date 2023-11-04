import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Friend } from './Friend.entity';
import { RefreshToken } from './RefreshToken.entity';
import { Task } from './Task.entity';
import { Auth } from './Auth.entity';
import { UserTask } from './UserTask.entity';

@Entity('User', { schema: 'frendar_dev' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'authId' })
  authId: number;

  @Column('varchar', { name: 'phoneNumber', nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column('varchar', { name: 'nickname', nullable: false, length: 45 })
  nickname: string;

  @Column('varchar', { name: 'birthday', nullable: true, length: 15 })
  birthday: string | null;

  @Column('text', { name: 'profileUrl', nullable: true })
  profileUrl: string | null;

  @Column('boolean', {
    name: 'isNotificationEnabled',
    default: false,
    nullable: false,
  })
  isNotificationEnabled: boolean;

  @Column('varchar', {
    name: 'themeColor',
    default: 'white',
    length: 45,
    nullable: false,
  })
  themeColor: string;

  @Column('varchar', { name: 'code', nullable: false, length: 45 })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Friend, (friend) => friend.toUser)
  friends: Friend[];

  @OneToMany(() => Friend, (friend) => friend.fromUser)
  friends2: Friend[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToOne(() => Auth, (auth) => auth.user, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'authId', referencedColumnName: 'id' }])
  auth: Auth;

  @OneToMany(() => UserTask, (userTask) => userTask.user)
  userTasks: UserTask[];
}
