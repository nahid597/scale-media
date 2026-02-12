import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EJobStatus } from '../domain/job.status.enum';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  uploadId!: string;

  @Column({ type: 'varchar', length: 255 })
  userId!: string;

  @Column({ type: 'varchar', length: 255 })
  fileKey!: string;

  @Column({ type: 'enum', enum: EJobStatus, default: EJobStatus.PENDING })
  status!: EJobStatus;

  @Column({ type: 'int', default: 0 })
  progress!: number;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
