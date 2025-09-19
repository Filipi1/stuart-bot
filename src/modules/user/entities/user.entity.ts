import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    username: string

    @Column({ name: "display_name", nullable: true })
    displayName?: string

    @Column({ nullable: false })
    token: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
    
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    static create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>) : UserEntity {
        const entity = new UserEntity()
        entity.username = user.username;
        entity.displayName = user.displayName;
        entity.token = user.token;
        return entity;
    }
}