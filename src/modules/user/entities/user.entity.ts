import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name?: string

    @Column({ nullable: false })
    identifier: string

    @Column({ nullable: true })
    bio?: string

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn({ nullable: true })
    updatedAt: Date

    static create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>) : UserEntity {
        const entity = new UserEntity()
        entity.name = user.name;
        entity.identifier = user.identifier;
        return entity;
    }
}